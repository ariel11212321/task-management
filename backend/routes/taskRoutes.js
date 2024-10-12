const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, taskController.createTask);
router.get('/:taskId', authenticate, taskController.getTask);
router.put('/:taskId', authenticate, taskController.updateTask);
router.delete('/:taskId', authenticate, taskController.deleteTask);

module.exports = router;