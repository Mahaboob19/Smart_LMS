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

    const booksInDept = await Book.find({ department, qrCodes: { $exists: true, $not: {$size: 0} } }, 'qrCodes');
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

      const booksInDept = await Book.find({ department: book.department, qrCodes: { $exists: true, $not: {$size: 0} } }, 'qrCodes');
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

    res.json({ success: true, transactions });
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
  getTransactions
};
