const User = require('../models/User');
const auth = require('../middleware/auth');

const authService = {
  async login(email, password) {
    try {
      const result = await auth.login(email, password);
      return result;
    } catch (error) {
      throw new Error('Invalid login credentials');
    }
  },

  async register(userData) {
    try {
      const result = await auth.register(userData);
      return result;
    } catch (error) {
      if (error.message === 'Email already in use') {
        throw error;
      }
      throw new Error('Registration failed');
    }
  }
};

module.exports = authService;