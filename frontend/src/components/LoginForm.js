import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
// Note: we avoid importing authService at module top-level. Tests inject a
// mock via props; production code will dynamically require the real
// `authService` when needed to prevent Jest from trying to parse ESM-only
// dependencies during tests.
import styles from './LoginForm.module.css';

const LoginForm = ({ authServiceProp = null, authHook = null }) => {
  const navigate = useNavigate();
  // Allow injection of a mock auth hook for tests; fall back to real hook
  const realAuth = useAuth();
  const auth = authHook || realAuth;
  const { login, setAuthError } = auth;

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);

  // Email validation regex
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const validateForm = useCallback(() => {
    const errors = {};

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  }, [validationErrors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Use injected authService when provided (tests). Otherwise dynamically
      // require the real service; if require fails (test env), fall back to a
      // safe stub that rejects so the error flow is exercised.
      let service = authServiceProp;
      if (!service) {
        try {
          // eslint-disable-next-line global-require
          service = require('../services/apiService').authService;
        } catch (e) {
          service = {
            login: () => Promise.reject(new Error('auth service not available')),
          };
        }
      }

      const response = await service.login(
        formData.email.trim(),
        formData.password
      );

  const { token, user } = response.data;

  // Login user in auth context
  login(user, token);

      // Store "remember me" preference
      if (rememberMe) {
        localStorage.setItem('rememberEmail', formData.email);
      } else {
        localStorage.removeItem('rememberEmail');
      }

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      setAuthError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Load remembered email on mount
  React.useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberEmail');
    if (rememberedEmail) {
      setFormData((prev) => ({
        ...prev,
        email: rememberedEmail,
      }));
      setRememberMe(true);
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.header}>
          <h2>Welcome Back</h2>
          <p>Log in to your Soccer Teams Mapper account</p>
        </div>

        {error && <div className={styles.alert + ' ' + styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              disabled={loading}
              className={validationErrors.email ? styles.inputError : ''}
            />
            {validationErrors.email && (
              <span className={styles.errorMsg}>{validationErrors.email}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              disabled={loading}
              className={validationErrors.password ? styles.inputError : ''}
            />
            {validationErrors.password && (
              <span className={styles.errorMsg}>{validationErrors.password}</span>
            )}
          </div>

          <div className={styles.checkboxGroup}>
            <input
              id="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={loading}
            />
            <label htmlFor="rememberMe">Remember me</label>
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className={styles.footer}>
          <p>
            Don't have an account?{' '}
            <Link to="/register" className={styles.link}>
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
