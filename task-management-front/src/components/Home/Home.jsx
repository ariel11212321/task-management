import React, { useState } from 'react';
import { Plus, Menu, Search, Bell, User, ChevronDown, MoreHorizontal } from 'lucide-react';
import AddTaskForm from '../AddTaskForm';
import TaskItem from '../TaskItem';


export default function Home() {
    const [tasks, setTasks] = useState([
      { name: 'Design new landing page', dueDate: 'Tomorrow' },
      { name: 'Update user profile section', dueDate: 'Next week' },
      { name: 'Fix login bug', dueDate: 'Today' },
    ]);
    const [isAddingTask, setIsAddingTask] = useState(false);
    
    const addTask = () => {
      
    }
    
  
    return (
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="w-64 bg-indigo-800 text-white p-4">
          <div className="flex items-center mb-8">
            <div className="w-8 h-8 bg-white rounded-md mr-2"></div>
            <h1 className="text-xl font-bold">Your Workspace</h1>
          </div>
          <nav>
            <ul className="space-y-2">
              <li className="p-2 hover:bg-indigo-700 rounded-md cursor-pointer">Dashboard</li>
              <li className="p-2 hover:bg-indigo-700 rounded-md cursor-pointer">My Tasks</li>
              <li className="p-2 hover:bg-indigo-700 rounded-md cursor-pointer">Projects</li>
              <li className="p-2 hover:bg-indigo-700 rounded-md cursor-pointer">Calendar</li>
            </ul>
          </nav>
        </div>
  
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white shadow-sm">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <Menu className="mr-4 text-gray-500" />
                <h2 className="text-xl font-semibold">My Tasks</h2>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
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
  
          {/* Task List */}
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
                {tasks.map((task, index) => (
                    
                  <TaskItem key={index} task={task} />
                  
    
                ))}
                
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }