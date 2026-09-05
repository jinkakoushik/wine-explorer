const Wine = require('../models/Wine');
const asyncHandler = require('../middleware/asyncHandler');

// GET /api/countries — country list with wine counts, avg rating, and a sample image
exports.getCountries = asyncHandler(async (req, res) => {
  const data = await Wine.aggregate([
    {
      $group: {
        _id: '$country',
        count: { $sum: 1 },
        avgRating: { $avg: '$rating' },
        image: { $first: '$image' },
      },
    },
    {
      $project: {
        _id: 0,
        name: '$_id',
        count: 1,
        avgRating: { $round: ['$avgRating', 1] },
        image: 1,
      },
    },
    { $sort: { count: -1, name: 1 } },
  ]);

  res.status(200).json({ success: true, count: data.length, data });
});

// GET /api/countries/grapes — grape varieties with counts
exports.getGrapes = asyncHandler(async (req, res) => {
  const data = await Wine.aggregate([
    { $unwind: '$grape' },
    {
      $group: {
        _id: '$grape',
        count: { $sum: 1 },
        avgRating: { $avg: '$rating' },
        sampleImage: { $first: '$image' },
      },
    },
    {
      $project: {
        _id: 0,
        name: '$_id',
        count: 1,
        avgRating: { $round: ['$avgRating', 1] },
        sampleImage: 1,
      },
    },
    { $sort: { count: -1, name: 1 } },
  ]);

  res.status(200).json({ success: true, count: data.length, data });
});
