const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const AdminAuthCode = require('../models/AdminAuthCode');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_for_testing_123';
const ADMIN_AUTH_CODE = process.env.ADMIN_AUTH_CODE || 'VVIT_ADMIN_2024';

const register = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database connection not available. Please ensure MongoDB is running.'
      });
    }

    const { firstName, lastName, email, password, userType, rollNumber, staffId, department, year, adminCode } = req.body;

    if (userType === 'hod' && !department) {
      return res.status(400).json({
        success: false,
        message: 'Department is required for HOD'
      });
    }

    if (userType === 'admin' || userType === 'librarian' || userType === 'hod' || userType === 'principal') {
      if (!adminCode) {
        return res.status(403).json({
          success: false,
          message: 'Admin authentication code is required'
        });
      }

      if (adminCode !== ADMIN_AUTH_CODE) {
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

        if (userType === 'hod' && validCode.department && validCode.department !== department) {
          return res.status(403).json({
            success: false,
            message: 'Department does not match the authentication code'
          });
        }
      }
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }


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
};

const login = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database connection not available. Please ensure MongoDB is running.'
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (!user.libraryCardNumber && (user.userType === 'student' || user.userType === 'staff')) {
      user.libraryCardNumber = `LIB${Date.now().toString().slice(-6)}`;
      await user.save();
    }

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
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.libraryCardNumber && (user.userType === 'student' || user.userType === 'staff')) {
      user.libraryCardNumber = `LIB${Date.now().toString().slice(-6)}`;
      await user.save();
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
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide both current and new passwords' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect current password' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  register,
  login,
  getMe,
  changePassword
};
