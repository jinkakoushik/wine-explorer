const Wine = require('../models/Wine');
const ApiError = require('../middleware/ApiError');
const asyncHandler = require('../middleware/asyncHandler');

const FILTER_FIELDS = ['type', 'country', 'region', 'grape', 'body', 'sweetness', 'vintage'];

const SORTS = {
  rating: '-rating -numReviews name',
  name: 'name',
  price: 'price',
  priceDesc: '-price',
  newest: '-createdAt',
};

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const buildSearchQuery = (term) => {
  const rx = new RegExp(escapeRegex(term), 'i');
  return {
    $or: [
      { name: rx },
      { winery: rx },
      { grape: rx },
      { country: rx },
      { region: rx },
      { type: rx },
      { description: rx },
    ],
  };
};

// GET /api/wines — search + combined filters + sort + pagination
exports.getWines = asyncHandler(async (req, res) => {
  const query = {};

  const search = String(req.query.search || req.query.q || '').trim();
  if (search) query.$or = buildSearchQuery(search).$or;

  FILTER_FIELDS.forEach((field) => {
    if (req.query[field]) query[field] = req.query[field];
  });

  if (req.query.minPrice || req.query.maxPrice) {
    query.price = {};
    if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice) || 0;
    if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice) || 1000000;
  }
  if (req.query.minRating) {
    query.rating = { $gte: Number(req.query.minRating) || 0 };
  }

  const sort = SORTS[req.query.sort] || SORTS.rating;
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(60, Math.max(1, parseInt(req.query.limit, 10) || 12));
  const skip = (page - 1) * limit;

  const [wines, total] = await Promise.all([
    Wine.find(query).sort(sort).skip(skip).limit(limit).lean(),
    Wine.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    count: wines.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: wines,
  });
});

// GET /api/wines/search?q=term
exports.searchWines = asyncHandler(async (req, res) => {
  const q = String(req.query.q || req.query.search || '').trim();
  if (!q) throw new ApiError(400, 'Please provide a search term using ?q=');

  const wines = await Wine.find(buildSearchQuery(q))
    .sort('-rating -numReviews')
    .limit(24)
    .lean();

  res.status(200).json({ success: true, count: wines.length, data: wines });
});

// GET /api/wines/meta/options — filter options for the FilterPanel
exports.getFilterOptions = asyncHandler(async (req, res) => {
  const [countries, regions, grapes, vintages] = await Promise.all([
    Wine.distinct('country'),
    Wine.distinct('region'),
    Wine.distinct('grape'),
    Wine.distinct('vintage'),
  ]);

  res.status(200).json({
    success: true,
    data: {
      countries: countries.sort(),
      regions: regions.sort(),
      grapes: grapes.sort(),
      types: ['Red', 'White', 'Rosé', 'Sparkling', 'Dessert', 'Fortified'],
      bodies: ['Light-bodied', 'Medium-bodied', 'Full-bodied'],
      sweetness: ['Bone Dry', 'Dry', 'Off-Dry', 'Sweet', 'Very Sweet'],
      vintages: vintages.filter(Boolean).sort((a, b) => b - a),
    },
  });
});

// GET /api/wines/:id
exports.getWine = asyncHandler(async (req, res) => {
  const wine = await Wine.findById(req.params.id).lean();
  if (!wine) throw new ApiError(404, 'Wine not found');
  res.status(200).json({ success: true, data: wine });
});

// POST /api/wines (protected)
exports.createWine = asyncHandler(async (req, res) => {
  const wine = await Wine.create(req.body);
  res.status(201).json({ success: true, data: wine });
});

// PUT /api/wines/:id (protected)
exports.updateWine = asyncHandler(async (req, res) => {
  const wine = await Wine.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!wine) throw new ApiError(404, 'Wine not found');
  res.status(200).json({ success: true, data: wine });
});

// DELETE /api/wines/:id (protected)
exports.deleteWine = asyncHandler(async (req, res) => {
  const wine = await Wine.findByIdAndDelete(req.params.id);
  if (!wine) throw new ApiError(404, 'Wine not found');
  res.status(200).json({ success: true, data: {} });
});
