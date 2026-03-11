const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {
  getAnalytics,
  getBooks,
  getRecommendations,
  requestBook,
  getRequests
} = require('../controllers/studentController');

router.use(verifyToken);

router.get('/analytics', getAnalytics);
router.get('/books', getBooks);
router.get('/recommendations', getRecommendations);
router.post('/request-book', requestBook);
router.get('/requests', getRequests);

module.exports = router;
