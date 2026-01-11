
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// ========== ALLOW ALL CORS ==========
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/library_management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  userType: String,
  rollNumber: String,
  department: String,
  year: String,
  libraryCardNumber: String,
  totalBooksBorrowed: { type: Number, default: 0 },
  currentFine: { type: Number, default: 0 },
  totalFinePaid: { type: Number, default: 0 }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_for_testing_123';

// ========== AUTH ROUTES ==========

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('Register:', req.body.email);
    
    const { firstName, lastName, email, password, userType, rollNumber, department, year } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }
    
    // Create user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      userType: userType || 'student',
      rollNumber,
      department,
      year,
      libraryCardNumber: `LIB${Date.now().toString().slice(-6)}`
    });
    
    await user.save();
    
    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email, userType: user.userType },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userType: user.userType,
        rollNumber: user.rollNumber,
        department: user.department,
        year: user.year,
        libraryCardNumber: user.libraryCardNumber
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('Login attempt:', req.body.email);
    
    const { email, password } = req.body;
    
    // Find user with password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Generate token
    const token = jwt.sign(
      { id: user._id, email: user.email, userType: user.userType },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    console.log('Login successful for:', user.email);
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userType: user.userType,
        rollNumber: user.rollNumber,
        department: user.department,
        year: user.year,
        libraryCardNumber: user.libraryCardNumber
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// ========== STUDENT DASHBOARD ==========
app.get('/api/student/dashboard', async (req, res) => {
  try {
    console.log('=== DASHBOARD REQUEST ===');
    console.log('Authorization header:', req.headers.authorization);
    
    // Get token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No Bearer token found');
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    const token = authHeader.replace('Bearer ', '');
    console.log('Token received (first 20 chars):', token.substring(0, 20) + '...');
    
    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      console.log('Token decoded successfully:', decoded);
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError.message);
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
        error: jwtError.message
      });
    }
    
    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      console.log('User not found for ID:', decoded.id);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    console.log('User found:', user.email);
    
    // Generate dashboard data
    const dashboardData = {
      stats: {
        totalBooksBorrowed: user.totalBooksBorrowed || 0,
        currentBooks: Math.min(user.totalBooksBorrowed || 0, 5), // Mock
        overdueBooks: 0,
        currentFine: user.currentFine || 0,
        totalFinePaid: user.totalFinePaid || 0
      },
      activeBooks: [
        {
          id: 1,
          title: 'Introduction to Algorithms',
          author: 'Thomas H. Cormen',
          borrowedDate: '2024-01-15',
          dueDate: '2024-02-15',
          status: 'active'
        },
        {
          id: 2,
          title: 'Clean Code',
          author: 'Robert C. Martin',
          borrowedDate: '2024-01-20',
          dueDate: '2024-02-20',
          status: 'active'
        }
      ],
      upcomingDueDates: [
        {
          title: 'Introduction to Algorithms',
          dueDate: '2024-02-15',
          daysLeft: 5
        }
      ],
      recentActivity: [
        {
          action: 'Borrowed "Introduction to Algorithms"',
          date: '2024-01-15',
          time: '2 days ago'
        },
        {
          action: 'Registered in library system',
          date: '2024-01-01',
          time: '2 weeks ago'
        }
      ]
    };
    
    console.log('Sending dashboard response');
    
    res.json({
      success: true,
      message: 'Dashboard data retrieved successfully',
      dashboard: dashboardData,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userType: user.userType,
        rollNumber: user.rollNumber,
        department: user.department,
        year: user.year,
        libraryCardNumber: user.libraryCardNumber
      }
    });
    
  } catch (error) {
    console.error('❌ Dashboard error:', error);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({
      success: false,
      message: 'Server error in dashboard',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Server is working!',
    timestamp: new Date().toISOString(),
    endpoints: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      dashboard: 'GET /api/student/dashboard'
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 WORKING SERVER running on http://localhost:${PORT}`);
  console.log(`✅ CORS: ALL origins allowed`);
  console.log(`✅ JWT: Using secret key`);
  console.log(`🔗 Test: http://localhost:${PORT}/api/test`);
  console.log(`🔗 Health: http://localhost:${PORT}/api/health`);
  console.log('\n=== AVAILABLE ENDPOINTS ===');
  console.log('POST /api/auth/register - Register new user');
  console.log('POST /api/auth/login - Login user');
  console.log('GET /api/student/dashboard - Student dashboard');
  console.log('================================');
});