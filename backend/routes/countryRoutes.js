const express = require('express');
const {
  getCountries,
  getGrapes,
} = require('../controllers/countryController');

const router = express.Router();

router.route('/').get(getCountries);
router.route('/grapes').get(getGrapes);

module.exports = router;
