import React, { useCallback, useEffect, useState } from 'react';
import { Plus, Menu, Search, Bell, User, ChevronDown } from 'lucide-react';
import AddTaskForm from '../AddTaskForm';
import TaskItem from '../TaskItem';
import SideBar from '../SideBar';
import useHttp from '../../hooks/useHttp';
import config from '../../config.json';
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const [allTasks, setAllTasks] = useState([]);
    const [displayedTasks, setDisplayedTasks] = useState([]);
    const [isAddingTask, setIsAddingTask] = useState(false);
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
  
    return (
      <div className="flex h-screen bg-gray-100">
        
        <SideBar/>
  
      
        <div className="flex-1 flex flex-col overflow-hidden">
        
          <header className="bg-white shadow-sm">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <Menu className="mr-4 text-gray-500" />
                <h2 className="text-xl font-semibold">My Tasks</h2>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    onChange={(e) => searchTasks(e.target.value)}
                    type="text"
                    placeholder="Search..."
                    className="pl-8 pr-2 py-1 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                </div>
                <Bell className="text-gray-500" />
                <div className="flex items-center">
                  <User className="text-gray-500 mr-1" />
                  <ChevronDown className="text-gray-500" size={16} />
                </div>
              </div>
            </div>
          </header>
 
          <main className="flex-1 overflow-y-auto p-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Tasks</h3>
                <button
                  onClick={() => setIsAddingTask(true)}
                  className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                >
                  <Plus size={16} className="mr-1" /> Add Task
                </button>
              </div>
              {isAddingTask && (
                
                <AddTaskForm
                  onAddTask={addTask}
                  onCancel={() => setIsAddingTask(false)}
                />
                
         
              )}
              <div className="space-y-2 mt-4">
                {displayedTasks.map((task, index) => (
                  <TaskItem key={index} task={task} />
                ))}
                
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }