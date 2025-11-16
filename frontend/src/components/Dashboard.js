import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import RecentSearches from './RecentSearches';
import FavoriteTeams from './FavoriteTeams';
import SearchBar from './SearchBar';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated || !user) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>You need to be logged in to access this page.</p>
        </div>
      </div>
    );
  }

  const handleTeamSelect = (team) => {
    navigate('/map');
  };

  return (
    <div className={styles.container}>
      <div className={styles.welcome}>
        <h2>Welcome, {user.firstName}! 👋</h2>
        <p>Manage your favorite teams and recent searches below</p>
      </div>

      <div className={styles.searchSection}>
        <SearchBar 
          onTeamSelect={handleTeamSelect}
          placeholder="Search for teams or leagues..."
        />
      </div>

      <div className={styles.content}>
        <div className={styles.mainSection}>
          <section className={styles.section}>
            <RecentSearches userId={user.id || user._id} />
          </section>

          <section className={styles.section}>
            <FavoriteTeams userId={user.id || user._id} />
          </section>
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.userCard}>
            <h3>Profile Information</h3>
            <div className={styles.infoRow}>
              <label>Name:</label>
              <span>{user.firstName} {user.lastName}</span>
            </div>
            <div className={styles.infoRow}>
              <label>Email:</label>
              <span>{user.email}</span>
            </div>
            {user.accountCreatedAt && (
              <div className={styles.infoRow}>
                <label>Member Since:</label>
                <span>
                  {new Date(user.accountCreatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            )}
            {user.lastLogin && (
              <div className={styles.infoRow}>
                <label>Last Login:</label>
                <span>
                  {new Date(user.lastLogin).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            )}
          </div>

          <div className={styles.statsCard}>
            <h3>Statistics</h3>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Account Status:</span>
              <span className={styles.statValue + ' ' + styles.active}>Active</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
