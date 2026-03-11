const User = require('../models/User');
const AdminAuthCode = require('../models/AdminAuthCode');

const getDepartments = (req, res) => {
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
};

const getUsersByDepartment = async (req, res) => {
  try {
    const { department } = req.params;
    const currentUser = await User.findById(req.user.id);

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
};

const generateAdminCode = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    if (currentUser.userType !== 'admin' && currentUser.userType !== 'principal') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: Only administrators can generate codes'
      });
    }

    const { role, department } = req.body;

    const code = `VVIT_${role.toUpperCase()}_${Date.now().toString(36).toUpperCase()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const authCode = new AdminAuthCode({
      code,
      role,
      department: role === 'hod' ? department : undefined,
      createdBy: currentUser._id,
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
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
};

const getAdminAuthCodes = async (req, res) => {
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
};

module.exports = {
  getDepartments,
  getUsersByDepartment,
  generateAdminCode,
  getAdminAuthCodes
};
