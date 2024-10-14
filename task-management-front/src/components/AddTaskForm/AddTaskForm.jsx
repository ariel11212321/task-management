import React, { useState } from 'react';
import config from '../../config.json';
import { useUser } from '../../contexts/UserContext';
import moment from 'moment';
const AddTaskForm = ({ onAddTask, onCancel, initialDate, isTeamTask=false }) => {
  const [taskName, setTaskName] = useState('');
  const [dueDate, setDueDate] = useState(initialDate || moment().format('YYYY-MM-DD'));
  const [status, setStatus] = useState('pending');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');

  const {user} = useUser();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskName.trim()) {
      onAddTask({
        name: taskName,
        dueDate: dueDate || 'No date',
        status: status,
        priority,
        description,
        assignedTo: [],
        createdBy: isTeamTask ? user.group : user._id
      });
      setTaskName('');
      setDueDate('');
      setStatus('Not Started');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2 space-y-3">
      <input
        type="text"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        placeholder="Enter task name"
        className="w-full p-2 border rounded-md"
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter task description"
        className="w-full p-2 border rounded-md"
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="w-full p-2 border rounded-md"
      >
        <option value="low">low</option>
        <option value="medium">medium</option>
        <option value="high">high</option>
      </select>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="w-full p-2 border rounded-md"
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full p-2 border rounded-md"
      >
        <option value="pending">Pending</option>
        <option value="in progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onCancel} className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md">
          Cancel
        </button>
        <button type="submit" className="px-3 py-1 text-sm text-white bg-green-500 hover:bg-green-600 rounded-md">
          Add Task
        </button>
      </div>
    </form>
  );
};

export default AddTaskForm;