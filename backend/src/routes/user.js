const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { User } = require('../models/db');

// Update language preference
router.put('/language', authMiddleware, async (req, res) => {
  try {
    const { language } = req.body;
    const validLanguages = ['darija', 'arabic', 'french', 'english'];

    if (!validLanguages.includes(language)) {
      return res.status(400).json({ message: 'اللغة غير صالحة' });
    }

    await User.update({ language }, { where: { id: req.user.id } });
    res.json({ message: '✅ اللغة تبدلات', language });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في التحديث' });
  }
});

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في جلب البروفايل' });
  }
});

module.exports = router;
