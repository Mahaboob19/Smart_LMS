const Book = require('../models/Book');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const BookRequest = require('../models/BookRequest');

const getUsers = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    if (!['admin', 'librarian'].includes(currentUser.userType)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const users = await User.find({})
      .select('firstName lastName email rollNumber libraryCardNumber staffId userType')
      .sort({ firstName: 1 });

    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const addBook = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    if (!['admin', 'librarian'].includes(currentUser.userType)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const { title, author, department, totalCopies, description } = req.body;

    const deptCodeMap = {
      'CSE': 'CS',
      'ECE': 'EC',
      'ME': 'ME',
      'CE': 'CE'
    };
    const deptCode = deptCodeMap[department] || department.substring(0, 2).toUpperCase();

    const booksInDept = await Book.find({ department, qrCodes: { $exists: true, $not: { $size: 0 } } }, 'qrCodes');
    let maxSeq = 0;
    booksInDept.forEach(b => {
      if (b.qrCodes) {
        b.qrCodes.forEach(code => {
          const match = code.match(/(\d+)$/);
          if (match) {
            const num = parseInt(match[1], 10);
            if (num > maxSeq) maxSeq = num;
          }
        });
      }
    });

    const qrCodes = [];
    for (let i = 1; i <= totalCopies; i++) {
      const seq = (maxSeq + i).toString().padStart(4, '0');
      qrCodes.push(`VVITU${deptCode}${seq}`);
    }

    const book = new Book({
      title,
      author,
      department,
      totalCopies,
      availableCopies: totalCopies,
      description,
      qrCodes
    });

    await book.save();

    res.status(201).json({ success: true, message: 'Book added successfully', book });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const getBooks = async (req, res) => {
  try {
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
};

const updateBook = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    if (!['admin', 'librarian'].includes(currentUser.userType)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    const { title, author, totalCopies, description } = req.body;

    if (totalCopies < book.totalCopies) {
      return res.status(400).json({ success: false, message: 'Cannot reduce total copies. QR Codes are already mapped physically. Please create a new book entry or adjust another way.' });
    }

    if (totalCopies > book.totalCopies) {
      const addedCopies = totalCopies - book.totalCopies;
      const deptCodeMap = { 'CSE': 'CS', 'ECE': 'EC', 'ME': 'ME', 'CE': 'CE' };
      const deptCode = deptCodeMap[book.department] || book.department.substring(0, 2).toUpperCase();

      const booksInDept = await Book.find({ department: book.department, qrCodes: { $exists: true, $not: { $size: 0 } } }, 'qrCodes');
      let maxSeq = 0;
      booksInDept.forEach(b => {
        if (b.qrCodes) {
          b.qrCodes.forEach(code => {
            const match = code.match(/(\d+)$/);
            if (match) {
              const num = parseInt(match[1], 10);
              if (num > maxSeq) maxSeq = num;
            }
          });
        }
      });

      const newQrCodes = [];
      for (let i = 1; i <= addedCopies; i++) {
        const seq = (maxSeq + i).toString().padStart(4, '0');
        newQrCodes.push(`VVITU${deptCode}${seq}`);
      }

      book.qrCodes = [...(book.qrCodes || []), ...newQrCodes];
      book.availableCopies += addedCopies;
    }

    book.title = title || book.title;
    book.author = author || book.author;
    book.totalCopies = totalCopies || book.totalCopies;
    book.description = description || book.description;

    await book.save();

    res.json({ success: true, message: 'Book updated successfully', book });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    if (!['admin', 'librarian'].includes(currentUser.userType)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const activeTransactions = await Transaction.find({ book: req.params.id, status: 'Issued' });
    if (activeTransactions.length > 0) {
      return res.status(400).json({ success: false, message: 'Cannot delete book: There are active issues for this book.' });
    }

    await Transaction.deleteMany({ book: req.params.id });
    await BookRequest.deleteMany({ book: req.params.id });

    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    res.json({ success: true, message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const issueBook = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    if (!['admin', 'librarian'].includes(currentUser.userType)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const { qrCode, userIdentifier, dueDate } = req.body;

    if (!qrCode || !userIdentifier || !dueDate) {
      return res.status(400).json({ success: false, message: 'Missing required fields: qrCode, userIdentifier, dueDate' });
    }

    const book = await Book.findOne({ qrCodes: qrCode });
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found for this QR Code' });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({ success: false, message: 'No available copies for this book title' });
    }

    const activeTx = await Transaction.findOne({ qrCode, status: 'Issued' });
    if (activeTx) {
      return res.status(400).json({ success: false, message: `The physical book copy with QR Code ${qrCode} is already issued` });
    }

    const user = await User.findOne({
      $or: [
        { email: userIdentifier },
        { rollNumber: userIdentifier },
        { libraryCardNumber: userIdentifier },
        { staffId: userIdentifier }
      ]
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found with provided identifier' });
    }

    const transaction = new Transaction({
      book: book._id,
      qrCode,
      user: user._id,
      dueDate
    });

    await transaction.save();

    book.availableCopies -= 1;
    await book.save();

    res.status(201).json({ success: true, message: 'Book issued successfully', transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (!['admin', 'librarian'].includes(currentUser.userType)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const books = await Book.find();
    const booksCount = books.length;
    const totalTitles = books.length;
    const totalCopies = books.reduce((acc, book) => acc + book.totalCopies, 0);
    const availableCopies = books.reduce((acc, book) => acc + book.availableCopies, 0);

    const activeTransactions = await Transaction.find({ status: 'Issued' }).populate('user');
    let studentIssuesCount = 0;
    let staffIssuesCount = 0;
    let totalIssuesCount = activeTransactions.length;

    activeTransactions.forEach(tx => {
      if (tx.user) {
        if (tx.user.userType === 'student') studentIssuesCount++;
        if (tx.user.userType === 'staff') staffIssuesCount++;
      }
    });

    res.json({
      success: true,
      stats: {
        totalBooks: booksCount,
        totalTitles,
        totalCopies,
        availableCopies,
        studentIssuesCount,
        staffIssuesCount,
        totalIssuesCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const getTransactions = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);

    if (!['admin', 'librarian'].includes(currentUser.userType)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const transactions = await Transaction.find()
      .populate('book', 'title')
      .populate('user', 'libraryCardNumber firstName lastName rollNumber staffId email')
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

const returnBook = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (!['admin', 'librarian'].includes(currentUser.userType)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found' });
    if (transaction.status === 'Returned') return res.status(400).json({ success: false, message: 'Book is already returned' });

    // Calculate final fine
    const FINE_PER_DAY = 10;
    const now = new Date();
    let finalFine = 0;
    if (now > new Date(transaction.dueDate)) {
      const diffTime = Math.abs(now - new Date(transaction.dueDate));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      finalFine = diffDays * FINE_PER_DAY;
    }

    transaction.status = 'Returned';
    transaction.returnDate = now;
    transaction.fine = finalFine;
    await transaction.save();

    // Increment available copies
    const Book = require('../models/Book');
    const book = await Book.findById(transaction.book);
    if (book) {
      book.availableCopies += 1;
      await book.save();
    }

    res.json({ success: true, message: 'Book returned successfully', data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const getRequests = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (!['admin', 'librarian'].includes(currentUser.userType)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    // Librarians see all student pending requests and staff requests that reached them
    const requests = await BookRequest.find({ status: { $in: ['Pending', 'Librarian_Pending'] } })
      .populate('user', 'firstName lastName staffId email rollNumber libraryCardNumber')
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
    if (!['admin', 'librarian'].includes(currentUser.userType)) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const { status } = req.body;
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    // Populate the request to access book and student details
    const request = await BookRequest.findById(req.params.id)
      .populate('book')
      .populate('user');

    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
    if (request.status !== 'Pending' && request.status !== 'Librarian_Pending') {
      return res.status(400).json({ success: false, message: `Request is already ${request.status}` });
    }

    // When approving, auto-issue the book by creating a Transaction
    if (status === 'Approved') {
      const book = request.book;

      if (!book || book.availableCopies <= 0) {
        return res.status(400).json({
          success: false,
          message: 'No available copies of this book to issue. Cannot approve the request.'
        });
      }

      // Find an available QR code (one not currently issued in an active transaction)
      const activeTransactions = await Transaction.find({ book: book._id, status: 'Issued' }).select('qrCode');
      const usedQrCodes = new Set(activeTransactions.map(tx => tx.qrCode));
      const availableQrCode = (book.qrCodes || []).find(qr => !usedQrCodes.has(qr));

      if (!availableQrCode) {
        return res.status(400).json({
          success: false,
          message: 'All physical copies are currently issued. Cannot approve the request.'
        });
      }

      // Set due date to 15 days from today (default loan period)
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 15);

      const transaction = new Transaction({
        book: book._id,
        qrCode: availableQrCode,
        user: request.user._id,
        dueDate,
        status: 'Issued'
      });

      await transaction.save();

      // Decrement available copies on the book
      book.availableCopies -= 1;
      await book.save();
    }

    // Update the request status
    request.status = status;
    await request.save();

    res.json({ success: true, message: `Request ${status.toLowerCase()} successfully`, data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  getUsers,
  addBook,
  getBooks,
  updateBook,
  deleteBook,
  issueBook,
  getAnalytics,
  getTransactions,
  returnBook,
  getRequests,
  updateRequestStatus
};
