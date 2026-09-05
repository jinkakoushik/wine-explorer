const express = require('express');
const {
  getFavorites,
  addFavorite,
  removeFavorite,
} = require('../controllers/favoriteController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All favorites routes are protected
router.use(protect);

router.route('/').get(getFavorites);
router.route('/:wineId').post(addFavorite).delete(removeFavorite);

module.exports = router;
