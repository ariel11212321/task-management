import {useNavigate} from 'react-router-dom';

export default function SideBar() {
    const navigate = useNavigate();
    const gotoPage = (page) => {
        navigate(page);
    }

    return (
        <div className="w-64 bg-indigo-800 text-white p-4">
          <div className="flex items-center mb-8">
            <div className="w-8 h-8 bg-white rounded-md mr-2"></div>
            <h1 className="text-xl font-bold">Your Workspace</h1>
          </div>
          <nav>
            <ul className="space-y-2">
              <li onClick={() => gotoPage("/sidebar")} className="p-2 hover:bg-indigo-700 rounded-md cursor-pointer">Dashboard</li>
              <li onClick={() => gotoPage("/groupTasks")} className="p-2 hover:bg-indigo-700 rounded-md cursor-pointer">group tasks</li>
              <li onClick={() => gotoPage("/settings")} className="p-2 hover:bg-indigo-700 rounded-md cursor-pointer">Settings</li>
              <li onClick={() => gotoPage("/calendar")} className="p-2 hover:bg-indigo-700 rounded-md cursor-pointer">Calendar</li>
            </ul>
          </nav>
        </div>
    );
}