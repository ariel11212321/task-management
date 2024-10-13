const Task = require('../models/Task');

const taskService = {
  async createTask(taskData) {
    const task = new Task(taskData);
    await task.save();
    return task;
  },
  async getAllTasks() {
    const tasks = await Task.find();
    return tasks;
  },
  async getTask(taskId) {
    const task = await Task.findById(taskId).populate('assignedTo createdBy');
    if (!task) {
      throw new Error('Task not found');
    }
    return task;
  },

  async updateTask(taskId, updateData) {
    const task = await Task.findByIdAndUpdate(taskId, updateData, { new: true, runValidators: true });
    if (!task) {
      throw new Error('Task not found');
    }
    return task;
  },

  async deleteTask(taskId) {
    const result = await Task.findByIdAndDelete(taskId);
    if (!result) {
      throw new Error('Task not found');
    }
  }
};

module.exports = taskService;