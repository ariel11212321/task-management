const userService = require('../services/userService');

const userController = {
  async createUser(req, res, next) {
    try {
      const userData = req.body;
      const user = await userService.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  },

  async getUser(req, res, next) {
    try {
      const { userId } = req.params;
      const user = await userService.getUser(userId);
      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  async updateUser(req, res, next) {
    try {
      const { userId } = req.params;
      const updateData = req.body;
      const updatedUser = await userService.updateUser(userId, updateData);
      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  },

  async deleteUser(req, res, next) {
    try {
      const { userId } = req.params;
      await userService.deleteUser(userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};

module.exports = userController;