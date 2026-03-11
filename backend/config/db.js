const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/library_management';

  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB connected successfully');
    const dbName = MONGODB_URI.includes('/') ? MONGODB_URI.split('/').pop() : 'library_management';
    console.log(`📊 Database: ${dbName}`);
  } catch (err) {
    console.error('\n❌ MongoDB connection error:', err.message);
    console.error('\n⚠️  Please ensure MongoDB is running:');
    console.error('   1. Install MongoDB: https://www.mongodb.com/try/download/community');
    console.error('   2. Start MongoDB service:');
    console.error('      - Windows: Check Services (services.msc)');
    console.error('      - macOS: brew services start mongodb-community');
    console.error('      - Linux: sudo systemctl start mongod');
    console.error('   3. Or use MongoDB Atlas: Update MONGODB_URI in .env file');
    console.error('   4. Test connection: mongosh\n');
    console.error('⚠️  Server will start but API calls will fail until MongoDB is connected.\n');
    process.exit(1); 
  }
};

module.exports = connectDB;
