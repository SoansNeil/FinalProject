import React, { createContext, useState, useCallback, useEffect } from 'react';
import { useContext } from "react";
export const AuthContext = createContext();
export const useAuth = () => {
  return useContext(AuthContext);
};
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error loading user data:', err);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback((userData, authToken) => {
  setUser(userData);
  setToken(authToken);
  setError(null);
  localStorage.setItem('authToken', authToken);
  localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  const register = useCallback((userData, authToken) => {
  setUser(userData);
  setToken(authToken);
  setError(null);
  localStorage.setItem('authToken', authToken);
  localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
  setUser(null);
  setToken(null);
  setError(null);
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  }, []);

  const updateUser = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  const setAuthError = useCallback((errorMessage) => {
    setError(errorMessage);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
  user,
  token,
  loading,
  error,
  login,
  register,
  logout,
  updateUser,
  setAuthError,
  clearError,
  isAuthenticated: !!token && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
