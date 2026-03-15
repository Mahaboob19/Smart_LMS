const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {
  getAnalytics,
  addRecommendation,
  getRecommendations,
  getRequests,
  updateRequestStatus
} = require('../controllers/hodController');

router.get('/analytics', verifyToken, getAnalytics);
router.get('/recommendations', verifyToken, getRecommendations);
router.post('/recommendations', verifyToken, addRecommendation);
router.get('/requests', verifyToken, getRequests);
router.put('/requests/:id', verifyToken, updateRequestStatus);

module.exports = router;
