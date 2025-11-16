import React, { useState } from 'react';

/**
 * RecentSearches Component
 * Displays user's recent search history with options to view and clear
 * @param {Array} searches - Array of search objects with query and searchedAt timestamp
 * @param {Function} onClear - Callback when clearing search history
 * @param {Function} onSearchClick - Callback when clicking a search to re-run it
 * @param {boolean} loading - Loading state
 */
const RecentSearches = ({ searches = [], onClear, onSearchClick, loading = false }) => {
  const [isClearing, setIsClearing] = useState(false);

  const handleClear = async () => {
    if (!window.confirm('Are you sure you want to clear your search history?')) {
      return;
    }

    setIsClearing(true);
    try {
      await onClear();
    } finally {
      setIsClearing(false);
    }
  };

  const handleSearchClick = (query) => {
    if (onSearchClick) {
      onSearchClick(query);
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const searchDate = new Date(date);
    const seconds = Math.floor((now - searchDate) / 1000);

    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return searchDate.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="recent-searches-container">
        <h2 className="section-title">🔍 Recent Searches</h2>
        <div className="loading-skeleton">Loading your search history...</div>
      </div>
    );
  }

  return (
    <div className="recent-searches-container">
      <div className="header-row">
        <h2 className="section-title">🔍 Recent Searches</h2>
        {searches && searches.length > 0 && (
          <button
            className="btn-clear"
            onClick={handleClear}
            disabled={isClearing}
            title="Clear all search history"
            aria-label="Clear search history"
          >
            {isClearing ? 'Clearing...' : 'Clear History'}
          </button>
        )}
      </div>

      {searches && searches.length > 0 ? (
        <div className="searches-list">
          {searches.map((search, index) => (
            <button
              key={`${search.query}-${index}`}
              className="search-item"
              onClick={() => handleSearchClick(search.query)}
              title={`Search for "${search.query}"`}
            >
              <div className="search-content">
                <span className="search-query">{search.query}</span>
                <span className="search-time">{formatTimeAgo(search.searchedAt)}</span>
              </div>
              <span className="search-arrow">→</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No recent searches yet.</p>
          <p className="empty-hint">Start searching for teams to build your history!</p>
        </div>
      )}

      <style jsx>{`
        .recent-searches-container {
          margin: 24px 0;
          padding: 20px;
          background: #f9fafb;
          border-radius: 10px;
          border: 1px solid #e5e7eb;
        }

        .header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          margin: 0;
          color: #0f172a;
        }

        .btn-clear {
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 8px 12px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-clear:hover:not(:disabled) {
          background: #dc2626;
          box-shadow: 0 2px 6px rgba(239, 68, 68, 0.3);
        }

        .btn-clear:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .searches-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .search-item {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 12px 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .search-item:hover {
          background: #f3f4f6;
          border-color: #d1d5db;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
        }

        .search-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
          min-width: 0;
        }

        .search-query {
          font-size: 14px;
          font-weight: 500;
          color: #0b63d6;
          word-break: break-word;
        }

        .search-time {
          font-size: 12px;
          color: #9ca3af;
        }

        .search-arrow {
          color: #d1d5db;
          font-size: 14px;
          margin-left: 12px;
          transition: all 0.2s ease;
        }

        .search-item:hover .search-arrow {
          color: #0b63d6;
        }

        .loading-skeleton {
          padding: 16px;
          background: white;
          border-radius: 8px;
          color: #6b7280;
          font-size: 14px;
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }

        .empty-state {
          text-align: center;
          padding: 32px 16px;
          background: white;
          border-radius: 8px;
          color: #6b7280;
        }

        .empty-state p {
          margin: 8px 0;
          font-size: 14px;
        }

        .empty-hint {
          font-size: 12px;
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default RecentSearches;
