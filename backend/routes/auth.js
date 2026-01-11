// routes/auth.js - Updated with better error handling
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const Student = require('../models/Student');
const { Staff, HOD, Librarian } = require('../models/Staff');

// Generate JWT Token with error handling
const generateToken = (id) => {
  try {
    const secret = process.env.JWT_SECRET;
    
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    
    return jwt.sign({ id }, secret, {
      expiresIn: process.env.JWT_EXPIRE || '7d'
    });
  } catch (error) {
    console.error('JWT Token generation error:', error.message);
    throw error;
  }
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
  // Common validation
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('userType').isIn(['student', 'staff', 'hod', 'librarian']).withMessage('Invalid user type'),
  
  // Student specific validation - conditionally required
  body('rollNumber')
    .if((value, { req }) => req.body.userType === 'student')
    .notEmpty().withMessage('Roll number is required for students'),
  
  body('department')
    .if((value, { req }) => req.body.userType === 'student')
    .notEmpty().withMessage('Department is required for students'),
  
  body('year')
    .if((value, { req }) => req.body.userType === 'student')
    .isIn(['I Year', 'II Year', 'III Year', 'IV Year']).withMessage('Invalid year'),
  
  // Staff/HOD/Librarian validation - conditionally required
  body('employeeId')
    .if((value, { req }) => ['staff', 'hod', 'librarian'].includes(req.body.userType))
    .notEmpty().withMessage('Employee ID is required for staff'),
  
  body('designation')
    .if((value, { req }) => ['staff', 'hod', 'librarian'].includes(req.body.userType))
    .notEmpty().withMessage('Designation is required for staff'),
  
  body('department')
    .if((value, { req }) => ['staff', 'hod', 'librarian'].includes(req.body.userType))
    .notEmpty().withMessage('Department is required for staff'),
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const { 
      firstName, 
      lastName, 
      email, 
      password, 
      phone,
      userType,
      // Student fields
      rollNumber,
      department,
      year,
      section,
      semester,
      // Staff fields
      employeeId,
      designation,
      joiningDate
    } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }
    
    // Create user based on type
    let newUser;
    
    switch(userType) {
      case 'student':
        // Check if roll number exists
        const existingStudent = await Student.findOne({ rollNumber });
        if (existingStudent) {
          return res.status(400).json({
            success: false,
            message: 'Student already exists with this roll number'
          });
        }
        
        // Generate library card number
        const libraryCardNumber = `LIB${Date.now().toString().slice(-6)}`;
        
        newUser = new Student({
          firstName,
          lastName,
          email,
          password,
          phone,
          userType,
          rollNumber,
          department,
          year,
          section,
          semester,
          libraryCardNumber
        });
        break;
        
      case 'staff':
      case 'hod':
      case 'librarian':
        // Check if employee ID exists
        const existingStaff = await User.findOne({ 
          $or: [
            { email },
            { employeeId }
          ]
        });
        if (existingStaff) {
          return res.status(400).json({
            success: false,
            message: 'Staff already exists with this email or employee ID'
          });
        }
        
        // Set permissions based on designation
        let permissions = {};
        let libraryPermissions = {};
        
        if (userType === 'librarian') {
          permissions = {
            canManageBooks: true,
            canManageUsers: true,
            canViewReports: true,
            canManageLibrary: true
          };
          libraryPermissions = {
            canIssueBooks: true,
            canReceiveBooks: true,
            canManageInventory: true,
            canManageFines: true
          };
        } else if (userType === 'hod') {
          permissions = {
            canViewReports: true
          };
        }
        
        const StaffModel = userType === 'staff' ? Staff : 
                          userType === 'hod' ? HOD : Librarian;
        
        newUser = new StaffModel({
          firstName,
          lastName,
          email,
          password,
          phone,
          userType,
          employeeId,
          designation,
          department,
          joiningDate: joiningDate || Date.now(),
          permissions,
          libraryPermissions
        });
        break;
        
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid user type'
        });
    }
    
    // Save user
    await newUser.save();
    
    // Generate token
    const token = generateToken(newUser._id);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        userType: newUser.userType,
        phone: newUser.phone,
        ...(newUser.userType === 'student' && {
          rollNumber: newUser.rollNumber,
          department: newUser.department,
          year: newUser.year,
          libraryCardNumber: newUser.libraryCardNumber
        }),
        ...(['staff', 'hod', 'librarian'].includes(newUser.userType) && {
          employeeId: newUser.employeeId,
          designation: newUser.designation,
          department: newUser.department
        })
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const { email, password, userType } = req.body;
    
    // Find user by email with password
    let user;
    
    if (userType) {
      // If userType is specified, search in that specific collection
      const query = { email };
      if (userType !== 'admin') {
        query.userType = userType;
      }
      user = await User.findOne(query).select('+password');
    } else {
      user = await User.findOne({ email }).select('+password');
    }
    
    // Check if user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Check password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact administrator.'
      });
    }
    
    // Update last login
    user.lastLogin = Date.now();
    await user.save();
    
    // Generate token
    const token = generateToken(user._id);
    
    // Prepare user response based on type
    let userResponse = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userType: user.userType,
      phone: user.phone
    };
    
    // Add type-specific fields
    if (user.userType === 'student') {
      userResponse.rollNumber = user.rollNumber;
      userResponse.department = user.department;
      userResponse.year = user.year;
      userResponse.libraryCardNumber = user.libraryCardNumber;
    } else if (['staff', 'hod', 'librarian'].includes(user.userType)) {
      userResponse.employeeId = user.employeeId;
      userResponse.designation = user.designation;
      userResponse.department = user.department;
      userResponse.permissions = user.permissions;
    }
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userResponse
    });
    
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Test endpoint to check if environment variables are loaded
router.get('/env-test', (req, res) => {
  res.json({
    JWT_SECRET: process.env.JWT_SECRET ? 'Loaded (hidden for security)' : 'NOT LOADED',
    JWT_EXPIRE: process.env.JWT_EXPIRE || 'Not set',
    NODE_ENV: process.env.NODE_ENV || 'Not set'
  });
});

module.exports = router;