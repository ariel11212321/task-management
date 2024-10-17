import React, { useState } from 'react';
import { Moon, Bell, Mail, Globe, Calendar, List, User, Trash } from 'lucide-react';
import SideBar from '../SideBar';
import Header from '../Header';
import UpdateUserModal from '../Modals/UpdateUserModal';
import SettingItem from './SettingsItem';
import useHttp from '../../hooks/useHttp';
import config from '../../config.json';
import { useUser } from '../../contexts/UserContext';
import { useAuth } from '../../contexts/AuthContext';


const Settings = () => {
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: true,
    emailNotifications: true,
    language: 'English',
    timezone: 'UTC',
    defaultView: 'List',
    defaultSortOrder: 'Due Date',
    showCompleted: true,
    privacyMode: false,
  });

  const [showEditProfile, setShowEditProfile] = useState(false);
  
  const {sendRequest} = useHttp();
  const {user} = useUser();
  const {token} = useAuth();

  async function handleSubmitEditProfile() {
    try {
        const res = await sendRequest(config.SERVER_URL + "/users/" + user._id, "PUT", {username: user.username, email: user.email, password: user.password}, {
            'Authorization': `Bearer ${token}`
        });
    } catch(e) {
        
    }
  }


  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Settings</h1>
            
            <section className="mb-12">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Preferences</h2>
              <SettingItem 
                icon={<Moon className="text-gray-400" size={24} />}
                title="Dark Mode"
                description="Switch to dark theme"
                setting="darkMode"
                settings={settings}
                setSettings={setSettings}
              />
              <SettingItem 
                icon={<Bell className="text-gray-400" size={24} />}
                title="Notifications"
                description="Enable push notifications"
                setting="notifications"
                settings={settings}
                setSettings={setSettings}
              />
              <SettingItem 
                icon={<Mail className="text-gray-400" size={24} />}
                title="Email Notifications"
                description="Receive updates via email"
                setting="emailNotifications"
                settings={settings}
                setSettings={setSettings}
              />
            </section>

            <section className="mb-12">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">General Settings</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                  <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                  <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                    <option>UTC</option>
                    <option>EST</option>
                    <option>PST</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Default View</label>
                  <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                    <option>List</option>
                    <option>Board</option>
                    <option>Calendar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Default Sort</label>
                  <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                    <option>Due Date</option>
                    <option>Priority</option>
                    <option>Created Date</option>
                  </select>
                </div>
              </div>
            </section>
          
            <section className="mb-12">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Account</h2>
              <div className="space-y-4" onClick={() => setShowEditProfile(true)}>
                <button className="flex items-center text-blue-500 hover:text-blue-700">
                  <User className="mr-2" size={20}  />
                  Edit Profile
                </button>
                
              </div>
            </section>
            <UpdateUserModal isOpen={showEditProfile} onSubmit={handleSubmitEditProfile} onClose={() => setShowEditProfile(false)} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;