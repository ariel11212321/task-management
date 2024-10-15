import React, { useState, useEffect, useCallback } from "react";
import { useUser } from "../../contexts/UserContext";
import { useAuth } from "../../contexts/AuthContext";
import useHttp from "../../hooks/useHttp";
import config from "../../config.json";
import { useNavigate } from "react-router-dom";

export default function GroupPage() {
  const { user, setUser } = useUser();
  const { token } = useAuth();
  const { sendRequest, isLoading, error } = useHttp();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupId, setGroupId] = useState("");


  useEffect(() => {
    if (!user?.group) {
      setShowModal(true);
    } else {
        navigate("/groupHome");
    }
  }, [user.group]);

  const handleCreateGroup = useCallback(async (e) => {
    e.preventDefault();
      const res = await sendRequest(config.SERVER_URL + "/groups", "POST", { name: groupName, admin: user._id, members: [user._id] }, {
        "Authorization": "Bearer " + token
      });
      if (res) {
        setUser({ ...user, group: res._id });
        setShowModal(false);
      }
  }, [sendRequest, token, groupName, user, setUser]);

  const handleJoinGroup = useCallback(async (e) => {
    e.preventDefault();
      const res = await sendRequest(config.SERVER_URL + `/groups/${groupId}/members`, "POST", {}, {
        "Authorization": "Bearer " + token
      });
      setUser({ ...user, group: res._id });
      setShowModal(false);
  }, [sendRequest, token, groupId, user, setUser]);

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Join or Create a Group</h1>
      {showModal && (
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
      )}
    </div>
  );
}