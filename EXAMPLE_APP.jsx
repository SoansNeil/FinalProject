import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';

/**
 * EXAMPLE: App.jsx - Complete app structure with authentication
 * This shows how to integrate SignupForm, LoginForm, and useAuth hook
 * 
 * Copy this structure into your main App.jsx file
 */

/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

/**
 * Homepage - Initial landing page
 */
function Homepage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    return (
      <div className="home-container">
        <h1>Welcome, {user.firstName}! 👋</h1>
        <p>You're logged in and ready to explore.</p>
        <div className="button-group">
          <button onClick={() => navigate('/dashboard')} className="btn-primary">
            Go to Dashboard
          </button>
          <button onClick={() => navigate('/logout')} className="btn-secondary">
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <h1>Soccer Teams Map 🗺️</h1>
      <p>Explore soccer teams around the world and build your favorites list.</p>
      <div className="button-group">
        <button onClick={() => navigate('/signup')} className="btn-primary">
          Create Account
        </button>
        <button onClick={() => navigate('/login')} className="btn-secondary">
          Sign In
        </button>
      </div>
    </div>
  );
}

/**
 * Signup Page
 */
function SignupPage() {
  const navigate = useNavigate();

  return (
    <SignupForm
      onSignupSuccess={() => {
        // After successful signup, redirect to dashboard
        navigate('/dashboard', { replace: true });
      }}
      onSignupCancel={() => {
        navigate('/', { replace: true });
      }}
    />
  );
}

/**
 * Login Page
 */
function LoginPage() {
  const navigate = useNavigate();

  return (
    <LoginForm
      onLoginSuccess={() => {
        // After successful login, redirect to dashboard
        navigate('/dashboard', { replace: true });
      }}
      onLoginCancel={() => {
        navigate('/', { replace: true });
      }}
      onSwitchToSignup={() => {
        navigate('/signup', { replace: true });
      }}
    />
  );
}

/**
 * Dashboard - Protected page (requires login)
 * This is where logged-in users go
 */
function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user.firstName} {user.lastName}</span>
          <span className="email">({user.email})</span>
        </div>
      </header>

      <main className="dashboard-content">
        <section className="dashboard-section">
          <h2>Quick Links</h2>
          <div className="link-grid">
            <a href="/explore" className="link-card">
              <span className="icon">🗺️</span>
              <span className="title">Explore Teams</span>
            </a>
            <a href="/favorites" className="link-card">
              <span className="icon">⭐</span>
              <span className="title">My Favorites</span>
            </a>
            <a href="/profile" className="link-card">
              <span className="icon">👤</span>
              <span className="title">Profile</span>
            </a>
            <a href="/settings" className="link-card">
              <span className="icon">⚙️</span>
              <span className="title">Settings</span>
            </a>
          </div>
        </section>

        <section className="dashboard-section">
          <h2>Account Info</h2>
          <div className="info-card">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
            <p><strong>User ID:</strong> {user.id}</p>
          </div>
        </section>

        <button onClick={logout} className="btn-logout">
          Logout
        </button>
      </main>

      <style jsx>{`
        .dashboard-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 16px;
          min-height: 100vh;
        }

        .dashboard-header {
          margin-bottom: 32px;
        }

        .dashboard-header h1 {
          font-size: 28px;
          margin: 0 0 8px 0;
        }

        .user-info {
          font-size: 14px;
          color: #6b7280;
        }

        .email {
          display: block;
          font-size: 12px;
          margin-top: 4px;
        }

        .dashboard-content {
          display: grid;
          gap: 32px;
        }

        .dashboard-section {
          background: white;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .dashboard-section h2 {
          margin: 0 0 16px 0;
          font-size: 18px;
        }

        .link-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 16px;
        }

        .link-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 20px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          text-decoration: none;
          color: #0f172a;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .link-card:hover {
          border-color: #0b63d6;
          box-shadow: 0 4px 12px rgba(11, 99, 214, 0.2);
          transform: translateY(-2px);
        }

        .icon {
          font-size: 32px;
        }

        .title {
          font-weight: 600;
          font-size: 13px;
        }

        .info-card {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
        }

        .info-card p {
          margin: 8px 0;
          font-size: 13px;
        }

        .btn-logout {
          padding: 10px 20px;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 16px;
        }

        .btn-logout:hover {
          background: #dc2626;
        }
      `}</style>
    </div>
  );
}

/**
 * Logout page - Just a redirect
 */
function LogoutPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  React.useEffect(() => {
    logout();
    navigate('/', { replace: true });
  }, [logout, navigate]);

  return null;
}

/**
 * Main App Component
 * Sets up all routes and uses Router
 */
function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<LogoutPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Styles */}
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html, body {
          font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          background: #f5f7fb;
          color: #0f172a;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          gap: 16px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e5e7eb;
          border-top-color: #0b63d6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .home-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 64px 32px;
          text-align: center;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .home-container h1 {
          font-size: 36px;
          margin-bottom: 16px;
        }

        .home-container p {
          font-size: 16px;
          color: #6b7280;
          margin-bottom: 32px;
        }

        .button-group {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-primary {
          padding: 12px 24px;
          background: #0b63d6;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-primary:hover {
          background: #0950b0;
          box-shadow: 0 4px 12px rgba(11, 99, 214, 0.3);
        }

        .btn-secondary {
          padding: 12px 24px;
          background: white;
          color: #0f172a;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-secondary:hover {
          border-color: #0b63d6;
          color: #0b63d6;
        }
      `}</style>
    </Router>
  );
}

export default App;
