const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const auth = {
  generateToken: (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
  },

  verifyToken: (token) => {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  },

  authenticate: async (req, res, next) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');

      if (!token) {
        return res.status(401).json({ error: 'No authentication token, access denied' });
      }

      const decoded = auth.verifyToken(token);
      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
        throw new Error('User not found');
      }

      req.user = user;
      req.token = token;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Please authenticate' });
    }
  },

 

  login: async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid login credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid login credentials');
    }

    const token = auth.generateToken(user._id);
    return { user: { id: user._id, email: user.email }, token };
  },

  register: async (userData) => {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const user = new User(userData);
    await user.save();

    const token = auth.generateToken(user._id);
    return { user: { id: user._id, email: user.email }, token };
  }
};

module.exports = auth;