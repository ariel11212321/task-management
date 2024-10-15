import React, { useState, useCallback } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

import Header from '../Header';
import SideBar from '../SideBar';
import AddTaskForm from '../AddTaskForm';
import TaskItem from '../TaskItem';
import UpdateTaskModal from '../UpdateTaskModal';
import ManageGroup from './ManageGroup';
import useTasks from '../../hooks/useTasks';
import useGroup from '../../hooks/useGroup';

export default function GroupHome() {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [taskToUpdate, setTaskToUpdate] = useState(null);
  const { user } = useUser();
 

  const { 
    tasks: groupTasks, 
    isLoading: isTasksLoading, 
    error: tasksError, 
    addTask, 
    updateTask, 
    deleteTask 
  } = useTasks(true); 

  const {
    group,
    isLoading: isGroupLoading,
    error: groupError
  } = useGroup();

  const handleAddTask = useCallback((data) => {
    addTask(data);
    setIsAddingTask(false);
  }, [addTask]);

  const handleUpdateTask = useCallback((updatedTask) => {
    updateTask(updatedTask);
    setIsUpdateModalOpen(false);
  }, [updateTask]);

  const handleDeleteTasks = useCallback(() => {
    selectedTasks.forEach(taskId => deleteTask(taskId));
    setSelectedTasks([]);
  }, [selectedTasks, deleteTask]);

  const handleTaskSelect = (taskId) => {
    setSelectedTasks(prev =>
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  const openUpdateModal = (task) => {
    setTaskToUpdate(task);
    setIsUpdateModalOpen(true);
  };

  const searchTasks = useCallback((searchTerm) => {
    return groupTasks.filter(task =>
      task.name?.toLowerCase().includes(searchTerm?.toLowerCase())
    );
  }, [groupTasks]);

  if (isTasksLoading || isGroupLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (tasksError || groupError) {
    return <div className="p-4 text-red-500">{tasksError || groupError}</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header searchTasks={searchTasks} />
        <main className="flex-1 overflow-y-auto p-4">
          {group && group.admin === user._id && (
            <ManageGroup group={group} />
          )}

          <div className='mb-4'> </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Group Tasks</h3>
              <div>
                <button
                  onClick={() => setIsAddingTask(true)}
                  className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 mr-2"
                >
                  <Plus size={16} className="mr-1" /> Add Task
                </button>
                {selectedTasks.length > 0 && (
                  <button
                    onClick={handleDeleteTasks}
                    className="flex items-center text-sm text-red-600 hover:text-red-800"
                  >
                    <Trash size={16} className="mr-1" /> Delete Selected
                  </button>
                )}
              </div>
            </div>
            {isAddingTask && (
              <AddTaskForm
                isTeamTask={true}
                onAddTask={handleAddTask}
                onCancel={() => setIsAddingTask(false)}
              />
            )}
            <div className="space-y-2 mt-4">
              {groupTasks.map((task) => (
                <div key={task._id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedTasks.includes(task._id)}
                    onChange={() => handleTaskSelect(task._id)}
                    className="mr-2"
                  />
                  <TaskItem isTeamTask={true} task={task} members={group?.members} />
                  <button
                    onClick={() => openUpdateModal(task)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <Edit size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
      {taskToUpdate && (
        <UpdateTaskModal
          isOpen={isUpdateModalOpen}
          isTeamTask={true}
          closeModal={() => setIsUpdateModalOpen(false)}
          task={taskToUpdate}
          onUpdate={handleUpdateTask}
        />
      )}
    </div>
  );
}