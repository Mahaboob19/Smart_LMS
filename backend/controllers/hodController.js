const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Recommendation = require('../models/Recommendation');
const BookRequest = require('../models/BookRequest');

const getAnalytics = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (!currentUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (currentUser.userType !== 'hod' && currentUser.userType !== 'principal' && currentUser.userType !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    let department = currentUser.department;
    let query = {};
    
    // If principal or admin has no department, they see ALL data
    if (!department && (currentUser.userType === 'principal' || currentUser.userType === 'admin')) {
      department = 'All Departments';
    } else if (!department) {
      return res.json({ 
        success: true, 
        stats: { 
          noDepartment: true,
          message: 'Department not assigned. Please contact the administrator to assign a department to your account.' 
        } 
      });
    } else {
      query.department = department;
    }

    const studentCount = await User.countDocuments({ ...query, userType: 'student' });
    const staffCount = await User.countDocuments({ ...query, userType: 'staff' });
    
    const departmentStudents = await User.find({ ...query, userType: 'student' })
      .select('firstName lastName email rollNumber libraryCardNumber createdAt');
    const departmentStaff = await User.find({ ...query, userType: 'staff' })
      .select('firstName lastName email staffId libraryCardNumber createdAt');

    const memberIds = [...departmentStudents.map(s => s._id), ...departmentStaff.map(s => s._id)];
    const totalTransactions = await Transaction.countDocuments({ user: { $in: memberIds } });
    const activeIssues = await Transaction.countDocuments({ user: { $in: memberIds }, status: 'Issued' });


    res.json({
      success: true,
      stats: {
        department,
        studentCount,
        staffCount,
        totalTransactions,
        activeIssues,
        students: departmentStudents,
        staff: departmentStaff
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const addRecommendation = async (req, res) => {
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
};

const getRecommendations = async (req, res) => {
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
};

const getRequests = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (currentUser.userType !== 'hod' && currentUser.userType !== 'principal' && currentUser.userType !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const department = currentUser.department;
    let query = {};
    if (currentUser.userType === 'hod') {
      query.department = department;
      query.status = 'HOD_Pending';
    } else if (currentUser.userType === 'principal') {
      query.status = 'Principal_Pending';
    }

    const requests = await BookRequest.find(query)
      .populate('user', 'firstName lastName staffId email')
      .populate('book', 'title author')
      .sort({ requestedAt: -1 });

    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const updateRequestStatus = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (currentUser.userType !== 'hod' && currentUser.userType !== 'principal' && currentUser.userType !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const { status } = req.body;
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const request = await BookRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });

    if (status === 'Approved') {
        if (currentUser.userType === 'hod') {
            request.status = 'Principal_Pending';
        } else if (currentUser.userType === 'principal') {
            request.status = 'Librarian_Pending';
        }
    } else {
        request.status = 'Rejected';
    }

    await request.save();
    res.json({ success: true, message: `Request ${status.toLowerCase()} successfully`, data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAnalytics,
  addRecommendation,
  getRecommendations,
  getRequests,
  updateRequestStatus
};
