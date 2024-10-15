import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import config from '../config.json';

const useTasks = (isGroupTasks = false) => {
  const { token } = useAuth();
  const { user } = useUser();
  const queryClient = useQueryClient();

  const fetchTasks = async () => {
    const url = isGroupTasks
      ? `${config.SERVER_URL}/groups/${user.group}/tasks`
      : `${config.SERVER_URL}/users/${user._id}/tasks`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    return response.json();
  };

  const { data: tasks, isLoading, error } = useQuery(
    isGroupTasks ? ['groupTasks', user.group] : ['tasks', user._id],
    fetchTasks,
    {
      enabled: !!user._id && (isGroupTasks ? !!user.group : true)
    }
  );

  const addTaskMutation = useMutation(
    async (newTask) => {
      const response = await fetch(`${config.SERVER_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newTask)
      });
      if (!response.ok) {
        throw new Error('Failed to add task');
      }
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(isGroupTasks ? ['groupTasks', user.group] : ['tasks', user._id]);
      }
    }
  );

  const updateTaskMutation = useMutation(
    async (updatedTask) => {
      const response = await fetch(`${config.SERVER_URL}/tasks/${updatedTask._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedTask)
      });
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(isGroupTasks ? ['groupTasks', user.group] : ['tasks', user._id]);
      }
    }
  );

  const deleteTaskMutation = useMutation(
    async (taskId) => {
      const response = await fetch(`${config.SERVER_URL}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(isGroupTasks ? ['groupTasks', user.group] : ['tasks', user._id]);
      }
    }
  );

  return {
    tasks,
    isLoading,
    error,
    addTask: addTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate
  };
};

export default useTasks;