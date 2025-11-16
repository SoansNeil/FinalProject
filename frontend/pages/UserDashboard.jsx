import React, { useEffect } from 'react';
import { useUserPreferences } from '../hooks/useUserPreferences';
import FavoriteTeams from '../components/FavoriteTeams';
import RecentSearches from '../components/RecentSearches';

/**
 * UserDashboard Page
 * Example page demonstrating how to use FavoriteTeams and RecentSearches components
 * This page displays user's favorite teams and search history
 */
const UserDashboard = () => {
  // Get userId from URL params or context (example assumes it's in URL)
  const userId = new URLSearchParams(window.location.search).get('userId');

  const {
    favoriteTeams,
    recentSearches,
    loading,
    error,
    toggleFavoriteTeam,
    recordSearch,
    clearSearchHistory,
    isFavorited,
  } = useUserPreferences(userId);

  // Example: Track when user performs a search elsewhere in the app
  const handleSearchSubmit = async (searchQuery) => {
    try {
      await recordSearch(searchQuery);
      // Perform the actual search...
    } catch (err) {
      console.error('Failed to record search:', err);
    }
  };

  // Example: Handle adding/removing favorites from team cards
  const handleToggleFavorite = async (teamId, teamName) => {
    try {
      await toggleFavoriteTeam(teamId, teamName);
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  // Example: Re-search when clicking a recent search
  const handleSearchClick = (query) => {
    // Trigger search with the clicked query
    console.log('Re-searching for:', query);
    // Update your search input or filters here
  };

  if (!userId) {
    return (
      <div className="dashboard-error">
        <p>User ID not found. Please log in.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <p>Error loading preferences: {error}</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Your Dashboard</h1>
        <p className="subtitle">Manage your favorite teams and search history</p>
      </header>

      <main className="dashboard-content">
        {/* Favorite Teams Section */}
        <FavoriteTeams
          teams={favoriteTeams}
          onRemove={(teamId) => toggleFavoriteTeam(teamId)}
          loading={loading}
        />

        {/* Recent Searches Section */}
        <RecentSearches
          searches={recentSearches}
          onClear={clearSearchHistory}
          onSearchClick={handleSearchClick}
          loading={loading}
        />

        {/* Example: Team Card with Favorite Toggle Button */}
        <section className="example-section">
          <h2>📌 How to Use</h2>
          <div className="example-card">
            <div className="example-text">
              <h3>Adding Favorites</h3>
              <p>
                Click the star icon on any team card to add it to your favorites. Your favorite
                teams will appear in the section above and persist across sessions.
              </p>
            </div>
            <code className="example-code">
              {`await toggleFavoriteTeam(teamId, teamName);`}
            </code>
          </div>

          <div className="example-card">
            <div className="example-text">
              <h3>Recording Searches</h3>
              <p>
                Every time you search for a team, it's automatically recorded in your recent
                searches. You can click any recent search to quickly re-run it.
              </p>
            </div>
            <code className="example-code">
              {`await recordSearch(query);`}
            </code>
          </div>

          <div className="example-card">
            <div className="example-text">
              <h3>Clearing History</h3>
              <p>
                Use the "Clear History" button in the Recent Searches section to remove all your
                search history. This action cannot be undone.
              </p>
            </div>
            <code className="example-code">
              {`await clearSearchHistory();`}
            </code>
          </div>
        </section>
      </main>

      <style jsx>{`
        .dashboard-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 32px 16px;
          background: linear-gradient(180deg, #f7f9fc, #f5f7fb);
          min-height: 100vh;
        }

        .dashboard-header {
          margin-bottom: 32px;
          text-align: center;
        }

        .dashboard-header h1 {
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 8px 0;
          color: #0f172a;
        }

        .subtitle {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }

        .dashboard-content {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .dashboard-error {
          background: #fee2e2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 16px;
          color: #991b1b;
          text-align: center;
          margin-top: 32px;
        }

        .example-section {
          margin-top: 32px;
          padding-top: 32px;
          border-top: 1px solid #e5e7eb;
        }

        .example-section h2 {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 16px 0;
          color: #0f172a;
        }

        .example-card {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 12px;
          display: grid;
          grid-template-columns: 1fr 200px;
          gap: 16px;
          align-items: start;
        }

        @media (max-width: 768px) {
          .example-card {
            grid-template-columns: 1fr;
          }
        }

        .example-text h3 {
          font-size: 14px;
          font-weight: 600;
          margin: 0 0 6px 0;
          color: #0b63d6;
        }

        .example-text p {
          font-size: 12px;
          color: #6b7280;
          margin: 0;
          line-height: 1.5;
        }

        .example-code {
          background: #1f2937;
          color: #10b981;
          padding: 8px 12px;
          border-radius: 6px;
          font-family: 'Courier New', monospace;
          font-size: 11px;
          white-space: nowrap;
          overflow: auto;
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;
