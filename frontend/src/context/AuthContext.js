import React, { createContext, useState, useCallback, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load token from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error loading user data:', err);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback((userData, authToken) => {
  setUser(userData);
  setError(null);
  localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  const register = useCallback((userData, authToken) => {
  setUser(userData);
  setError(null);
  localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
  setUser(null);
  setError(null);
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
  loading,
  error,
  login,
  register,
  logout,
  updateUser,
  setAuthError,
  clearError,
  isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
