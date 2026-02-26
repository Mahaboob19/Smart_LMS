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
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/library_management';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    const dbName = MONGODB_URI.includes('/') ? MONGODB_URI.split('/').pop() : 'library_management';
    console.log(`📊 Database: ${dbName}`);
  })
  .catch(err => {
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
    // Don't exit - allow server to start but API calls will fail gracefully
  });

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
    required: function () {
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
userSchema.pre('save', async function (next) {
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

// Import new models
const Book = require('./models/Book');
const Transaction = require('./models/Transaction');
const Message = require('./models/Message');
const Recommendation = require('./models/Recommendation');
const BookRequest = require('./models/BookRequest');

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_for_testing_123';

// Admin Authentication Code (should be in .env in production)
const ADMIN_AUTH_CODE = process.env.ADMIN_AUTH_CODE || 'VVIT_ADMIN_2024';

// ========== AUTH ROUTES ==========

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database connection not available. Please ensure MongoDB is running.'
      });
    }

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
    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database connection not available. Please ensure MongoDB is running.'
      });
    }

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

// ========== LIBRARIAN ROUTES ==========

// Add a new book
app.post('/api/books', verifyToken, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    // Only librarian and admin can add books
    if (!['admin', 'librarian'].includes(currentUser.userType)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const { title, author, department, totalCopies, description } = req.body;

    const book = new Book({
      title,
      author,
      department,
      totalCopies,
      availableCopies: totalCopies, // Initially all copies are available
      description
    });

    await book.save();

    res.status(201).json({ success: true, message: 'Book added successfully', book });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get all books
app.get('/api/books', verifyToken, async (req, res) => {
  try {
    // Optionally add search query
    const { search } = req.query;
    let query = {};
    if (search) {
      query = { title: { $regex: search, $options: 'i' } };
    }

    const books = await Book.find(query).sort({ createdAt: -1 });
    res.json({ success: true, books });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Issue a book
app.post('/api/transactions/issue', verifyToken, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    if (!['admin', 'librarian'].includes(currentUser.userType)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const { bookId, userId, dueDate } = req.body;

    // Check if book has available copies
    const book = await Book.findById(bookId);
    if (!book || book.availableCopies <= 0) {
      return res.status(400).json({ success: false, message: 'Book not available' });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Create transaction
    const transaction = new Transaction({
      book: bookId,
      user: userId,
      dueDate
    });

    await transaction.save();

    // Decrement available copies
    book.availableCopies -= 1;
    await book.save();

    res.status(201).json({ success: true, message: 'Book issued successfully', transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get all transactions
app.get('/api/transactions', verifyToken, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    if (!['admin', 'librarian'].includes(currentUser.userType)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const transactions = await Transaction.find()
      .populate('book', 'title')
      .populate('user', 'libraryCardNumber firstName lastName')
      .sort({ issuedDate: -1 });

    res.json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get analytics for Librarian dashboard
app.get('/api/librarian/analytics', verifyToken, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    if (!['admin', 'librarian'].includes(currentUser.userType)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    // Total Books and Copies
    const books = await Book.find();
    const totalTitles = books.length;
    const totalCopies = books.reduce((acc, book) => acc + book.totalCopies, 0);
    const availableCopies = books.reduce((acc, book) => acc + book.availableCopies, 0);
    const issuedCopies = totalCopies - availableCopies;

    // Transactions stats
    const transactions = await Transaction.find().populate('user', 'userType');

    let studentIssuesCount = 0;
    let staffIssuesCount = 0;

    transactions.forEach(t => {
      if (t.status === 'Issued') {
        if (t.user && t.user.userType === 'student') studentIssuesCount++;
        if (t.user && t.user.userType === 'staff') staffIssuesCount++;
      }
    });

    res.json({
      success: true,
      stats: {
        totalTitles,
        totalCopies,
        availableCopies,
        issuedCopies,
        studentIssuesCount,
        staffIssuesCount,
        totalTransactions: transactions.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Send a message
app.post('/api/messages', verifyToken, async (req, res) => {
  try {
    const { recipientRole, subject, content } = req.body;

    if (!recipientRole || !subject || !content) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const message = new Message({
      sender: req.user.id,
      recipientRole,
      subject,
      content
    });

    await message.save();

    res.status(201).json({ success: true, message: 'Message sent successfully', data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get messages for user
app.get('/api/messages', verifyToken, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    // Find messages where recipientRole matches current user's role OR sender is current user
    const messages = await Message.find({
      $or: [
        { recipientRole: currentUser.userType },
        { sender: currentUser._id }
      ]
    })
      .populate('sender', 'firstName lastName userType email')
      .sort({ createdAt: -1 });

    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// ========== HOD ROUTES ==========

// Get HOD Analytics
app.get('/api/hod/analytics', verifyToken, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (currentUser.userType !== 'hod' && currentUser.userType !== 'principal' && currentUser.userType !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const department = currentUser.department;
    if (!department) return res.status(400).json({ success: false, message: 'Department not assigned to HOD' });

    // Total Department Students
    const studentCount = await User.countDocuments({ department, userType: 'student' });

    // Total Transactions by Department Students
    const departmentStudents = await User.find({ department, userType: 'student' }).select('_id');
    const studentIds = departmentStudents.map(s => s._id);
    const totalTransactions = await Transaction.countDocuments({ user: { $in: studentIds } });

    // Active Issues
    const activeIssues = await Transaction.countDocuments({ user: { $in: studentIds }, status: 'Issued' });

    res.json({
      success: true,
      stats: {
        department,
        studentCount,
        totalTransactions,
        activeIssues
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Add Recommendation
app.post('/api/hod/recommendations', verifyToken, async (req, res) => {
  try {
    if (req.user.userType !== 'hod') {
      return res.status(403).json({ success: false, message: 'Only HODs can add recommendations' });
    }

    const currentUser = await User.findById(req.user.id);
    const { title, author, description } = req.body;

    if (!title || !author) {
      return res.status(400).json({ success: false, message: 'Title and author are required' });
    }

    const recommendation = new Recommendation({
      department: currentUser.department,
      title,
      author,
      description,
      recommendedBy: currentUser._id
    });

    await recommendation.save();
    res.status(201).json({ success: true, message: 'Recommendation added successfully', data: recommendation });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get Recommendations
app.get('/api/hod/recommendations', verifyToken, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const department = currentUser.department;

    let query = {};
    if (department && currentUser.userType !== 'admin' && currentUser.userType !== 'principal' && currentUser.userType !== 'librarian') {
      query.department = department;
    }

    const recommendations = await Recommendation.find(query)
      .populate('recommendedBy', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json({ success: true, recommendations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get Staff Book Requests for HOD's Department
app.get('/api/hod/requests', verifyToken, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (currentUser.userType !== 'hod' && currentUser.userType !== 'principal' && currentUser.userType !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const department = currentUser.department;
    let query = {};
    if (currentUser.userType === 'hod' && department) {
      query.department = department;
    }

    const requests = await BookRequest.find(query)
      .populate('user', 'firstName lastName staffId email')
      .populate('book', 'title author')
      .sort({ requestedAt: -1 });

    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Update Request Status
app.put('/api/hod/requests/:id', verifyToken, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (currentUser.userType !== 'hod' && currentUser.userType !== 'principal' && currentUser.userType !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const { status } = req.body;
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const request = await BookRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });

    res.json({ success: true, message: `Request ${status.toLowerCase()} successfully`, data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// ========== STUDENT ROUTES ==========

// Get Student Analytics
app.get('/api/student/analytics', verifyToken, async (req, res) => {
  try {
    const studentId = req.user.id;

    const transactions = await Transaction.find({ user: studentId });

    const totalIssued = transactions.length;
    const currentlyIssued = transactions.filter(t => t.status === 'Issued').length;
    const overdue = transactions.filter(t => t.status === 'Issued' && new Date(t.dueDate) < new Date()).length;
    const totalFine = transactions.reduce((sum, t) => sum + (t.fine || 0), 0);

    res.json({
      success: true,
      stats: {
        totalIssued,
        currentlyIssued,
        overdue,
        totalFine
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get Books (Searchable, publicly accessible for logged in students)
app.get('/api/student/books', verifyToken, async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { author: { $regex: search, $options: 'i' } },
          { department: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const books = await Book.find(query).sort({ createdAt: -1 });
    res.json({ success: true, books });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get Recommendations for Student
app.get('/api/student/recommendations', verifyToken, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const department = currentUser.department;

    let query = {};
    if (department) {
      query.department = department; // Only fetch recommendations meant for the student's department
    }

    const recommendations = await Recommendation.find(query)
      .populate('recommendedBy', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json({ success: true, recommendations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Request a Book
app.post('/api/student/request-book', verifyToken, async (req, res) => {
  try {
    const student = await User.findById(req.user.id);
    if (student.userType !== 'student') {
      return res.status(403).json({ success: false, message: 'Only students can request books' });
    }

    const { bookId, reason } = req.body;

    if (!bookId || !reason) {
      return res.status(400).json({ success: false, message: 'Book ID and reason are required' });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    // Use student department for routing the request to the correct HOD
    const requestDepartment = student.department || book.department;

    const bookRequest = new BookRequest({
      user: student._id,
      book: book._id,
      department: requestDepartment,
      reason,
      status: 'Pending'
    });

    await bookRequest.save();

    res.status(201).json({ success: true, message: 'Book request submitted successfully', request: bookRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get My Requests (Student)
app.get('/api/student/requests', verifyToken, async (req, res) => {
  try {
    const student = await User.findById(req.user.id);
    if (student.userType !== 'student') {
      return res.status(403).json({ success: false, message: 'Only students can view their requests here' });
    }

    const requests = await BookRequest.find({ user: student._id })
      .populate('book', 'title author')
      .sort({ requestedAt: -1 });

    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

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

// Start server
app.listen(PORT, () => {
  console.log('\n🚀 ========================================');
  console.log(`   Server running on http://localhost:${PORT}`);
  console.log('🚀 ========================================\n');
  console.log('📝 Configuration:');
  console.log(`   - Port: ${PORT}`);
  console.log(`   - MongoDB: ${MONGODB_URI.split('@').pop() || MONGODB_URI}`);
  console.log(`   - Admin Auth Code: ${ADMIN_AUTH_CODE}`);
  console.log('\n📚 Available Endpoints:');
  console.log('   - POST /api/auth/register');
  console.log('   - POST /api/auth/login');
  console.log('   - GET  /api/auth/me');
  console.log('   - GET  /api/departments');
  console.log('   - GET  /api/health');
  console.log('\n✅ Server ready!\n');
});