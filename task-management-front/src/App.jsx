import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Home from './components/Home/Home';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';


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
        </Routes>
    </Router>
    </UserProvider>
    </AuthProvider>
  );
}

export default App
