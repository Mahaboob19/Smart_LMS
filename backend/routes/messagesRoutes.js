const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { sendMessage, getMessages } = require('../controllers/messagesController');

router.use(verifyToken);

router.post('/', sendMessage);
router.get('/', getMessages);

module.exports = router;
