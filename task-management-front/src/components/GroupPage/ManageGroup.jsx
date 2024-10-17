import React, { useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import { useAuth } from '../../contexts/AuthContext';
import useHttp from '../../hooks/useHttp';
import config from '../../config.json';

const ManageGroup = ({ group, onGroupUpdated }) => {
  const { user } = useUser();
  const { token } = useAuth();
  const { sendRequest } = useHttp();
  const [newMemberEmail, setNewMemberEmail] = useState('');

  const addMember = async () => {
    const res = await sendRequest(`${config.SERVER_URL}/groups/${group._id}/members`, 'POST', { email: newMemberEmail }, {
      'Authorization': 'Bearer ' + token
    });
    if (res) {
      group.members.push(res);
      setNewMemberEmail('');
    }
  };

  const removeMember = async (memberId) => {
    const res = await sendRequest(`${config.SERVER_URL}/groups/${group._id}/members/${memberId}`, 'DELETE', null, {
      'Authorization': 'Bearer ' + token,
    });
    if (res) {
      group.members = group.members.filter(member => member._id !== memberId);
    }
  };



  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4">Manage Group</h3>
      <div className="mb-4">
        <h4 className="text-md font-medium mb-2">Add Member</h4>
        <div className="flex space-x-2">
          <input 
            type="email"
            value={newMemberEmail}
            onChange={(e) => setNewMemberEmail(e.target.value)}
            placeholder="Member email"
            className="border border-gray-300 rounded px-2 py-1"
          />
          <button 
            onClick={addMember}
            className="bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700"
          >
            Add
          </button>
        </div>
      </div>
      <div>
        <h4 className="text-md font-medium mb-2">Members</h4>
        <ul>
          {group.members.map(member => (
            <li key={member._id} className="flex justify-between items-center mb-1">
              <span>{member.email}</span>
              {member._id !== user._id && (
                <button
                  onClick={() => removeMember(member._id)}
                  className="bg-red-600 text-white text-sm px-2 py-1 rounded hover:bg-red-700"
                >
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ManageGroup;