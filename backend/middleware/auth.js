const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('./asyncHandler');

const Issue = (res) => {
  res.status(401).json({
    success: false,
    error: 'Not authorized. Please log in to continue.',
  });
};

/**
 * Verifies the Bearer token, attaches the authenticated user to req.user.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token || token === 'null') return Issue(res);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return Issue(res);
    req.user = user;
    next();
  } catch (err) {
    return Issue(res);
  }
});

/**
 * Optional auth: attaches req.user when a valid token is present, never blocks.
 */
const optionalAuth = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    const token = header.split(' ')[1];
    if (token && token !== 'null') {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
      } catch {
        // Invalid/expired token on a public route — treat as guest
      }
    }
  }
  next();
});

module.exports = { protect, optionalAuth };
