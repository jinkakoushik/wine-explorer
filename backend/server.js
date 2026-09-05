require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { notFound } = require('./middleware/notFound');

const app = express();

// Trust one proxy hop so req.ip works behind reverse proxies
app.set('trust proxy', 1);

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS — allow the frontend origin (comma-separated list supported)
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser tools (no Origin header) and whitelisted origins
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// Body parsing + logging + compression
app.use(express.json({ limit: '10kb' }));
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}
app.use(compression());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Wine Explorer API is running' });
});

// API routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/wines', require('./routes/wineRoutes'));
app.use('/api/countries', require('./routes/countryRoutes'));
app.use('/api/favorites', require('./routes/favoriteRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));

// 404 for unknown API routes
app.use(notFound);

// Global error handler — must be last
app.use(errorHandler);

// Parse the port defensively: ignore empty/invalid values from the environment
// (e.g. PORT="0" or PORT="") and fall back to 5000.
const parsedPort = parseInt(process.env.PORT, 10);
const PORT = Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : 5000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`✓ Wine Explorer API listening on http://localhost:${PORT} (${process.env.NODE_ENV || 'development'})`);
  });
};

start();
