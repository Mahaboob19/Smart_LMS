const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Book = require('../models/Book');
const Recommendation = require('../models/Recommendation');
const BookRequest = require('../models/BookRequest');

const getAnalytics = async (req, res) => {
  try {
    const student = await User.findById(req.user.id);
    if (!student) return res.status(404).json({ success: false, message: 'User not found' });

    const transactions = await Transaction.find({ user: student._id });

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
};

const getBooks = async (req, res) => {
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
};

const getRecommendations = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const department = currentUser.department;

    let query = {};
    if (department) {
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

const requestBook = async (req, res) => {
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
};

const getRequests = async (req, res) => {
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
};

const addReview = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    // Optional: check if user already reviewed
    const existingReviewIndex = book.reviews.findIndex(r => r.user.toString() === userId);
    
    if (existingReviewIndex !== -1) {
      // Update existing review
      book.reviews[existingReviewIndex].rating = rating;
      book.reviews[existingReviewIndex].comment = comment;
      book.reviews[existingReviewIndex].createdAt = Date.now();
    } else {
      // Add new review
      book.reviews.push({ user: userId, rating, comment });
    }

    await book.save();
    
    // Return the updated reviews with populated user info
    const updatedBook = await Book.findById(bookId).populate('reviews.user', 'firstName lastName');

    res.json({ success: true, message: 'Review added successfully', reviews: updatedBook.reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const getTransactions = async (req, res) => {
  try {
    const student = await User.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const transactions = await Transaction.find({ user: student._id })
      .populate('book', 'title author')
      .sort({ issuedDate: -1 });

    const FINE_PER_DAY = 10;
    const now = new Date();

    const updatedTransactions = transactions.map(tx => {
      let currentFine = tx.fine || 0;
      if (tx.status === 'Issued' && now > new Date(tx.dueDate)) {
        const diffTime = Math.abs(now - new Date(tx.dueDate));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        currentFine = diffDays * FINE_PER_DAY;
      }
      return { ...tx.toObject(), fine: currentFine };
    });

    res.json({ success: true, transactions: updatedTransactions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAnalytics,
  getBooks,
  getRecommendations,
  requestBook,
  getRequests,
  addReview,
  getTransactions
};
