const Group = require('../models/Group');
const Task = require('../models/Task');
const User = require('../models/User');
const mongoose = require('mongoose');
class GroupService {
   async createGroup(groupData) {
    try {
      const group = await Group.create(groupData);
      const updatePromises = group.members.map(memberId =>
        User.findByIdAndUpdate(memberId, { group: group._id }, { new: true })
      );
      
      await Promise.all(updatePromises);
      
      return group;
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  }

    async getGroupById(groupId) {
      return await Group.findById(groupId).populate('members');
    }
  
    async updateGroup(groupId, updateData) {
      return await Group.findByIdAndUpdate(groupId, updateData, { new: true });
    }
  
    async deleteGroup(groupId) {
      return await Group.findByIdAndDelete(groupId);
    }
  
    async addMemberToGroup(groupId, userMail) {
      try {
        const user = await User.findOne({ email: userMail });
        if (!user) {
          return null; 
        }
        const group = await Group.findByIdAndUpdate(
          groupId,
          { $addToSet: { members: user._id } },
          { new: true }
        );
    
        if (!group) {
          throw new Error('Group not found');
        }
        user.group = groupId;
        await user.save();
    
        return user;
      } catch (error) {
        console.error('Error adding member to group:', error);
        throw error; 
      }
    }
    async getTasksById(groupId) {
      const tasks = await Task.find({createdBy: groupId});
      return tasks;
    }
  
    async removeMemberFromGroup(groupId, userId) {
      const user = await User.findById(userId);
      if(user) {
        user.group = "";
        await user.save();
      }
      return await Group.findByIdAndUpdate(
        groupId,
        { $pull: { members: userId } },
        { new: true }
      );
    }
  }
  
module.exports = new GroupService();