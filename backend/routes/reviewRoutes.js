const express = require('express');
const {
  updateReview,
  deleteReview,
  getMyReviews,
} = require('../controllers/reviewController');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/reviews/mine — must come before /:reviewId
router.get('/mine', protect, getMyReviews);

// PUT/DELETE /api/reviews/:reviewId
router
  .route('/:reviewId')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

module.exports = router;
