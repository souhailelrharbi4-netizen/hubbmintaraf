const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/db');

const register = async (req, res) => {
  try {
    const { username, email, password, language } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'عمر كل المعلومات' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'هاد الإيميل كاين ديجا' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      language: language || 'darija'
    });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: '💙 مرحبا بيك في الحب من طرف واحد',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        language: user.language,
        isPremium: user.isPremium
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في السيرفر', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'الإيميل أو كلمة السر غلط' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'الإيميل أو كلمة السر غلط' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: '💙 مرحبا بيك',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        language: user.language,
        isPremium: user.isPremium
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في السيرفر', error: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
};

module.exports = { register, login, getMe };
