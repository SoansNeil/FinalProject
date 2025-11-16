import { useState, useEffect, useCallback } from 'react';
import * as userApi from '../services/api';

/**
 * Custom hook to manage user preferences (favorites and recent searches)
 * @param {string} userId - MongoDB user ID
 * @returns {Object} Contains state and functions for managing preferences
 */
export const useUserPreferences = (userId) => {
  const [favoriteTeams, setFavoriteTeams] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user preferences on component mount or when userId changes
  useEffect(() => {
    if (!userId) return;

    const loadPreferences = async () => {
      setLoading(true);
      setError(null);
      try {
        const preferences = await userApi.getUserPreferences(userId);
        setFavoriteTeams(preferences.favoriteTeams || []);
        setRecentSearches(preferences.recentSearches || []);
      } catch (err) {
        setError(err.message);
        console.error('Error loading preferences:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [userId]);

  // Add a team to favorites
  const toggleFavoriteTeam = useCallback(
    async (teamId, teamName) => {
      if (!userId) return;

      try {
        const isCurrentlyFavorited = favoriteTeams.some((team) => team.teamId === teamId);

        if (isCurrentlyFavorited) {
          // Remove from favorites
          const updated = await userApi.removeFavoriteTeam(userId, teamId);
          setFavoriteTeams(updated);
        } else {
          // Add to favorites
          const updated = await userApi.addFavoriteTeam(userId, teamId, teamName);
          setFavoriteTeams(updated);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error toggling favorite team:', err);
      }
    },
    [userId, favoriteTeams]
  );

  // Record a search in recent searches
  const recordSearch = useCallback(
    async (query) => {
      if (!userId || !query) return;

      try {
        const updated = await userApi.addRecentSearch(userId, query);
        setRecentSearches(updated);
      } catch (err) {
        setError(err.message);
        console.error('Error recording search:', err);
      }
    },
    [userId]
  );

  // Clear all recent searches
  const clearSearchHistory = useCallback(async () => {
    if (!userId) return;

    try {
      await userApi.clearRecentSearches(userId);
      setRecentSearches([]);
    } catch (err) {
      setError(err.message);
      console.error('Error clearing search history:', err);
    }
  }, [userId]);

  // Check if a team is favorited
  const isFavorited = useCallback(
    (teamId) => {
      return favoriteTeams.some((team) => team.teamId === teamId);
    },
    [favoriteTeams]
  );

  return {
    favoriteTeams,
    recentSearches,
    loading,
    error,
    toggleFavoriteTeam,
    recordSearch,
    clearSearchHistory,
    isFavorited,
  };
};
