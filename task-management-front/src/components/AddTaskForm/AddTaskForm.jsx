import React, { useState } from 'react';

const AddTaskForm = ({ onAddTask, onCancel }) => {
    const [taskName, setTaskName] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (taskName.trim()) {
        onAddTask({ name: taskName, dueDate: 'No date' });
        setTaskName('');
      }
    };
  
    return (
      <form onSubmit={handleSubmit} className="mt-2">
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="Enter task name"
          className="w-full p-2 border rounded-md"
        />
        <div className="mt-2 flex justify-end space-x-2">
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