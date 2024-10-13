import {Menu, Search, Bell, User, ChevronDown} from 'lucide-react';
import { useUser } from '../../contexts/UserContext';

export default function Header({searchTasks}) {
    const {user} = useUser();
    return (
        <header className="bg-white shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <Menu className="mr-4 text-gray-500" />
            <h2 className="text-xl font-semibold">welcome {user?.username ? user?.username: 'guest'}, your tasks </h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                onChange={(e) => searchTasks(e.target.value)}
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
    );
}