const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Config
const connectDB = require('./config/db');

// Route Files
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const librarianRoutes = require('./routes/librarianRoutes');
const hodRoutes = require('./routes/hodRoutes');
const studentRoutes = require('./routes/studentRoutes');
const messagesRoutes = require('./routes/messagesRoutes');

const app = express();

// Connect to database
connectDB();

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// JSON Parser
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/librarian', librarianRoutes);
app.use('/api/hod', hodRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/messages', messagesRoutes);

// Shared / fallback routes (e.g. for /api/books or /api/departments)
app.use('/api', adminRoutes);
app.use('/api', librarianRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStatusText = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  res.json({
    status: dbStatus === 1 ? 'healthy' : 'unhealthy',
    database: dbStatusText[dbStatus] || 'unknown',
    timestamp: new Date().toISOString(),
    message: dbStatus === 1
      ? 'Server and database are running correctly'
      : 'Database connection issue. Please check MongoDB.'
  });
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/library_management';
const ADMIN_AUTH_CODE = process.env.ADMIN_AUTH_CODE || 'VVIT_ADMIN_2024';

// Start server
app.listen(PORT, () => {
  console.log('\n🚀 ========================================');
  console.log(`   Server running on http://localhost:${PORT}`);
  console.log('🚀 ========================================\n');
  console.log('📝 Configuration:');
  console.log(`   - Port: ${PORT}`);
  console.log(`   - MongoDB: ${MONGODB_URI.split('@').pop() || MONGODB_URI}`);
  console.log(`   - Admin Auth Code: ${ADMIN_AUTH_CODE}`);
  console.log('\n✅ Server ready!\n');
});
