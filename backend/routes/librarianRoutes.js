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
  issueBook,
  returnBook,
  getRequests,
  updateRequestStatus
} = require('../controllers/librarianController');

// All endpoints require auth
router.get('/users', verifyToken, getUsers);
router.get('/analytics', verifyToken, getAnalytics);

router.get('/books', getBooks);
router.post('/books', verifyToken, addBook);
router.put('/books/:id', verifyToken, updateBook);
router.delete('/books/:id', verifyToken, deleteBook);

router.get('/transactions', verifyToken, getTransactions);
router.post('/transactions/issue', verifyToken, issueBook);
router.put('/transactions/:id/return', verifyToken, returnBook);

router.get('/requests', verifyToken, getRequests);
router.put('/requests/:id', verifyToken, updateRequestStatus);

module.exports = router;
