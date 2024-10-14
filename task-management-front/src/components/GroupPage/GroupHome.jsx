import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import useHttp from '../../hooks/useHttp';
import config from '../../config.json';

import Header from '../Header';
import SideBar from '../SideBar';
import AddTaskForm from '../AddTaskForm';
import TaskItem from '../TaskItem';
import UpdateTaskModal from '../UpdateTaskModal';
import ManageGroup from './ManageGroup';

export default function GroupHome() {
  const [groupTasks, setGroupTasks] = useState([]);
  const [group, setGroup] = useState([]);
  const [displayedTasks, setDisplayedTasks] = useState([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [taskToUpdate, setTaskToUpdate] = useState(null);
  const { sendRequest, isLoading, error } = useHttp();
  const { isAuthenticated, token } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();

  const fetchGroup = async() => {
    if (user.group) {
      const res = await sendRequest(`${config.SERVER_URL}/groups/${user.group}`, 'GET', null, {
        'Authorization': 'Bearer ' + token
      });
      setGroup(res);
    } else {
      navigate("/login");
    }
  }

  const fetchGroupTasks = useCallback(async () => {
    if (isAuthenticated && user.group) {
      const res = await sendRequest(`${config.SERVER_URL}/groups/${user.group}/tasks`, 'GET', null, {
        'Authorization': 'Bearer ' + token
      });
      if (res) {
        setGroupTasks(res);
        setDisplayedTasks(res);
      }
    } else {
      navigate("/login");
    }
  }, [isAuthenticated, user.group, sendRequest, token, navigate]);

  useEffect(() => {
    fetchGroupTasks();
    fetchGroup();
  }, [fetchGroupTasks]);

  const addTask = useCallback(async (data) => {
    if (isAuthenticated && user.group) {
      const res = await sendRequest(`${config.SERVER_URL}/tasks`, 'POST', data, {
        'Authorization': 'Bearer ' + token
      });
      if (res) {
        setGroupTasks(prevTasks => [...prevTasks, res]);
        setDisplayedTasks(prevTasks => [...prevTasks, res]);
      }
    } else {
      navigate("/login");
    }
  }, [isAuthenticated, user.group, sendRequest, token, navigate]);

  const updateTask = useCallback(async (updatedTask) => {
    if (isAuthenticated && user.group) {
      const res = await sendRequest(`${config.SERVER_URL}/tasks/${updatedTask._id}`, 'PUT', updatedTask, {
        'Authorization': 'Bearer ' + token
      });
      if (res) {
        setGroupTasks(prevTasks => prevTasks.map(task => task._id === updatedTask._id ? res : task));
        setDisplayedTasks(prevTasks => prevTasks.map(task => task._id === updatedTask._id ? res : task));
      }
    } else {
      navigate("/login");
    }
  }, [isAuthenticated, user.group, sendRequest, token, navigate]);

  const deleteTasks = useCallback(async () => {
    if (isAuthenticated && user.group && selectedTasks.length > 0) {
      try {
        const deletePromises = selectedTasks.map(taskId =>
          sendRequest(`${config.SERVER_URL}/tasks/${taskId}`, 'DELETE', null, {
            'Authorization': 'Bearer ' + token
          })
        );
        
        await Promise.all(deletePromises);
        setGroupTasks(prevTasks => prevTasks.filter(task => !selectedTasks.includes(task._id)));
        setDisplayedTasks(prevTasks => prevTasks.filter(task => !selectedTasks.includes(task._id)));
        setSelectedTasks([]);
      } catch (error) {
        
      }
    } else if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, user.group, selectedTasks, sendRequest, token, navigate, fetchGroupTasks]);

  const searchTasks = useCallback((searchTerm) => {
    const filteredTasks = groupTasks.filter(task =>
      task.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setDisplayedTasks(filteredTasks);
  }, [groupTasks]);

  const handleTaskSelect = (taskId) => {
    setSelectedTasks(prev =>
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  const openUpdateModal = (task) => {
    setTaskToUpdate(task);
    setIsUpdateModalOpen(true);
  };

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header searchTasks={searchTasks} />
        <main className="flex-1 overflow-y-auto p-4">

          {group.admin === user._id && (
            <ManageGroup group={group}/>
          )}
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
                isTeamTask={true}
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
                  <TaskItem isTeamTask={true} task={task} members={group.members} />
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
          onUpdate={updateTask}
        />
      )}
    </div>
  );
}