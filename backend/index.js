const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/library_management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { 
    type: String, 
    required: true,
    enum: ['student', 'staff', 'admin', 'librarian', 'hod', 'principal'],
    default: 'student'
  },
  rollNumber: String,
  staffId: String,
  department: { 
    type: String, 
    required: function() {
      // Department is required for HOD and recommended for students/staff
      return this.userType === 'hod';
    }
  },
  year: String,
  libraryCardNumber: String,
  createdAt: { type: Date, default: Date.now }
});

// Index for department-based queries
userSchema.index({ department: 1, userType: 1 });
userSchema.index({ department: 1 });

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

// Admin Management Schema for Auth Codes
const adminAuthCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  role: { 
    type: String, 
    enum: ['admin', 'librarian', 'hod', 'principal'],
    required: true 
  },
  department: String, // For HOD-specific codes
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date
});

const AdminAuthCode = mongoose.model('AdminAuthCode', adminAuthCodeSchema);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_for_testing_123';

// Admin Authentication Code (should be in .env in production)
const ADMIN_AUTH_CODE = process.env.ADMIN_AUTH_CODE || 'VVIT_ADMIN_2024';

// ========== AUTH ROUTES ==========

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, userType, rollNumber, staffId, department, year, adminCode } = req.body;
    
    // Validate department for HOD
    if (userType === 'hod' && !department) {
      return res.status(400).json({
        success: false,
        message: 'Department is required for HOD'
      });
    }
    
    // Validate admin code for admin users
    if (userType === 'admin' || userType === 'librarian' || userType === 'hod' || userType === 'principal') {
      if (!adminCode) {
        return res.status(403).json({
          success: false,
          message: 'Admin authentication code is required'
        });
      }
      
      // Check against default code
      if (adminCode === ADMIN_AUTH_CODE) {
        // Default code is valid for all admin types
      } else {
        // Check against generated codes
        const validCode = await AdminAuthCode.findOne({ 
          code: adminCode, 
          isActive: true,
          role: userType,
          $or: [
            { expiresAt: { $gte: new Date() } },
            { expiresAt: null }
          ]
        });
        
        if (!validCode) {
          return res.status(403).json({
            success: false,
            message: 'Invalid or expired admin authentication code'
          });
        }
        
        // For HOD, verify department matches
        if (userType === 'hod' && validCode.department && validCode.department !== department) {
          return res.status(403).json({
            success: false,
            message: 'Department does not match the authentication code'
          });
        }
      }
    }
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
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
      staffId,
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
        staffId: user.staffId,
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
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
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
        staffId: user.staffId,
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

// Verify token middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// Get current user
app.get('/api/auth/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userType: user.userType,
        rollNumber: user.rollNumber,
        staffId: user.staffId,
        department: user.department,
        year: user.year,
        libraryCardNumber: user.libraryCardNumber
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get departments list
app.get('/api/departments', (req, res) => {
  const departments = [
    'Computer Science and Engineering (CSE)',
    'Electronics and Communication Engineering (ECE)',
    'Electrical and Electronics Engineering (EEE)',
    'Mechanical Engineering (ME)',
    'Civil Engineering (CE)',
    'Information Technology (IT)',
    'Data Science (DS)',
    'Artificial Intelligence and Machine Learning (AIML)',
    'Cyber Security (CS)',
    'Business Administration (MBA)',
    'Master of Computer Applications (MCA)',
    'Appa',
  ];
  
  res.json({
    success: true,
    departments
  });
});

// Get users by department (for admin/HOD)
app.get('/api/users/department/:department', verifyToken, async (req, res) => {
  try {
    const { department } = req.params;
    const currentUser = await User.findById(req.user.id);
    
    // Check if user has permission
    if (currentUser.userType !== 'admin' && currentUser.userType !== 'principal' && 
        (currentUser.userType !== 'hod' || currentUser.department !== department)) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      });
    }
    
    const users = await User.find({ department }).select('-password');
    
    res.json({
      success: true,
      users,
      count: users.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Generate admin auth code (for administrators)
app.post('/api/admin/generate-code', verifyToken, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    
    // Only admin and principal can generate codes
    if (currentUser.userType !== 'admin' && currentUser.userType !== 'principal') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: Only administrators can generate codes'
      });
    }
    
    const { role, department } = req.body;
    
    // Generate a unique code
    const code = `VVIT_${role.toUpperCase()}_${Date.now().toString(36).toUpperCase()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    const authCode = new AdminAuthCode({
      code,
      role,
      department: role === 'hod' ? department : undefined,
      createdBy: currentUser._id,
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days
    });
    
    await authCode.save();
    
    res.json({
      success: true,
      code,
      message: 'Auth code generated successfully',
      expiresAt: authCode.expiresAt
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get all generated auth codes (for admin management)
app.get('/api/admin/auth-codes', verifyToken, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    
    if (currentUser.userType !== 'admin' && currentUser.userType !== 'principal') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }
    
    const codes = await AdminAuthCode.find().populate('createdBy', 'firstName lastName email').sort({ createdAt: -1 });
    
    res.json({
      success: true,
      codes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Admin Auth Code: ${ADMIN_AUTH_CODE}`);
});