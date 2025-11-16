import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import * as authService from '../services/authService';

/**
 * LoginForm Component
 * Simple login form for existing users
 * Integrates with the backend API and useAuth hook
 */
const LoginForm = ({ onLoginSuccess, onLoginCancel, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const { login, error: authError, clearError } = useAuth();

  const validateEmail = () => {
    if (!email.trim()) {
      setFieldErrors((prev) => ({ ...prev, email: 'Email is required' }));
      return false;
    }
    if (!authService.validateEmail(email)) {
      setFieldErrors((prev) => ({ ...prev, email: 'Please enter a valid email address' }));
      return false;
    }
    setFieldErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.email;
      return newErrors;
    });
    return true;
  };

  const validatePassword = () => {
    if (!password) {
      setFieldErrors((prev) => ({ ...prev, password: 'Password is required' }));
      return false;
    }
    setFieldErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.password;
      return newErrors;
    });
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    clearError();

    if (!validateEmail() || !validatePassword()) {
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);

      // Show success message briefly before redirecting
      if (onLoginSuccess) {
        setTimeout(() => {
          onLoginSuccess();
        }, 500);
      }
    } catch (err) {
      setSubmitError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to access your account</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Global Error Message */}
          {(submitError || authError) && (
            <div className="error-banner" role="alert">
              <span className="error-icon">⚠</span>
              {submitError || authError}
            </div>
          )}

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={validateEmail}
              className={fieldErrors.email ? 'error' : ''}
              aria-describedby="emailError"
              disabled={isLoading}
            />
            {fieldErrors.email && (
              <div id="emailError" className="error" role="alert">
                {fieldErrors.email}
              </div>
            )}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <div className="password-input-wrapper">
              <input
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={validatePassword}
                className={fieldErrors.password ? 'error' : ''}
                aria-describedby="passwordError"
                disabled={isLoading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {fieldErrors.password && (
              <div id="passwordError" className="error" role="alert">
                {fieldErrors.password}
              </div>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="login-options">
            <div className="checkbox-group">
              <input id="rememberMe" type="checkbox" />
              <label htmlFor="rememberMe" className="checkbox-label">
                Remember me
              </label>
            </div>
            <a href="#forgot-password" className="forgot-password">
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn-login" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="signup-link">
          <p>
            Don't have an account?{' '}
            {onSwitchToSignup ? (
              <button type="button" onClick={onSwitchToSignup} className="link-button">
                Create one
              </button>
            ) : (
              <a href="/signup">Create one</a>
            )}
          </p>
        </div>

        {/* Cancel Button */}
        {onLoginCancel && (
          <button type="button" className="btn-cancel" onClick={onLoginCancel} disabled={isLoading}>
            Cancel
          </button>
        )}
      </div>

      {/* Styles */}
      <style jsx>{`
        .login-container {
          width: 100%;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px 16px;
          background: linear-gradient(180deg, #f7f9fc, #f5f7fb);
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          background: white;
          border-radius: 10px;
          box-shadow: 0 6px 30px rgba(11, 34, 68, 0.08);
          padding: 40px 32px;
        }

        .login-header {
          margin-bottom: 32px;
          text-align: center;
        }

        .login-title {
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 8px 0;
          color: #0f172a;
        }

        .login-subtitle {
          font-size: 14px;
          color: #6b7280;
          margin: 0;
        }

        form {
          display: grid;
          gap: 16px;
        }

        /* Error Banner */
        .error-banner {
          background: #fee2e2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 12px 14px;
          color: #991b1b;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 8px;
          animation: slideDown 0.2s ease;
        }

        .error-icon {
          font-size: 16px;
          flex-shrink: 0;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Form Groups */
        .form-group {
          display: grid;
          gap: 6px;
        }

        .form-group label {
          display: block;
          font-size: 13px;
          color: #0f172a;
          font-weight: 500;
        }

        .form-group input[type='text'],
        .form-group input[type='email'],
        .form-group input[type='password'] {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #e6e9ef;
          border-radius: 8px;
          font-size: 14px;
          background: #fff;
          transition: all 0.2s ease;
        }

        .form-group input:focus {
          outline: none;
          border-color: #0b63d6;
          box-shadow: 0 0 0 3px rgba(11, 99, 214, 0.1);
        }

        .form-group input.error {
          border-color: #ef4444;
        }

        .error {
          color: #b00020;
          font-size: 12px;
          margin: 0;
        }

        /* Password Input Wrapper */
        .password-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .password-input-wrapper input {
          padding-right: 40px;
        }

        .toggle-password {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Login Options */
        .login-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 8px;
        }

        .checkbox-group {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .checkbox-group input[type='checkbox'] {
          width: 16px;
          height: 16px;
          cursor: pointer;
        }

        .checkbox-label {
          font-size: 13px;
          color: #6b7280;
          cursor: pointer;
          margin: 0;
        }

        .forgot-password {
          font-size: 13px;
          color: #0b63d6;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .forgot-password:hover {
          color: #0950b0;
          text-decoration: underline;
        }

        /* Submit Button */
        .btn-login {
          padding: 10px 14px;
          background: #0b63d6;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 8px;
        }

        .btn-login:hover:not(:disabled) {
          background: #0950b0;
          box-shadow: 0 4px 12px rgba(11, 99, 214, 0.3);
        }

        .btn-login:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Sign Up Link */
        .signup-link {
          text-align: center;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
        }

        .signup-link p {
          font-size: 13px;
          color: #6b7280;
          margin: 0;
        }

        .link-button {
          background: none;
          border: none;
          color: #0b63d6;
          cursor: pointer;
          font-weight: 600;
          text-decoration: none;
          padding: 0;
          font-size: 13px;
        }

        .link-button:hover {
          text-decoration: underline;
        }

        .signup-link a {
          color: #0b63d6;
          text-decoration: none;
          font-weight: 600;
        }

        .signup-link a:hover {
          text-decoration: underline;
        }

        /* Cancel Button */
        .btn-cancel {
          width: 100%;
          padding: 10px 14px;
          background: white;
          border: 1px solid #e6e9ef;
          color: #0f172a;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 12px;
        }

        .btn-cancel:hover:not(:disabled) {
          border-color: #d1d5db;
          background: #f9fafb;
        }

        .btn-cancel:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Responsive */
        @media (max-width: 480px) {
          .login-card {
            padding: 32px 24px;
          }

          .login-title {
            font-size: 20px;
          }

          .login-options {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginForm;
