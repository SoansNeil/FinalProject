import React from 'react';
import { useAuth } from '../context/AuthContext';
import FavoriteTeams from '../components/FavoriteTeams';
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.profileSection}>
        <div className={styles.profileHeader}>
          <div className={styles.profileAvatar}>
            {user.firstName?.charAt(0).toUpperCase()}{user.lastName?.charAt(0).toUpperCase()}
          </div>
          <div className={styles.profileInfo}>
            <h1 className={styles.profileName}>
              {user.firstName} {user.lastName}
            </h1>
            <p className={styles.profileEmail}>{user.email}</p>
            <div className={styles.profileStats}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Member Since</span>
                <span className={styles.statValue}>{formatDate(user.createdAt)}</span>
              </div>
              {user.lastLogin && (
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Last Login</span>
                  <span className={styles.statValue}>{formatDate(user.lastLogin)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.favoriteTeamsSection}>
          <FavoriteTeams userId={user._id} showFullList={true} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
