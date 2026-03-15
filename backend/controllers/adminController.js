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

const getAllUsers = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (!['admin', 'principal'].includes(currentUser.userType)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (!['admin', 'principal'].includes(currentUser.userType)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const { id } = req.params;
    const { userType, department } = req.body;

    const userToUpdate = await User.findById(id);
    if (!userToUpdate) return res.status(404).json({ success: false, message: 'User not found' });

    // Prevent modifying the super admin or principal if the current user isn't admin
    if (['admin', 'principal'].includes(userToUpdate.userType) && currentUser.userType !== 'admin') {
      return res.status(403).json({ success: false, message: 'Cannot modify this user' });
    }

    userToUpdate.userType = userType || userToUpdate.userType;
    if (userType === 'hod' && department) {
      userToUpdate.department = department;
    }

    await userToUpdate.save();

    const updatedUser = userToUpdate.toObject();
    delete updatedUser.password;

    res.json({ success: true, message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (!['admin', 'principal'].includes(currentUser.userType)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const { id } = req.params;

    // Prevent deleting oneself
    if (id === req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
    }

    const userToDelete = await User.findById(id);
    if (!userToDelete) return res.status(404).json({ success: false, message: 'User not found' });

    if (['admin', 'principal'].includes(userToDelete.userType) && currentUser.userType !== 'admin') {
      return res.status(403).json({ success: false, message: 'Cannot delete this user' });
    }

    await User.findByIdAndDelete(id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  getDepartments,
  getUsersByDepartment,
  generateAdminCode,
  getAdminAuthCodes,
  getAllUsers,
  updateUserRole,
  deleteUser
};
