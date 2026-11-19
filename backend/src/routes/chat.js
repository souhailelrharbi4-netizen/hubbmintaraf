const express = require('express');
const router = express.Router();
const { sendMessage, getHistory, clearHistory } = require('../controllers/chatController');
const authMiddleware = require('../middleware/auth');

router.post('/send', authMiddleware, sendMessage);
router.get('/history', authMiddleware, getHistory);
router.delete('/clear', authMiddleware, clearHistory);

module.exports = router;
