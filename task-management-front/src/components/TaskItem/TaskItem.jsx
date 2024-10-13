import React from 'react';
import { MoreHorizontal } from 'lucide-react';

function convertTime(isoDateString) {
  const date = new Date(isoDateString);
  const optionsDate = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const optionsTime = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  };
  const userReadableDate = date.toLocaleDateString('en-US', optionsDate);
  const userReadableTime = date.toLocaleTimeString('en-US', optionsTime);
  return `${userReadableDate} (${userReadableTime})`;
}

const TaskItem = ({ task, isTeamTask=false }) => (
  <div className="flex items-center p-2 hover:bg-gray-100 rounded-md">
    <input type="checkbox" className="mr-2" />
    <div className="flex-grow">
      <div className="font-semibold">{task.name}</div>
      <div className="text-xs text-gray-600">description: {task.description}</div>
      <div className="text-sm text-gray-500">{convertTime(task.dueDate)}</div>
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
    <MoreHorizontal size={16} className="ml-2 text-gray-400" />
  </div>
);

export default TaskItem;