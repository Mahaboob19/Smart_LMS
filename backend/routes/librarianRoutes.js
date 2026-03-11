const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {
  getUsers,
  getAnalytics,
  getBooks,
  addBook,
  updateBook,
  deleteBook,
  getTransactions,
  issueBook
} = require('../controllers/librarianController');

// All endpoints require auth
router.use(verifyToken);

router.get('/users', getUsers);
router.get('/analytics', getAnalytics);

// Note: In index.js these were mounted on /api/books and /api/transactions directly
// Since frontend uses /api/books, we can mount these under root, but for cleanliness 
// we will export them, and in server.js handle the mounting paths properly.
router.get('/books', getBooks);
router.post('/books', addBook);
router.put('/books/:id', updateBook);
router.delete('/books/:id', deleteBook);

router.get('/transactions', getTransactions);
router.post('/transactions/issue', issueBook);

module.exports = router;
