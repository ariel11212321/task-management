import React, { useState, useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Plus } from 'lucide-react';
import UpdateTaskModal from '../UpdateTaskModal';
import AddTaskForm from '../AddTaskForm';
import SideBar from '../SideBar';
import dateHelper from '../../lib/dateHelper';
import { useUser } from '../../contexts/UserContext';
import useTasks from '../../hooks/useTasks';

const localizer = momentLocalizer(moment);

const TaskCalendarPage = () => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const { user } = useUser();

  const { 
    tasks: personalTasks, 
    isLoading: isPersonalTasksLoading, 
    error: personalTasksError,
    addTask: addPersonalTask,
    updateTask: updatePersonalTask
  } = useTasks(false);

  const { 
    tasks: groupTasks, 
    isLoading: isGroupTasksLoading, 
    error: groupTasksError
  } = useTasks(true);

  const events = useMemo(() => {
    return [...personalTasks, ...groupTasks].map(task => {
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
  }, [personalTasks, groupTasks]);

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
    const taskToAdd = {
      ...newTask,
      dueDate: new Date(dateHelper.formatDate(newTask.dueDate))
    };
    await addPersonalTask(taskToAdd);
    setIsAddingTask(false);
    setSelectedDate(null);  
  };

  const handleUpdateTask = async (updatedTask) => {
    await updatePersonalTask(updatedTask);
    setIsUpdateModalOpen(false);
  };

  if (isPersonalTasksLoading || isGroupTasksLoading) {
    return <div>Loading...</div>;
  }

  if (personalTasksError || groupTasksError) {
    return <div>Error: {personalTasksError || groupTasksError}</div>;
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
          isTeamTask={groupTasks.some(task => task._id === selectedTask._id)}
        />
      )}
    </div>
  );
};

export default TaskCalendarPage;