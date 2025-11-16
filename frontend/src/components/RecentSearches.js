import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecentSearches } from '../hooks/useRecentSearches';
import styles from './RecentSearches.module.css';

const RecentSearches = ({ userId }) => {
  const navigate = useNavigate();
  const { recentSearches, loading, error, clearSearches } = useRecentSearches(userId);

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear all recent searches?')) {
      try {
        await clearSearches();
      } catch (err) {
        console.error('Error clearing searches:', err);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Recent Searches</h3>
        {recentSearches.length > 0 && (
          <button
            className={styles.clearBtn}
            onClick={handleClearAll}
            title="Clear all recent searches"
          >
            Clear All
          </button>
        )}
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {loading ? (
        <div className={styles.loading}>Loading recent searches...</div>
      ) : recentSearches.length === 0 ? (
        <div className={styles.empty}>
          <p>No recent searches yet</p>
          <p className={styles.hint}>Your search history will appear here</p>
        </div>
      ) : (
        <ul className={styles.list}>
          {recentSearches.map((search) => (
            <li key={search._id} className={styles.item}>
              <div className={styles.searchContent}>
                <span className={styles.query}>{search.query}</span>
                <span className={styles.date}>{formatDate(search.searchedAt)}</span>
              </div>
              <button
                className={styles.searchAgainBtn}
                onClick={() => {
                  // Navigate to search results page with the query
                  navigate(`/search/${encodeURIComponent(search.query)}`);
                }}
                title="View search results"
              >
                🔍
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentSearches;
