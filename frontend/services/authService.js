/**
 * Authentication Service
 * Handles user registration, login, and authentication-related API calls
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Register a new user
 * @param {Object} userData - { email, password, firstName, lastName }
 * @returns {Promise<Object>} Response containing token and user data
 */
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Registration failed: ${response.statusText}`);
    }

    // Store token in localStorage
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.user.id);
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Login a user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Response containing token and user data
 */
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Login failed: ${response.statusText}`);
    }

    // Store token in localStorage
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.user.id);
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Logout the current user
 * Clears all authentication data from localStorage
 */
export const logoutUser = () => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

/**
 * Get the stored authentication token
 * @returns {string|null} JWT token or null if not found
 */
export const getAuthToken = () => {
  try {
    return localStorage.getItem('token');
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

/**
 * Get the stored user ID
 * @returns {string|null} User ID or null if not found
 */
export const getUserId = () => {
  try {
    return localStorage.getItem('userId');
  } catch (error) {
    console.error('Error retrieving user ID:', error);
    return null;
  }
};

/**
 * Get the stored user object
 * @returns {Object|null} User object or null if not found
 */
export const getStoredUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error retrieving user:', error);
    return null;
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user is authenticated, false otherwise
 */
export const isAuthenticated = () => {
  try {
    const token = localStorage.getItem('token');
    return !!token;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const validateEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Object containing isValid and feedback
 */
export const validatePassword = (password) => {
  const feedback = {
    isValid: true,
    errors: [],
    strength: 'weak',
  };

  if (!password) {
    feedback.isValid = false;
    feedback.errors.push('Password is required');
    return feedback;
  }

  if (password.length < 6) {
    feedback.isValid = false;
    feedback.errors.push('Password must be at least 6 characters');
  }

  if (password.length < 12) {
    feedback.strength = 'fair';
  } else {
    feedback.strength = 'good';
  }

  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
    feedback.errors.push('Use both uppercase and lowercase letters');
  }

  if (!/\d/.test(password)) {
    feedback.errors.push('Include at least one number');
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    feedback.errors.push('Include at least one special character');
  }

  if (feedback.errors.length > 0) {
    feedback.isValid = false;
    feedback.strength = 'weak';
  }

  if (feedback.isValid && password.length >= 12) {
    feedback.strength = 'strong';
  }

  return feedback;
};

/**
 * Calculate password strength score (0-100)
 * @param {string} password - Password to score
 * @returns {number} Strength score from 0 to 100
 */
export const getPasswordStrengthScore = (password) => {
  let score = 0;

  if (!password) return 0;

  // Length scoring
  if (password.length >= 8) score += 10;
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;

  // Character variety scoring
  if (/[a-z]/.test(password)) score += 15;
  if (/[A-Z]/.test(password)) score += 15;
  if (/\d/.test(password)) score += 15;
  if (/[^A-Za-z0-9]/.test(password)) score += 15;

  // Bonus for good length + variety
  if (password.length >= 12 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password)) {
    score += 10;
  }

  return Math.min(score, 100);
};
