import React, { useState } from 'react';
import { X, User, Mail, Lock } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';

const UpdateUserModal = ({ isOpen, onClose, onSubmit }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {setUser} = useUser();

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser((prev) => ({ ...prev, username, email, password }));
    onSubmit();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Update User</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
              Username
            </label>
            <div className="flex items-center border rounded-md">
              <span className="px-3 py-2 bg-gray-100 border-r">
                <User size={20} className="text-gray-500" />
              </span>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 outline-none"
                placeholder="Enter username"
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <div className="flex items-center border rounded-md">
              <span className="px-3 py-2 bg-gray-100 border-r">
                <Mail size={20} className="text-gray-500" />
              </span>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 outline-none"
                placeholder="Enter email"
              />
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <div className="flex items-center border rounded-md">
              <span className="px-3 py-2 bg-gray-100 border-r">
                <Lock size={20} className="text-gray-500" />
              </span>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 outline-none"
                placeholder="Enter password"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateUserModal;