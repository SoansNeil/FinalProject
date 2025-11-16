import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import SearchBar from './SearchBar';
import styles from './Header.module.css';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleHeaderTeamSelect = (team) => {
    navigate('/map', { state: { selectedTeamId: team.teamId } });
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <h1>⚽ Soccer Teams Mapper</h1>
        </Link>

        <div className={styles.searchContainer}>
          <SearchBar
            onTeamSelect={handleHeaderTeamSelect}
            placeholder="Search teams or leagues..."
          />
        </div>

        <nav className={styles.nav}>
          {isAuthenticated ? (
            <>
              <div className={styles.userInfo}>
                <span className={styles.userName}>
                  {user?.firstName} {user?.lastName}
                </span>
              </div>
              <Link to="/dashboard" className={styles.navLink}>
                Dashboard
              </Link>
              <Link to="/map" className={styles.navLink}>
                Map
              </Link>
              <Link to="/profile" className={styles.navLink}>
                Profile
              </Link>
              <Link to="/settings" className={styles.navLink}>
                Settings
              </Link>
              <button className={styles.logoutBtn} onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.navLink}>
                Login
              </Link>
              <Link to="/register" className={styles.navLink + ' ' + styles.registerBtn}>
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
