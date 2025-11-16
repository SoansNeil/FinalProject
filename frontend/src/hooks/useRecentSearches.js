import { useState, useEffect, useCallback } from 'react';
import { recentSearchesService } from '../services/apiService';

export const useRecentSearches = (userId) => {
  const [recentSearches, setRecentSearches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecentSearches = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await recentSearchesService.getRecentSearches(userId);
      setRecentSearches(response.data.data || []);
    } catch (err) {
      console.error('Error fetching recent searches:', err);
      setError(err.response?.data?.message || 'Failed to load recent searches');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchRecentSearches();
  }, [fetchRecentSearches]);

  const addSearch = useCallback(
    async (query) => {
      if (!userId) return;

      try {
        setError(null);
        const response = await recentSearchesService.addRecentSearch(userId, query);
        setRecentSearches(response.data.data || []);
        return response.data;
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to save search';
        setError(errorMessage);
        throw err;
      }
    },
    [userId]
  );

  const clearSearches = useCallback(async () => {
    if (!userId) return;

    try {
      setError(null);
      await recentSearchesService.clearRecentSearches(userId);
      setRecentSearches([]);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to clear searches';
      setError(errorMessage);
      throw err;
    }
  }, [userId]);

  return {
    recentSearches,
    loading,
    error,
    addSearch,
    clearSearches,
    refetch: fetchRecentSearches,
  };
};
