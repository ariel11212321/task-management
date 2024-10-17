import React, { useMemo, Suspense } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Calendar, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import useTasks from '../../hooks/useTasks';
import SideBar from '../SideBar';
import Header from '../Header';
const COLORS = {
  completed: '#4CAF50',
  'in progress': '#2196F3',
  pending: '#FFC107',
  low: '#8BC34A',
  medium: '#FF9800',
  high: '#F44336'
};

const priorityOrder = ['low', 'medium', 'high'];
const statusOrder = ['pending', 'in progress', 'completed'];

const Dashboard = () => {
  const { tasks, isLoading, error } = useTasks();

  const taskStats = useMemo(() => {
    if (!Array.isArray(tasks)) {
      return {
        total: 0,
        status: {},
        priority: {},
        overdue: 0,
        completedOnTime: 0
      };
    }

    const stats = {
      total: tasks.length,
      status: {},
      priority: {},
      overdue: 0,
      completedOnTime: 0
    };

    const now = new Date();

    tasks.forEach(task => {
      stats.status[task.status] = (stats.status[task.status] || 0) + 1;
      stats.priority[task.priority] = (stats.priority[task.priority] || 0) + 1;
      const dueDate = new Date(task.dueDate);
      if (task.status === 'completed') {
        if (new Date(task.updatedAt) <= dueDate) {
          stats.completedOnTime++;
        }
      } else if (dueDate < now) {
        stats.overdue++;
      }
    });

    return stats;
  }, [tasks]);

  const statusData = statusOrder.map(status => ({
    name: status,
    value: taskStats.status[status] || 0
  }));

  const priorityData = priorityOrder.map(priority => ({
    name: priority,
    value: taskStats.priority[priority] || 0
  }));

  const taskTrendData = useMemo(() => {
    if (!Array.isArray(tasks)) {
      return [];
    }

    const trendMap = tasks.reduce((acc, task) => {
      const date = new Date(task.createdAt).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(trendMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [tasks]);

  if (isLoading) {
    return <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">Loading...</div>;
  }

  if (error) {
    return <div className="mt-8 p-6 bg-white rounded-lg shadow-lg text-red-500">Error: {error.message}</div>;
  }

  if (!Array.isArray(tasks) || tasks.length === 0) {
    return <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">No tasks available.</div>;
  }

  
const Bar3D = ({ position, height, color }) => {
    return (
      <mesh position={position}>
        <boxGeometry args={[0.5, height, 0.5]} />
        <meshStandardMaterial color={color} />
      </mesh>
    );
  };
  
  const Graph3D = ({ data }) => {
    return (
      <Canvas camera={{ position: [0, 5, 10], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={null}>
          {data.map((item, index) => (
            <Bar3D
              key={item.name}
              position={[index * 2 - 2, item.value / 2, 0]}
              height={item.value}
              color={COLORS[item.name]}
            />
          ))}
        </Suspense>
        <OrbitControls />
      </Canvas>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Task Dashboard</h2>
  
            {/* Task Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-100 p-4 rounded-lg flex items-center">
                <Calendar className="text-blue-500 mr-3" size={24} />
                <div>
                  <p className="text-sm text-blue-500">Total Tasks</p>
                  <p className="text-2xl font-bold">{taskStats.total}</p>
                </div>
              </div>
              <div className="bg-green-100 p-4 rounded-lg flex items-center">
                <CheckCircle className="text-green-500 mr-3" size={24} />
                <div>
                  <p className="text-sm text-green-500">Completed</p>
                  <p className="text-2xl font-bold">{taskStats.status.completed || 0}</p>
                </div>
              </div>
              <div className="bg-yellow-100 p-4 rounded-lg flex items-center">
                <Clock className="text-yellow-500 mr-3" size={24} />
                <div>
                  <p className="text-sm text-yellow-500">In Progress</p>
                  <p className="text-2xl font-bold">{taskStats.status['in progress'] || 0}</p>
                </div>
              </div>
              <div className="bg-red-100 p-4 rounded-lg flex items-center">
                <AlertTriangle className="text-red-500 mr-3" size={24} />
                <div>
                  <p className="text-sm text-red-500">Overdue</p>
                  <p className="text-2xl font-bold">{taskStats.overdue}</p>
                </div>
              </div>
            </div>
  
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status Distribution */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Task Status Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
  
              {/* Priority Distribution */}
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Task Priority Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={priorityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8">
                      {priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
  
              {/* 3D Priority Graph */}
              <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
                <h3 className="text-lg font-semibold mb-2">3D Task Priority Visualization</h3>
                <div style={{ height: '400px' }}>
                  <Graph3D data={priorityData} />
                </div>
              </div>
  
              {/* Task Creation Trend */}
              <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
                <h3 className="text-lg font-semibold mb-2">Task Creation Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={taskTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;