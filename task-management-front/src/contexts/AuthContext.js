import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useUser } from './UserContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState(() => {
        return Cookies.get('token') || '';
    });

    const { user, setUser } = useUser();

    useEffect(() => {
        if (token && user) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, [token, user]);

    const login = (newToken) => {
        setToken(newToken);
        Cookies.set('token', newToken, { 
            expires: 7, 
            secure: true, 
            sameSite: 'strict' 
        });
        setIsAuthenticated(true);
    };

    const logout = () => {
        setToken('');
        setUser(null);
        Cookies.remove('token');
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};