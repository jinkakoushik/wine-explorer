const express = require('express');
const {
  getWines,
  searchWines,
  getFilterOptions,
  getWine,
  createWine,
  updateWine,
  deleteWine,
} = require('../controllers/wineController');
const { getReviews, createReview } = require('../controllers/reviewController');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Search must be declared before /:id so "search" is not captured as an id
router.route('/search').get(searchWines);
router.route('/meta/options').get(getFilterOptions);

router
  .route('/')
  .get(optionalAuth, getWines)
  .post(protect, createWine);

router
  .route('/:id')
  .get(optionalAuth, getWine)
  .put(protect, updateWine)
  .delete(protect, deleteWine);

// Nested reviews: list is public, create requires auth
router
  .route('/:wineId/reviews')
  .get(getReviews)
  .post(protect, createReview);

module.exports = router;
