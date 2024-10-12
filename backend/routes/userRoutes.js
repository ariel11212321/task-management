const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/auth'); 

router.post('/', authenticate, userController.createUser);
router.get('/:userId', authenticate, userController.getUser);
router.put('/:userId', authenticate, userController.updateUser);
router.delete('/:userId', authenticate, userController.deleteUser);

module.exports = router;