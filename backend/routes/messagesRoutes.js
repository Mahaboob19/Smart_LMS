const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { sendMessage, getMessages, markAsRead } = require('../controllers/messagesController');

router.post('/', verifyToken, sendMessage);
router.get('/', verifyToken, getMessages);
router.put('/:id/read', verifyToken, markAsRead);

module.exports = router;
