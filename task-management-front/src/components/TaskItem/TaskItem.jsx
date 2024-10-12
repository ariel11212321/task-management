import React from 'react';
import { MoreHorizontal } from 'lucide-react';

const TaskItem = ({ task }) => (
    <div className="flex items-center p-2 hover:bg-gray-100 rounded-md">
      <input type="checkbox" className="mr-2" />
      <div className="flex-grow">{task.name}</div>
      <div className="text-sm text-gray-500">{task.dueDate}</div>
      <MoreHorizontal size={16} className="ml-2 text-gray-400" />
    </div>
  );

export default TaskItem;