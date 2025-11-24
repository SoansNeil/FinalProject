import React, { useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/apiService';
import styles from './RegisterForm.module.css';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register: registerUser, setAuthError } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Email validation regex
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const validateForm = useCallback(() => {
    const errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
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
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await authService.register(
        formData.email.trim(),
        formData.password,
        formData.firstName.trim(),
        formData.lastName.trim()
      );

  const { token, user } = response.data;

  // Register user in auth context
  registerUser(user, token);

      // Show success message
      setSuccessMessage('Account created successfully! Redirecting to dashboard...');

      // Redirect after 1.5 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      setAuthError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.header}>
          <h2>Create Account</h2>
          <p>Join Soccer Teams Mapper to track your favorite teams</p>
        </div>

        {error && <div className={styles.alert + ' ' + styles.error}>{error}</div>}
        {successMessage && (
          <div className={styles.alert + ' ' + styles.success}>{successMessage}</div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                disabled={loading}
                className={validationErrors.firstName ? styles.inputError : ''}
              />
              {validationErrors.firstName && (
                <span className={styles.errorMsg}>{validationErrors.firstName}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                disabled={loading}
                className={validationErrors.lastName ? styles.inputError : ''}
              />
              {validationErrors.lastName && (
                <span className={styles.errorMsg}>{validationErrors.lastName}</span>
              )}
            </div>
          </div>

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
              placeholder="Enter password (min 6 characters)"
              disabled={loading}
              className={validationErrors.password ? styles.inputError : ''}
            />
            {validationErrors.password && (
              <span className={styles.errorMsg}>{validationErrors.password}</span>
            )}
            <div className={styles.passwordHint}>
              Password must be at least 6 characters long
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              disabled={loading}
              className={validationErrors.confirmPassword ? styles.inputError : ''}
            />
            {validationErrors.confirmPassword && (
              <span className={styles.errorMsg}>{validationErrors.confirmPassword}</span>
            )}
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className={styles.footer}>
          <p>
            Already have an account?{' '}
            <Link to="/login" className={styles.link}>
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
