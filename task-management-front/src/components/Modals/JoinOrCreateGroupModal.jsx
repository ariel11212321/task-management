import { useCallback, useState } from "react";
import useHttp from "../../hooks/useHttp";
import { useAuth } from "../../contexts/AuthContext";
import { useUser } from "../../contexts/UserContext";
import config from '../../config.json';
import { useNavigate } from "react-router-dom";
import useGroup from "../../hooks/useGroup";
import LoadingScreen from "../LoadingScreen";

export default function JoinOrCreateGroupModal({onSubmitCreate, onSubmitJoin}) {

    const [groupName, setGroupName] = useState("");
    const [groupId, setGroupId] = useState("");
    const { createGroup, joinGroup, isCreatingGroup, isJoiningGroup } = useGroup();
  
  const handleCreateGroup = useCallback(async (e) => {
    e.preventDefault();
    try {
      await createGroup({ name: groupName });
      onSubmitCreate();
    } catch (error) {
      
    }
  }, [createGroup, groupName, onSubmitCreate]);

  const handleJoinGroup = useCallback(async (e) => {
    e.preventDefault();
    try {
      await joinGroup(groupId);
      onSubmitJoin();
    } catch (error) {
     
    }
  }, [joinGroup, groupId, onSubmitJoin]);

      
    
  if (isCreatingGroup || isJoiningGroup) {
    return <LoadingScreen />;
  }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-xl font-semibold mb-4">Join or Create a Group</h2>
          <form onSubmit={handleJoinGroup} className="mb-4">
            <label htmlFor="groupId" className="block text-sm font-medium text-gray-700 mb-2">
              Join Existing Group
            </label>
            <input
              type="text"
              id="groupId"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              placeholder="Enter Group ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="submit"
              className="mt-2 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Join Group
            </button>
          </form>
          <form onSubmit={handleCreateGroup}>
            <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-2">
              Create New Group
            </label>
            <input
              type="text"
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter Group Name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="submit"
              className="mt-2 w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Create Group
            </button>
          </form>
        </div>
      </div>
    )
}