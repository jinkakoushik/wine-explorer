/**
 * 404 handler for unmatched API routes — runs after all route mounts.
 */
const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

module.exports = { notFound };
