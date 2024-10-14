const Task = require('../models/Task');
const User = require('../models/User');

const userService = {
  async createUser(userData) {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('Email already in use');
    }
    const user = new User(userData);
    await user.save();
    return { id: user._id, email: user.email, username: user.username };
  },

  async getUser(userId) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  },

  async updateUser(userId, updateData) {
    if (updateData.email) {
      const existingUser = await User.findOne({ email: updateData.email, _id: { $ne: userId } });
      if (existingUser) {
        throw new Error('Email already in use');
      }
    }

    const user = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true }).select('-password');
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  },

  async deleteUser(userId) {
    const result = await User.findByIdAndDelete(userId);
    if (!result) {
      throw new Error('User not found');
    }
  },
  async getTasksById(userId) {
    const tasks = await Task.find({createdBy: userId});
    return tasks;
  }
};

module.exports = userService;