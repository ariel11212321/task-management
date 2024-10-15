import React, { useState, useCallback } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';
import AddTaskForm from '../AddTaskForm';
import TaskItem from '../TaskItem';
import SideBar from '../SideBar';
import Header from '../Header';
import UpdateTaskModal from '../UpdateTaskModal';
import useTasks from '../../hooks/useTasks';

export default function Home() {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [taskToUpdate, setTaskToUpdate] = useState(null);


  const { tasks, isLoading, error, addTask, updateTask, deleteTask } = useTasks();

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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Tasks</h3>
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
                onAddTask={handleAddTask}
                onCancel={() => setIsAddingTask(false)}
              />
            )}
            <div className="space-y-2 mt-4">
              {tasks.map((task) => (
                <div key={task._id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedTasks.includes(task._id)}
                    onChange={() => handleTaskSelect(task._id)}
                    className="mr-2"
                  />
                  <TaskItem task={task} />
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
          closeModal={() => setIsUpdateModalOpen(false)}
          task={taskToUpdate}
          onUpdate={handleUpdateTask}
        />
      )}
    </div>
  );
}