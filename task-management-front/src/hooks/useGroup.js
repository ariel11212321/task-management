import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import config from '../config.json';

const useGroup = () => {
  const { token } = useAuth();
  const { user, setUser } = useUser();
  const queryClient = useQueryClient();

  const fetchGroup = async () => {
    if (!user.group) return null;
    const response = await fetch(`${config.SERVER_URL}/groups/${user.group}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch group');
    }
    return response.json();
  };

  const { data: group, isLoading, error } = useQuery(
    ['group', user.group],
    fetchGroup,
    {
      enabled: !!user.group
    }
  );

  const updateGroupMutation = useMutation(
    async (updatedGroup) => {
      const response = await fetch(`${config.SERVER_URL}/groups/${user.group}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedGroup)
      });
      if (!response.ok) {
        throw new Error('Failed to update group');
      }
      return response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['group', user.group]);
      }
    }
  );

  const createGroupMutation = useMutation(
    async ({ name }) => {
      const response = await fetch(`${config.SERVER_URL}/groups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, admin: user._id, members: [user._id] })
      });
      if (!response.ok) {
        throw new Error('Failed to create group');
      }
      return response.json();
    },
    {
      onSuccess: (data) => {
        setUser({ ...user, group: data._id });
        queryClient.invalidateQueries(['group']);
      }
    }
  );

  const joinGroupMutation = useMutation(
    async (groupId) => {
      const response = await fetch(`${config.SERVER_URL}/groups/${groupId}/members`, {
        method: 'POST',
        body: JSON.stringify(user?.email),
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to join group');
      }
      return response.json();
    },
    {
      onSuccess: (data) => {
        setUser({ ...user, group: data._id });
        queryClient.invalidateQueries(['group']);
      }
    }
  );

  return {
    group,
    isLoading,
    error,
    updateGroup: updateGroupMutation.mutate,
    createGroup: createGroupMutation.mutateAsync,
    joinGroup: joinGroupMutation.mutateAsync,
    isCreatingGroup: createGroupMutation.isLoading,
    isJoiningGroup: joinGroupMutation.isLoading
  };
};

export default useGroup;