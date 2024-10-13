import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import dateHelper from "../../lib/dateHelper";





const TaskItem = ({ task, isTeamTask=false }) => (
  <div className="flex items-center p-2 hover:bg-gray-100 rounded-md">
    
    <div className="flex-grow">
      <div className="font-semibold">{task.name}</div>
      <div className="text-xs text-gray-600">description: {task.description}</div>
      <div className="text-sm text-gray-500">{dateHelper.formatDate(task.dueDate)}</div>
      <div className={`text-xs font-bold ${task.priority === 'high' ? 'text-red-500' : task.priority === 'medium' ? 'text-yellow-500' : 'text-green-500'}`}>
        Priority: {task.priority}
      </div>
      <div className={`text-xs ${task.status === 'completed' ? 'text-green-500' : 'text-blue-500'}`}>
        Status: {task.status}
      </div>
      {isTeamTask && (
        <div className="text-xs text-gray-600">Assigned to: {task.assignedTo}</div>
      )}
    </div>
    
  </div>
);

export default TaskItem;