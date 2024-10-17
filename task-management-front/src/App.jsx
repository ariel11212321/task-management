import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Home from './components/Home/Home';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import Calendar from './components/Calendar';
import GroupPage from './components/GroupPage';
import GroupHome from './components/GroupPage/GroupHome';
import ProtectedRoutes from './ProtectedRoutes';
import Settings from './components/Settings';
import Dashboard from './components/Dashboard';

const queryClient = new QueryClient();


function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <UserProvider>
    <AuthProvider>
    <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path ="/login" element={<Login/>}/>
          <Route path ="/signup" element={<SignUp/>}/>

          <Route element={<ProtectedRoutes/>}>
          <Route path ="/home" element={<Home/>}/>
          <Route path ="/calendar" element={<Calendar/>}/>
          <Route path ="/groupTasks" element={<GroupPage/>}/>
          <Route path ="/groupHome" element={<GroupHome/>}/>
          <Route path ="/dashboard" element={<Dashboard/>}/>
          <Route path ="/settings" element={<Settings/>} />
          </Route>
        </Routes>
    </Router>
    </AuthProvider>
    </UserProvider>
      <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
  );
}

export default App;
