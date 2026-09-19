import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Attempt to restore session from localStorage on mount
    const storedUser = localStorage.getItem('cineprime_auth_session');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to restore session", e);
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await AuthService.login(credentials);
      setUser(response);
      localStorage.setItem('cineprime_auth_session', JSON.stringify(response));
      return response;
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    AuthService.logout().catch(console.error);
    setUser(null);
    localStorage.removeItem('cineprime_auth_session');
  };

  const isAuthenticated = () => {
    return !!user && !!user.token;
  };

  const hasRole = (role) => {
    return isAuthenticated() && user.roles && user.roles.includes(role);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated, hasRole }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
