import React, { useState, useCallback } from 'react';
import { useFavoriteTeams } from '../hooks/useFavoriteTeams';
import styles from './FavoriteTeams.module.css';

const FavoriteTeams = ({ userId, showFullList = false }) => {
  const { favoriteTeams, loading, error, addTeam, removeTeam } = useFavoriteTeams(userId);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ teamId: '', teamName: '' });
  const [formError, setFormError] = useState('');
  const [addingTeam, setAddingTeam] = useState(false);
  const [removingTeamId, setRemovingTeamId] = useState(null);

  const handleAddTeam = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.teamId.trim() || !formData.teamName.trim()) {
      setFormError('Both Team ID and Team Name are required');
      return;
    }

    setAddingTeam(true);
    try {
      await addTeam(formData.teamId.trim(), formData.teamName.trim());
      setFormData({ teamId: '', teamName: '' });
      setShowAddForm(false);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to add team');
    } finally {
      setAddingTeam(false);
    }
  };

  const handleRemoveTeam = useCallback(async (teamId) => {
    if (window.confirm('Are you sure you want to remove this team from favorites?')) {
      setRemovingTeamId(teamId);
      try {
        await removeTeam(teamId);
      } catch (err) {
        console.error('Error removing team:', err);
      } finally {
        setRemovingTeamId(null);
      }
    }
  }, [removeTeam]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Favorite Teams</h3>
        <button
          className={styles.addBtn}
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? '✕' : '+ Add Team'}
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {showAddForm && (
        <form onSubmit={handleAddTeam} className={styles.addForm}>
          {formError && <div className={styles.formError}>{formError}</div>}

          <div className={styles.formRow}>
            <input
              type="text"
              placeholder="Team ID"
              value={formData.teamId}
              onChange={(e) => setFormData({ ...formData, teamId: e.target.value })}
              disabled={addingTeam}
              className={styles.input}
            />
            <input
              type="text"
              placeholder="Team Name"
              value={formData.teamName}
              onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
              disabled={addingTeam}
              className={styles.input}
            />
          </div>

          <button
            type="submit"
            disabled={addingTeam}
            className={styles.submitBtn}
          >
            {addingTeam ? 'Adding...' : 'Add Team'}
          </button>
        </form>
      )}

      {loading ? (
        <div className={styles.loading}>Loading favorite teams...</div>
      ) : favoriteTeams.length === 0 ? (
        <div className={styles.empty}>
          <p>No favorite teams yet</p>
          <p className={styles.hint}>Add teams to keep track of your favorites</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {favoriteTeams.map((team) => (
            <div 
              key={team._id} 
              className={`${styles.teamCard} ${removingTeamId === team._id ? styles.removing : ''}`}
            >
              <div className={styles.teamInfo}>
                <h4 className={styles.teamName}>{team.teamName}</h4>
                <p className={styles.teamId}>ID: {team.teamId}</p>
                <p className={styles.addedDate}>
                  Added: {formatDate(team.addedAt)}
                </p>
              </div>
              <button
                className={styles.removeBtn}
                onClick={() => handleRemoveTeam(team._id)}
                title="Remove from favorites"
                disabled={removingTeamId === team._id}
              >
                {removingTeamId === team._id ? '⏳' : '✕'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoriteTeams;
