const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const Student = require('../models/Student');

// All routes require authentication and student role
router.use(auth);
router.use(authorize('student'));

// @route   GET /api/student/dashboard
// @desc    Get student dashboard data
// @access  Private (Student)
router.get('/dashboard', async (req, res) => {
  try {
    const student = await Student.findById(req.user._id)
      .populate('booksBorrowed.book', 'title author isbn')
      .select('-password');
    
    // Calculate stats
    const activeBooks = student.booksBorrowed.filter(book => book.status === 'active');
    const overdueBooks = student.booksBorrowed.filter(book => book.status === 'overdue');
    
    const dashboardData = {
      stats: {
        totalBooksBorrowed: student.totalBooksBorrowed,
        currentBooks: activeBooks.length,
        overdueBooks: overdueBooks.length,
        currentFine: student.currentFine,
        totalFinePaid: student.totalFinePaid
      },
      activeBooks: activeBooks.map(book => ({
        id: book.book._id,
        title: book.book.title,
        author: book.book.author,
        borrowedDate: book.borrowedDate,
        dueDate: book.dueDate,
        daysLeft: Math.ceil((new Date(book.dueDate) - new Date()) / (1000 * 60 * 60 * 24))
      })),
      upcomingDueDates: activeBooks
        .filter(book => new Date(book.dueDate) > new Date())
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5),
      recentActivity: student.booksBorrowed
        .sort((a, b) => new Date(b.borrowedDate) - new Date(a.borrowedDate))
        .slice(0, 10)
    };
    
    res.json({
      success: true,
      dashboard: dashboardData
    });
    
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/student/profile
// @desc    Get student profile
// @access  Private (Student)
router.get('/profile', async (req, res) => {
  try {
    const student = await Student.findById(req.user._id)
      .select('-password -booksBorrowed');
    
    res.json({
      success: true,
      profile: student
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/student/profile
// @desc    Update student profile
// @access  Private (Student)
router.put('/profile', async (req, res) => {
  try {
    const { phone, section, semester } = req.body;
    
    const updatedStudent = await Student.findByIdAndUpdate(
      req.user._id,
      { 
        phone,
        section,
        semester,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      profile: updatedStudent
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/student/books/borrowed
// @desc    Get student's borrowed books
// @access  Private (Student)
router.get('/books/borrowed', async (req, res) => {
  try {
    const student = await Student.findById(req.user._id)
      .populate('booksBorrowed.book', 'title author isbn category')
      .select('booksBorrowed');
    
    res.json({
      success: true,
      books: student.booksBorrowed
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/student/books/request-renewal/:bookId
// @desc    Request book renewal
// @access  Private (Student)
router.post('/books/request-renewal/:bookId', async (req, res) => {
  try {
    // Implementation for book renewal request
    res.json({
      success: true,
      message: 'Renewal requested successfully'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;