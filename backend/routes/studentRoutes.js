const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {
  getAnalytics,
  getBooks,
  getRecommendations,
  requestBook,
  getRequests,
  addReview,
  getTransactions
} = require('../controllers/studentController');

router.get('/analytics', verifyToken, getAnalytics);
router.get('/books', verifyToken, getBooks);
router.get('/recommendations', verifyToken, getRecommendations);
router.post('/requests', verifyToken, requestBook);
router.get('/requests', verifyToken, getRequests);
router.get('/transactions', verifyToken, getTransactions);
router.post('/books/:id/reviews', verifyToken, addReview);

module.exports = router;
