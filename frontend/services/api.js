/**
 * API Service for user preferences (favorites and recent searches)
 * This module provides functions to interact with the backend API
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Fetch favorite teams for the current user
 * @param {string} userId - MongoDB user ID
 * @returns {Promise<Array>} Array of favorite teams
 */
export const getFavoriteTeams = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/favorites`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch favorite teams: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching favorite teams:', error);
    throw error;
  }
};

/**
 * Add a team to user's favorites
 * @param {string} userId - MongoDB user ID
 * @param {string} teamId - Team ID
 * @param {string} teamName - Team name
 * @returns {Promise<Array>} Updated favorite teams list
 */
export const addFavoriteTeam = async (userId, teamId, teamName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ teamId, teamName }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to add favorite team: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error adding favorite team:', error);
    throw error;
  }
};

/**
 * Remove a team from user's favorites
 * @param {string} userId - MongoDB user ID
 * @param {string} teamId - Team ID to remove
 * @returns {Promise<Array>} Updated favorite teams list
 */
export const removeFavoriteTeam = async (userId, teamId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/favorites/${teamId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to remove favorite team: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error removing favorite team:', error);
    throw error;
  }
};

/**
 * Fetch recent searches for the current user
 * @param {string} userId - MongoDB user ID
 * @param {number} limit - Maximum number of searches to return (default: 10)
 * @returns {Promise<Array>} Array of recent searches
 */
export const getRecentSearches = async (userId, limit = 10) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/searches?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch recent searches: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching recent searches:', error);
    throw error;
  }
};

/**
 * Add a search to user's recent searches
 * @param {string} userId - MongoDB user ID
 * @param {string} query - Search query
 * @returns {Promise<Array>} Updated recent searches list
 */
export const addRecentSearch = async (userId, query) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/searches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to add search: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error adding recent search:', error);
    throw error;
  }
};

/**
 * Clear all recent searches for a user
 * @param {string} userId - MongoDB user ID
 * @returns {Promise<boolean>} Success status
 */
export const clearRecentSearches = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/searches`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to clear recent searches: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error clearing recent searches:', error);
    throw error;
  }
};

/**
 * Fetch all user preferences at once (favorites + recent searches)
 * @param {string} userId - MongoDB user ID
 * @returns {Promise<Object>} Object containing favoriteTeams and recentSearches
 */
export const getUserPreferences = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/preferences`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user preferences: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    throw error;
  }
};
