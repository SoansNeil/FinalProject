import { useState, useEffect, useCallback } from 'react';
import * as authService from '../services/authService';

/**
 * Custom hook to manage authentication state
 * Provides login, register, logout functions and auth state
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const storedToken = authService.getAuthToken();
    const storedUser = authService.getStoredUser();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
      setIsAuthenticated(true);
    }
  }, []);

  // Register a new user
  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.registerUser(userData);

      setUser(response.user);
      setToken(response.token);
      setIsAuthenticated(true);

      return response;
    } catch (err) {
      const errorMessage = err.message || 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Login a user
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.loginUser(email, password);

      setUser(response.user);
      setToken(response.token);
      setIsAuthenticated(true);

      return response;
    } catch (err) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout the current user
  const logout = useCallback(() => {
    authService.logoutUser();
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);

  // Clear error message
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    register,
    login,
    logout,
    clearError,
  };
};
