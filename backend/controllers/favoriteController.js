const User = require('../models/User');
const Wine = require('../models/Wine');
const ApiError = require('../middleware/ApiError');
const asyncHandler = require('../middleware/asyncHandler');

// GET /api/favorites (protected) — full wine documents for the user's favorites
exports.getFavorites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'favorites',
    select: '-__v',
  });

  res.status(200).json({
    success: true,
    count: user.favorites.length,
    data: user.favorites,
  });
});

// POST /api/favorites/:wineId (protected) — add a wine to favorites
exports.addFavorite = asyncHandler(async (req, res) => {
  const wine = await Wine.findById(req.params.wineId);
  if (!wine) throw new ApiError(404, 'Wine not found');

  if (req.user.favorites.some((id) => id.equals(wine._id))) {
    return res.status(200).json({
      success: true,
      message: 'Wine is already in favorites',
      favorites: req.user.favorites,
    });
  }

  req.user.favorites.addToSet(wine._id);
  await req.user.save();

  res.status(200).json({
    success: true,
    message: 'Added to favorites',
    favorites: req.user.favorites,
  });
});

// DELETE /api/favorites/:wineId (protected) — remove a wine from favorites
exports.removeFavorite = asyncHandler(async (req, res) => {
  await User.updateOne(
    { _id: req.user._id },
    { $pull: { favorites: req.params.wineId } }
  );

  const user = await User.findById(req.user._id);
  res.status(200).json({
    success: true,
    message: 'Removed from favorites',
    favorites: user.favorites,
  });
});
