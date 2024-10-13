import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Home from './components/Home/Home';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import Calendar from './components/Calendar';


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
        </Routes>
    </Router>
    </UserProvider>
    </AuthProvider>
  );
}

export default App
