const Review = require('../models/Review');
const Wine = require('../models/Wine');
const ApiError = require('../middleware/ApiError');
const asyncHandler = require('../middleware/asyncHandler');

// GET /api/wines/:wineId/reviews — public; supports ?page=&limit=
exports.getReviews = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));

  const [reviews, total] = await Promise.all([
    Review.find({ wine: req.params.wineId })
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Review.countDocuments({ wine: req.params.wineId }),
  ]);

  res.status(200).json({
    success: true,
    count: reviews.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: reviews,
  });
});

// POST /api/wines/:wineId/reviews (protected) — one review per user per wine
exports.createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  if (!rating || !comment) {
    throw new ApiError(400, 'Please provide a rating and a comment');
  }
  const ratingNum = Number(rating);
  if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    throw new ApiError(400, 'Rating must be an integer between 1 and 5');
  }

  const wine = await Wine.findById(req.params.wineId);
  if (!wine) throw new ApiError(404, 'Wine not found');

  const existing = await Review.findOne({
    user: req.user._id,
    wine: wine._id,
  });
  if (existing) {
    throw new ApiError(409, 'You have already reviewed this wine. Edit your existing review instead.');
  }

  const review = await Review.create({
    user: req.user._id,
    wine: wine._id,
    rating: ratingNum,
    comment,
  });

  await Wine.recalcRating(wine._id);

  const populated = await Review.findById(review._id);
  res.status(201).json({ success: true, data: populated });
});

// PUT /api/reviews/:reviewId (protected, owner only)
exports.updateReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const review = await Review.findById(req.params.reviewId);
  if (!review) throw new ApiError(404, 'Review not found');

  if (!review.user.equals(req.user._id)) {
    throw new ApiError(403, 'You can only edit your own reviews');
  }

  if (rating !== undefined) {
    const ratingNum = Number(rating);
    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      throw new ApiError(400, 'Rating must be an integer between 1 and 5');
    }
    review.rating = ratingNum;
  }
  if (comment !== undefined) {
    if (!String(comment).trim()) throw new ApiError(400, 'Comment cannot be empty');
    review.comment = comment;
  }

  await review.save();
  await Wine.recalcRating(review.wine);

  res.status(200).json({ success: true, data: review });
});

// DELETE /api/reviews/:reviewId (protected, owner only)
exports.deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.reviewId);
  if (!review) throw new ApiError(404, 'Review not found');

  if (!review.user.equals(req.user._id)) {
    throw new ApiError(403, 'You can only delete your own reviews');
  }

  const wineId = review.wine;
  await review.deleteOne();
  await Wine.recalcRating(wineId);

  res.status(200).json({ success: true, data: {} });
});

// GET /api/reviews/mine — the authenticated user's reviews (profile page)
exports.getMyReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ user: req.user._id })
    .populate('wine', 'name winery image type country')
    .sort('-createdAt')
    .lean();

  res.status(200).json({ success: true, count: reviews.length, data: reviews });
});
