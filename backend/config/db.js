const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('✗ MONGO_URI is not defined. Copy backend/.env.example to backend/.env and set it.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✓ MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.error(`✗ MongoDB connection failed: ${err.message}`);
    console.error('  Is MongoDB running? With Docker: docker run -d --name wine-explorer-mongo -p 27017:27017 -v wine-explorer-mongo-data:/data/db mongo:7');
    process.exit(1);
  }
};

module.exports = connectDB;
