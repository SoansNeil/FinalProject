import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import styles from './HomePage.module.css';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>⚽ Soccer Teams Mapper</h1>
          <p>Track your favorite teams and discover new soccer clubs around the world</p>

          {!isAuthenticated && (
            <div className={styles.ctaButtons}>
              <Link to="/register" className={styles.primaryBtn}>
                Get Started
              </Link>
              <Link to="/login" className={styles.secondaryBtn}>
                Log In
              </Link>
            </div>
          )}

          {isAuthenticated && (
            <div className={styles.ctaButtons}>
              <Link to="/dashboard" className={styles.primaryBtn}>
                Go to Dashboard
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className={styles.features}>
        <h2>Why Use Soccer Teams Mapper?</h2>
        <div className={styles.featureGrid}>
          <div className={styles.feature}>
            <div className={styles.featureIcon}>⭐</div>
            <h3>Favorite Teams</h3>
            <p>Save and organize your favorite soccer teams in one place</p>
          </div>

          <div className={styles.feature}>
            <div className={styles.featureIcon}>📍</div>
            <h3>Explore Teams</h3>
            <p>Discover soccer teams from different regions and leagues</p>
          </div>

          <div className={styles.feature}>
            <div className={styles.featureIcon}>🔍</div>
            <h3>Search History</h3>
            <p>Keep track of teams you've searched for previously</p>
          </div>

          <div className={styles.feature}>
            <div className={styles.featureIcon}>🛡️</div>
            <h3>Secure Account</h3>
            <p>Your data is securely stored and protected</p>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <h2>Ready to Get Started?</h2>
        <p>Create an account today to start tracking your favorite teams</p>
        {!isAuthenticated && (
          <Link to="/register" className={styles.ctaBtn}>
            Create Account
          </Link>
        )}
      </section>
    </div>
  );
};

export default HomePage;
