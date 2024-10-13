import React, { useCallback, useEffect, useState } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';
import AddTaskForm from '../AddTaskForm';
import TaskItem from '../TaskItem';
import SideBar from '../SideBar';
import Header from '../Header';
import useHttp from '../../hooks/useHttp';
import config from '../../config.json';
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import UpdateTaskModal from '../UpdateTaskModal';

export default function Home() {
  const [allTasks, setAllTasks] = useState([]);
  const [displayedTasks, setDisplayedTasks] = useState([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [taskToUpdate, setTaskToUpdate] = useState(null);
  const { sendRequest, isLoading, error } = useHttp();
  const { isAuthenticated, token } = useAuth();
  const { user, updateUser } = useUser();
  const navigate = useNavigate();

  const addTask = useCallback(async (data) => {
    if (isAuthenticated) {
      const res = await sendRequest(config.SERVER_URL + "/tasks/", 'POST', data, {
        'Authorization': 'Bearer ' + token
      });
      if (res) {
        setAllTasks(prevTasks => [...prevTasks, res]);
        setDisplayedTasks(prevTasks => [...prevTasks, res]);
      }
    } else {
      navigate("/login");
    }
  }, [isAuthenticated, sendRequest, token, navigate]);

  const updateTask = useCallback(async (updatedTask) => {
    if (isAuthenticated) {
      const res = await sendRequest(`${config.SERVER_URL}/tasks/${updatedTask._id}`, 'PUT', updatedTask, {
        'Authorization': 'Bearer ' + token
      });
      if (res) {
        setAllTasks(prevTasks => prevTasks.map(task => task._id === updatedTask._id ? res : task));
        setDisplayedTasks(prevTasks => prevTasks.map(task => task._id === updatedTask._id ? res : task));
      }
    } else {
      navigate("/login");
    }
  }, [isAuthenticated, sendRequest, token, navigate]);

  const deleteTasks = useCallback(async () => {
    if (isAuthenticated && selectedTasks.length > 0) {
      try {
        const deletePromises = selectedTasks.map(taskId =>
          sendRequest(`${config.SERVER_URL}/tasks/${taskId}`, 'DELETE', null, {
            'Authorization': 'Bearer ' + token
          })
        );
        await Promise.all(deletePromises);
        setAllTasks(prevTasks => prevTasks.filter(task => !selectedTasks.includes(task._id)));
        setDisplayedTasks(prevTasks => prevTasks.filter(task => !selectedTasks.includes(task._id)));
        setSelectedTasks([]);
      } catch(e) {
        
      }
    } else if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, selectedTasks, sendRequest, token, navigate]);

  const searchTasks = useCallback((searchTerm) => {
    const filteredTasks = allTasks.filter(task =>
      task.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setDisplayedTasks(filteredTasks);
  }, [allTasks]);

  const fetchTasks = async () => {
    if (isAuthenticated) {
      const res = await sendRequest(config.SERVER_URL + "/tasks/", 'GET', null, {
        'Authorization': 'Bearer ' + token
      });
      if (res) {
        setAllTasks(res);
        setDisplayedTasks(res);
      }
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskSelect = (taskId) => {
    setSelectedTasks(prev =>
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  const openUpdateModal = (task) => {
    setTaskToUpdate(task);
    setIsUpdateModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header searchTasks={searchTasks}/>
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
                    onClick={deleteTasks}
                    className="flex items-center text-sm text-red-600 hover:text-red-800"
                  >
                    <Trash size={16} className="mr-1" /> Delete Selected
                  </button>
                )}
              </div>
            </div>
            {isAddingTask && (
              <AddTaskForm
                onAddTask={addTask}
                onCancel={() => setIsAddingTask(false)}
              />
            )}
            <div className="space-y-2 mt-4">
              {displayedTasks.map((task) => (
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
          onUpdate={updateTask}
        />
      )}
    </div>
  );
}