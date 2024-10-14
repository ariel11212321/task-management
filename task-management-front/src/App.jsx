import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Home from './components/Home/Home';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import Calendar from './components/Calendar';
import GroupPage from './components/GroupPage';
import GroupHome from './components/GroupPage/GroupHome';

function App() {
  return (
    <AuthProvider>
            <UserProvider>
    <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path ="/login" element={<Login/>}/>
          <Route path ="/signup" element={<SignUp/>}/>
          <Route path ="/home" element={<Home/>}/>
          <Route path ="/calendar" element={<Calendar/>}/>
          <Route path ="/groupTasks" element={<GroupPage/>}/>
          <Route path ="/groupHome" element={<GroupHome/>}/>
        </Routes>
    </Router>
    </UserProvider>
    </AuthProvider>
  );
}

export default App
