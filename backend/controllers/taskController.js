const taskService = require('../services/taskService');

const taskController = {
  async createTask(req, res, next) {
    try {
      const taskData = req.body;
      const task = await taskService.createTask(taskData);
      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  },

  async getTask(req, res, next) {
    try {
      const { taskId } = req.params;
      const task = await taskService.getTask(taskId);
      res.json(task);
    } catch (error) {
      next(error);
    }
  },

  async updateTask(req, res, next) {
    try {
      const { taskId } = req.params;
      const updateData = req.body;
      const updatedTask = await taskService.updateTask(taskId, updateData);
      res.json(updatedTask);
    } catch (error) {
      next(error);
    }
  },

  async deleteTask(req, res, next) {
    try {
      const { taskId } = req.params;
      await taskService.deleteTask(taskId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
};

module.exports = taskController;