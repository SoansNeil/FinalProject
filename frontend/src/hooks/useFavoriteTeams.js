import { useState, useEffect, useCallback } from 'react';
import { favoriteTeamsService } from '../services/apiService';

export const useFavoriteTeams = (userId) => {
  const [favoriteTeams, setFavoriteTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFavoriteTeams = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await favoriteTeamsService.getFavoriteTeams(userId);
      setFavoriteTeams(response.data.data || []);
    } catch (err) {
      console.error('Error fetching favorite teams:', err);
      setError(err.response?.data?.message || 'Failed to load favorite teams');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchFavoriteTeams();
  }, [fetchFavoriteTeams]);

  const addTeam = useCallback(
    async (teamId, teamName) => {
      if (!userId) return;

      try {
        setError(null);
        const response = await favoriteTeamsService.addFavoriteTeam(userId, teamId, teamName);
        setFavoriteTeams(response.data.data || []);
        return response.data;
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to add team';
        setError(errorMessage);
        throw err;
      }
    },
    [userId]
  );

  const removeTeam = useCallback(
    async (teamId) => {
      if (!userId) return;

      try {
        setError(null);
        const response = await favoriteTeamsService.removeFavoriteTeam(userId, teamId);
        setFavoriteTeams(response.data.data || []);
        return response.data;
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to remove team';
        setError(errorMessage);
        throw err;
      }
    },
    [userId]
  );

  return {
    favoriteTeams,
    loading,
    error,
    addTeam,
    removeTeam,
    refetch: fetchFavoriteTeams,
  };
};
