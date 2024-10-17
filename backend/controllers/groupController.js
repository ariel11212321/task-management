const groupService = require("../services/groupService");

class GroupController {
    async createGroup(req, res) {
      try {
        const group = await groupService.createGroup(req.body);
        res.status(201).json(group);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    }
  
    async getGroup(req, res) {
      try {
        const group = await groupService.getGroupById(req.params.id);
        if (!group) {
          return res.status(404).json({ message: 'Group not found' });
        }
        res.json(group);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
  
    async updateGroup(req, res) {
      try {
        const group = await groupService.updateGroup(req.params.id, req.body);
        if (!group) {
          return res.status(404).json({ message: 'Group not found' });
        }
        res.json(group);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    }
  
    async deleteGroup(req, res) {
      try {
        const group = await groupService.deleteGroup(req.params.id);
        if (!group) {
          return res.status(404).json({ message: 'Group not found' });
        }
        res.json({ message: 'Group deleted successfully' });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
  
    async addMember(req, res) {
      try {
        const group = await groupService.addMemberToGroup(req.params.id, req.body.email);
        if (!group) {
          return res.status(404).json({ message: 'Group not found' });
        }
        res.json(group);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    }
  
    async removeMember(req, res) {
      try {
        const group = await groupService.removeMemberFromGroup(req.params.id, req.params.userId);
        if (!group) {
          return res.status(404).json({ message: 'Group not found' });
        }
        res.json(group);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    }
    async getTasksById(req, res) {
      try {
        const tasks = await groupService.getTasksById(req.params.id);
        res.json(tasks);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
  }
  
  module.exports = new GroupController();