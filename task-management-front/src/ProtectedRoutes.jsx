const { Navigate, Outlet } = require("react-router-dom");
const { useAuth } = require("./contexts/AuthContext");


const ProtectedRoutes = () => {
    const { isAuthenticated } = useAuth();
    
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
  
    return <Outlet />;
  };

  export default ProtectedRoutes;