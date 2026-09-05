const mongoose = require('mongoose');

const WINE_TYPES = ['Red', 'White', 'Rosé', 'Sparkling', 'Dessert', 'Fortified'];
const BODY_STYLES = ['Light-bodied', 'Medium-bodied', 'Full-bodied'];
const SWEETNESS_LEVELS = ['Bone Dry', 'Dry', 'Off-Dry', 'Sweet', 'Very Sweet'];
const ACIDITY_LEVELS = ['Low', 'Medium', 'High'];

const wineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A wine must have a name'],
      trim: true,
      maxlength: [160, 'Wine name cannot exceed 160 characters'],
    },
    winery: {
      type: String,
      required: [true, 'A wine must have a winery'],
      trim: true,
      maxlength: [120, 'Winery name cannot exceed 120 characters'],
    },
    country: {
      type: String,
      required: [true, 'A wine must have a country'],
      trim: true,
    },
    region: {
      type: String,
      required: [true, 'A wine must have a region'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'A wine must have a type'],
      enum: {
        values: WINE_TYPES,
        message: 'Type must be one of: ' + WINE_TYPES.join(', '),
      },
    },
    grape: {
      type: String,
      required: [true, 'A wine must have a grape variety'],
      trim: true,
    },
    vintage: {
      type: Number,
      min: [1900, 'Vintage must be 1900 or later'],
      max: [new Date().getFullYear(), 'Vintage cannot be in the future'],
    },
    alcohol: {
      type: Number,
      min: [5, 'Alcohol must be at least 5%'],
      max: [23, 'Alcohol cannot exceed 23%'],
    },
    body: {
      type: String,
      enum: { values: BODY_STYLES, message: 'Invalid body style' },
    },
    sweetness: {
      type: String,
      enum: { values: SWEETNESS_LEVELS, message: 'Invalid sweetness level' },
    },
    acidity: {
      type: String,
      enum: { values: ACIDITY_LEVELS, message: 'Invalid acidity level' },
    },
    price: {
      type: Number,
      required: [true, 'A wine must have a price'],
      min: [0, 'Price cannot be negative'],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      set: (v) => Math.round(v * 10) / 10,
    },
    // Original curated score — restored if all community reviews are removed
    baseRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    image: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'A wine must have a description'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    tastingNotes: {
      type: [String],
      default: [],
    },
    foodPairings: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes backing the explore page's search + filter + sort queries
wineSchema.index({ name: 'text', winery: 'text', grape: 'text', description: 'text' });
// Unique compound index lets the seeder upsert safely on re-runs
wineSchema.index({ name: 1, winery: 1 }, { unique: true });

// New wines fall back to their initial rating when reviews are removed
wineSchema.pre('validate', function (next) {
  if (this.isNew && !this.baseRating) {
    this.baseRating = this.rating || 0;
  }
  next();
});
wineSchema.index({ country: 1, type: 1 });
wineSchema.index({ grape: 1 });
wineSchema.index({ rating: -1, numReviews: -1 });
wineSchema.index({ price: 1 });
wineSchema.index({ createdAt: -1 });

// Static helper: recompute rating from reviews after create/update/delete.
// With reviews: rating = community average.
// Without reviews: rating falls back to the original curated baseRating.
wineSchema.statics.recalcRating = async function (wineId) {
  const Review = mongoose.model('Review');
  const stats = await Review.aggregate([
    { $match: { wine: new mongoose.Types.ObjectId(wineId) } },
    {
      $group: {
        _id: '$wine',
        numReviews: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (!stats[0]) {
    // Last review removed — restore the curated editorial score
    const wine = await this.findById(wineId).select('baseRating rating').lean();
    if (!wine) return;
    await this.findByIdAndUpdate(wineId, {
      numReviews: 0,
      rating: wine.baseRating || wine.rating || 0,
    });
    return;
  }

  await this.findByIdAndUpdate(wineId, {
    numReviews: stats[0].numReviews,
    rating: Math.round(stats[0].avgRating * 10) / 10,
  });
};

module.exports = mongoose.model('Wine', wineSchema);
module.exports.WINE_TYPES = WINE_TYPES;
module.exports.BODY_STYLES = BODY_STYLES;
module.exports.SWEETNESS_LEVELS = SWEETNESS_LEVELS;
module.exports.ACIDITY_LEVELS = ACIDITY_LEVELS;
