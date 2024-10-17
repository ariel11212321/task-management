const router = require('express').Router();
const groupController = require('../controllers/groupController');

router.post('/', groupController.createGroup);
router.get('/:id', groupController.getGroup);
router.put('/:id', groupController.updateGroup);
router.delete('/:id', groupController.deleteGroup);
router.post('/:id/members', groupController.addMember);
router.delete('/:id/members/:userId', groupController.removeMember);
router.get('/:id/tasks', groupController.getTasksById);

module.exports = router;