import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Plus } from 'lucide-react';
import UpdateTaskModal from '../UpdateTaskModal';
import AddTaskForm from '../AddTaskForm';
import useHttp from '../../hooks/useHttp';
import { useAuth } from '../../contexts/AuthContext';
import config from '../../config.json';
import SideBar from '../SideBar';
import dateHelper from '../../lib/dateHelper';

const localizer = momentLocalizer(moment);

const TaskCalendarPage = () => {
  const [tasks, setTasks] = useState([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);  // New state for selected date
  const { sendRequest, isLoading, error } = useHttp();
  const { isAuthenticated, token } = useAuth();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    if (isAuthenticated) {
      const fetchedTasks = await sendRequest(config.SERVER_URL + "/tasks/", 'GET', null, {
        'Authorization': 'Bearer ' + token
      });
      if (fetchedTasks) {
        setTasks(fetchedTasks);
      }
    }
  };

  const events = useMemo(() => {
    return tasks.map(task => {
      const dueDate = new Date(dateHelper.formatDate(task.dueDate));
      return {
        id: task.id,
        title: task.name,
        start: dueDate,
        end: dueDate,
        allDay: true,
        resource: task
      };
    });
  }, [tasks]);

  const eventStyleGetter = (event) => {
    let backgroundColor = '#3174ad';
    if (event.resource.priority === 'high') {
      backgroundColor = '#d32f2f';
    } else if (event.resource.priority === 'medium') {
      backgroundColor = '#f57c00';
    }
    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  const handleSelectEvent = (event) => {
    setSelectedTask(event.resource);
    setIsUpdateModalOpen(true);
  };

  const handleSelectSlot = ({ start }) => {
    setSelectedDate(moment(start).format('YYYY-MM-DD'));
    setIsAddingTask(true);
  };

  const handleAddTask = async (newTask) => {
    if (isAuthenticated) {
      const taskToAdd = {
        ...newTask,
        dueDate: new Date(dateHelper.formatDate(newTask.dueDate))
      };
      const addedTask = await sendRequest(config.SERVER_URL + "/tasks/", 'POST', taskToAdd, {
        'Authorization': 'Bearer ' + token
      });
      if (addedTask) {
        setTasks(prevTasks => [...prevTasks, addedTask]);
      }
    }
    setIsAddingTask(false);
    setSelectedDate(null);  // Reset selected date after adding task
  };

  const handleUpdateTask = async (updatedTask) => {
    if (isAuthenticated) {
      const updated = await sendRequest(`${config.SERVER_URL}/tasks/${updatedTask.id}`, 'PUT', updatedTask, {
        'Authorization': 'Bearer ' + token
      });
      if (updated) {
        setTasks(prevTasks => prevTasks.map(task => task.id === updatedTask.id ? updated : task));
      }
    }
    setIsUpdateModalOpen(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-2xl font-bold">Task Calendar</h1>
            <button
              onClick={() => {
                setSelectedDate(moment().format('YYYY-MM-DD'));
                setIsAddingTask(true);
              }}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              <Plus size={20} className="mr-2" /> Add Task
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4">
          <div className="bg-white rounded-lg shadow p-4 h-full">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 'calc(100% - 2rem)' }}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              selectable
              eventPropGetter={eventStyleGetter}
            />
          </div>
        </main>
      </div>
      {isAddingTask && (
        <AddTaskForm
          onAddTask={handleAddTask}
          onCancel={() => {
            setIsAddingTask(false);
            setSelectedDate(null);
          }}
          initialDate={selectedDate}
        />
      )}
      {selectedTask && (
        <UpdateTaskModal
          isOpen={isUpdateModalOpen}
          closeModal={() => setIsUpdateModalOpen(false)}
          task={selectedTask}
          onUpdate={handleUpdateTask}
        />
      )}
    </div>
  );
};

export default TaskCalendarPage;