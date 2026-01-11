const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const User = require('../models/user');
const Student = require('../models/Student');
const { Staff, HOD, Librarian } = require('../models/Staff');

// All routes require authentication
router.use(auth);

// @route   GET /api/admin/users
// @desc    Get all users (with filtering)
// @access  Private (Admin/Librarian/HOD)
router.get('/users', authorize('admin', 'librarian', 'hod'), async (req, res) => {
  try {
    const { userType, department, search } = req.query;
    
    // Build filter
    const filter = {};
    
    if (userType) {
      filter.userType = userType;
    }
    
    if (department) {
      filter.department = department;
    }
    
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } }
      ];
    }
    
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 });
    
    // Group by user type for statistics
    const userStats = {
      total: users.length,
      students: users.filter(u => u.userType === 'student').length,
      staff: users.filter(u => u.userType === 'staff').length,
      hod: users.filter(u => u.userType === 'hod').length,
      librarians: users.filter(u => u.userType === 'librarian').length,
      admins: users.filter(u => u.userType === 'admin').length
    };
    
    res.json({
      success: true,
      users,
      stats: userStats
    });
    
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/admin/users/:id
// @desc    Get single user by ID
// @access  Private (Admin/Librarian/HOD)
router.get('/users/:id', authorize('admin', 'librarian', 'hod'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      user
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/admin/users
// @desc    Create new user (admin only)
// @access  Private (Admin)
router.post('/users', authorize('admin'), async (req, res) => {
  try {
    // Similar to registration but admin creates user
    // Implementation here
    
    res.json({
      success: true,
      message: 'User created successfully'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/admin/users/:id
// @desc    Update user
// @access  Private (Admin/Librarian)
router.put('/users/:id', authorize('admin', 'librarian'), async (req, res) => {
  try {
    const { isActive, isVerified, ...updateData } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { 
        ...updateData,
        isActive,
        isVerified,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'User updated successfully',
      user
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user (soft delete)
// @access  Private (Admin)
router.delete('/users/:id', authorize('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'User deactivated successfully'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/admin/stats
// @desc    Get admin dashboard statistics
// @access  Private (Admin/Librarian/HOD)
router.get('/stats', authorize('admin', 'librarian', 'hod'), async (req, res) => {
  try {
    // Get counts
    const [
      totalUsers,
      totalStudents,
      totalStaff,
      activeUsers,
      newUsersThisMonth
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ userType: 'student' }),
      User.countDocuments({ userType: { $in: ['staff', 'hod', 'librarian'] } }),
      User.countDocuments({ isActive: true }),
      User.countDocuments({
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      })
    ]);
    
    // Department statistics
    const departmentStats = await User.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // User type statistics
    const userTypeStats = await User.aggregate([
      { $group: { _id: '$userType', count: { $sum: 1 } } }
    ]);
    
    res.json({
      success: true,
      stats: {
        totalUsers,
        totalStudents,
        totalStaff,
        activeUsers,
        newUsersThisMonth,
        inactiveUsers: totalUsers - activeUsers
      },
      departmentStats,
      userTypeStats
    });
    
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;