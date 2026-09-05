const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A review must belong to a user'],
    },
    wine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wine',
      required: [true, 'A review must belong to a wine'],
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
      required: [true, 'A review must have a rating'],
    },
    comment: {
      type: String,
      required: [true, 'A review must have a comment'],
      trim: true,
      maxlength: [1000, 'A review cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// One review per user per wine
reviewSchema.index({ user: 1, wine: 1 }, { unique: true });
reviewSchema.index({ wine: 1, createdAt: -1 });

// Populate user info whenever reviews are queried
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name avatar',
  });
  next();
});

module.exports = mongoose.model('Review', reviewSchema);
