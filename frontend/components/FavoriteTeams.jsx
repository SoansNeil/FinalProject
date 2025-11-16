import React, { useState } from 'react';

/**
 * FavoriteTeams Component
 * Displays user's favorite teams with options to remove them
 * @param {Array} teams - Array of favorite team objects
 * @param {Function} onRemove - Callback when removing a team from favorites
 * @param {boolean} loading - Loading state
 */
const FavoriteTeams = ({ teams = [], onRemove, loading = false }) => {
  const [removingTeamId, setRemovingTeamId] = useState(null);

  const handleRemove = async (teamId) => {
    setRemovingTeamId(teamId);
    try {
      await onRemove(teamId);
    } finally {
      setRemovingTeamId(null);
    }
  };

  if (loading) {
    return (
      <div className="favorite-teams-container">
        <h2 className="section-title">⭐ Favorite Teams</h2>
        <div className="loading-skeleton">Loading your favorites...</div>
      </div>
    );
  }

  return (
    <div className="favorite-teams-container">
      <h2 className="section-title">⭐ Favorite Teams</h2>
      
      {teams && teams.length > 0 ? (
        <div className="teams-grid">
          {teams.map((team) => (
            <div key={team.teamId} className="team-card">
              <div className="team-info">
                <h3 className="team-name">{team.teamName}</h3>
                <p className="team-meta">
                  Added {new Date(team.addedAt).toLocaleDateString()}
                </p>
              </div>
              <button
                className="btn-remove"
                onClick={() => handleRemove(team.teamId)}
                disabled={removingTeamId === team.teamId}
                title="Remove from favorites"
                aria-label={`Remove ${team.teamName} from favorites`}
              >
                {removingTeamId === team.teamId ? '...' : '✕'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>You haven't added any favorite teams yet.</p>
          <p className="empty-hint">Search for a team and add it to get started!</p>
        </div>
      )}

      <style jsx>{`
        .favorite-teams-container {
          margin: 24px 0;
          padding: 20px;
          background: #f9fafb;
          border-radius: 10px;
          border: 1px solid #e5e7eb;
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 16px 0;
          color: #0f172a;
        }

        .teams-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 12px;
          margin-bottom: 16px;
        }

        .team-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 12px;
          display: flex;
          justify-content: space-between;
          align-items: start;
          transition: all 0.2s ease;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .team-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border-color: #d1d5db;
        }

        .team-info {
          flex: 1;
          min-width: 0;
        }

        .team-name {
          margin: 0 0 4px 0;
          font-size: 14px;
          font-weight: 600;
          color: #0f172a;
          word-break: break-word;
        }

        .team-meta {
          margin: 0;
          font-size: 12px;
          color: #6b7280;
        }

        .btn-remove {
          background: none;
          border: none;
          color: #ef4444;
          cursor: pointer;
          font-size: 18px;
          padding: 4px 8px;
          margin-left: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          border-radius: 4px;
        }

        .btn-remove:hover:not(:disabled) {
          background: #fee2e2;
          color: #dc2626;
        }

        .btn-remove:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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

export default FavoriteTeams;
