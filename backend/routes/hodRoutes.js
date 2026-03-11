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

router.use(verifyToken);

router.get('/analytics', getAnalytics);
router.post('/recommendations', addRecommendation);
router.get('/recommendations', getRecommendations);
router.get('/requests', getRequests);
router.put('/requests/:id', updateRequestStatus);

module.exports = router;
