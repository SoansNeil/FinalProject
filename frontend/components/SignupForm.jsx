import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import * as authService from '../services/authService';

/**
 * SignupForm Component
 * Multi-step account creation form (Account -> Profile -> Confirm)
 * Integrates with the wireframe design and backend API
 */
const SignupForm = ({ onSignupSuccess, onSignupCancel }) => {
  // Form step tracking (1: Account, 2: Profile, 3: Confirm)
  const [currentStep, setCurrentStep] = useState(1);
  const { register, loading, error: authError, clearError } = useAuth();

  // Step 1: Account Details
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Step 2: Profile Details
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // Step 3: Confirmation
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [agreeToPrivacy, setAgreeToPrivacy] = useState(false);

  // Error tracking
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Update password strength meter
  useEffect(() => {
    const strength = authService.getPasswordStrengthScore(password);
    setPasswordStrength(strength);
  }, [password]);

  // Clear error when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  /**
   * Validate email
   */
  const validateEmailField = () => {
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

  /**
   * Validate passwords
   */
  const validatePasswordFields = () => {
    const errors = {};

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors((prev) => ({ ...prev, ...errors }));
      return false;
    }

    setFieldErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.password;
      delete newErrors.confirmPassword;
      return newErrors;
    });
    return true;
  };

  /**
   * Validate profile fields
   */
  const validateProfileFields = () => {
    const errors = {};

    if (!firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors((prev) => ({ ...prev, ...errors }));
      return false;
    }

    setFieldErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.firstName;
      delete newErrors.lastName;
      return newErrors;
    });
    return true;
  };

  /**
   * Handle proceeding to next step
   */
  const handleStepNext = async () => {
    setSubmitError(null);

    if (currentStep === 1) {
      // Validate account details
      if (!validateEmailField() || !validatePasswordFields()) {
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Validate profile details
      if (!validateProfileFields()) {
        return;
      }
      setCurrentStep(3);
    }
  };

  /**
   * Handle going back to previous step
   */
  const handleStepBack = () => {
    setSubmitError(null);
    setFieldErrors({});
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  /**
   * Handle form submission (final step)
   */
  const handleSubmit = async () => {
    setSubmitError(null);

    // Validate confirmation checkboxes
    if (!agreeToTerms || !agreeToPrivacy) {
      setSubmitError('You must agree to the Terms of Service and Privacy Policy');
      return;
    }

    try {
      // Call register function from useAuth hook
      const userData = {
        email: email.toLowerCase(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      };

      await register(userData);

      setSubmitSuccess(true);

      // Call success callback if provided
      if (onSignupSuccess) {
        setTimeout(() => {
          onSignupSuccess();
        }, 1500);
      }
    } catch (err) {
      setSubmitError(err.message || 'Failed to create account. Please try again.');
    }
  };

  // Show success message
  if (submitSuccess) {
    return (
      <div className="signup-container">
        <div className="success-message">
          <div className="success-icon">✓</div>
          <h2>Account Created Successfully!</h2>
          <p>Welcome, {firstName}! Your account has been set up.</p>
          <p className="redirect-message">Redirecting to dashboard...</p>
        </div>

        <style jsx>{`
          .signup-container {
            width: 100%;
            max-width: 920px;
            margin: 0 auto;
          }

          .success-message {
            background: linear-gradient(180deg, #f7f9fc, #f5f7fb);
            border-radius: 10px;
            padding: 60px 32px;
            text-align: center;
            box-shadow: 0 6px 30px rgba(11, 34, 68, 0.08);
          }

          .success-icon {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: #047857;
            color: white;
            font-size: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 24px;
          }

          .success-message h2 {
            font-size: 24px;
            color: #0f172a;
            margin: 0 0 12px;
          }

          .success-message p {
            font-size: 14px;
            color: #6b7280;
            margin: 8px 0;
          }

          .redirect-message {
            font-size: 12px;
            font-style: italic;
            color: #0b63d6;
            margin-top: 16px;
          }
        `}</style>
      </div>
    );
  }

  const progressWidth = (currentStep / 3) * 100;

  return (
    <div className="signup-container">
      <div className="signup-grid">
        {/* Sidebar */}
        <aside className="signup-sidebar" aria-label="Progress and tips">
          <div className="brand">Soccer Teams Map</div>
          <div className="lead">Create your account — we'll guide you through a quick setup that stays secure and accessible.</div>

          {/* Stepper */}
          <ol className="steps" aria-label="Account creation steps">
            <li className={`step ${currentStep === 1 ? 'active' : ''}`} aria-current={currentStep === 1 ? 'step' : undefined}>
              <div className="index">1</div>
              <div>
                <div className="step-title">Account</div>
                <div className="step-meta">Email, password, security</div>
              </div>
            </li>
            <li className={`step ${currentStep === 2 ? 'active' : ''}`} aria-current={currentStep === 2 ? 'step' : undefined}>
              <div className="index">2</div>
              <div>
                <div className="step-title">Profile</div>
                <div className="step-meta">Name, preferences</div>
              </div>
            </li>
            <li className={`step ${currentStep === 3 ? 'active' : ''}`} aria-current={currentStep === 3 ? 'step' : undefined}>
              <div className="index">3</div>
              <div>
                <div className="step-title">Confirm</div>
                <div className="step-meta">Verify and finish</div>
              </div>
            </li>
          </ol>

          {/* Progress Bar */}
          <div className="progresswrap">
            <div className="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.round(progressWidth)}>
              <div style={{ width: `${progressWidth}%` }}></div>
            </div>
          </div>

          <p className="help">Tip: Use a strong, unique password and enable 2-factor authentication after signup for better security.</p>
        </aside>

        {/* Main Form Area */}
        <main className="signup-panel">
          <h1 id="signup-title">Create an account</h1>
          <p className="subtitle">Step {currentStep} of 3: {currentStep === 1 ? 'Account details' : currentStep === 2 ? 'Profile information' : 'Confirmation'}</p>

          <form id="signupForm" novalidate>
            {/* Global Error Message */}
            {submitError && (
              <div className="error-banner" role="alert">
                <span className="error-icon">⚠</span>
                {submitError}
              </div>
            )}

            {authError && (
              <div className="error-banner" role="alert">
                <span className="error-icon">⚠</span>
                {authError}
              </div>
            )}

            {/* Step 1: Account Details */}
            {currentStep === 1 && (
              <section aria-labelledby="step1-heading" className="form-section">
                <h2 id="step1-heading" className="section-heading">Account details</h2>

                {/* Email Field */}
                <div className="form-group">
                  <label htmlFor="email">
                    Email address <span className="required">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={validateEmailField}
                    className={fieldErrors.email ? 'error' : ''}
                    aria-describedby="emailHelp emailError"
                  />
                  <div id="emailHelp" className="field-note">
                    We'll send a verification email.
                  </div>
                  {fieldErrors.email && (
                    <div id="emailError" className="error" role="alert">
                      {fieldErrors.email}
                    </div>
                  )}
                </div>

                {/* Password and Confirm Password */}
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="password">
                      Password <span className="required">*</span>
                    </label>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={validatePasswordFields}
                      className={fieldErrors.password ? 'error' : ''}
                      aria-describedby="passwordHelp passwordError"
                    />
                    <div className="password-meter">
                      <div
                        className="password-meter-fill"
                        style={{
                          width: `${passwordStrength}%`,
                          backgroundColor:
                            passwordStrength < 33 ? '#f87171' : passwordStrength < 66 ? '#f59e0b' : '#10b981',
                        }}
                      ></div>
                    </div>
                    <div id="passwordHelp" className="field-note">
                      Use at least 6 characters (12+ recommended with numbers and symbols).
                    </div>
                    {fieldErrors.password && (
                      <div id="passwordError" className="error" role="alert">
                        {fieldErrors.password}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">
                      Confirm password <span className="required">*</span>
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onBlur={validatePasswordFields}
                      className={fieldErrors.confirmPassword ? 'error' : ''}
                      aria-describedby="confirmError"
                    />
                    {fieldErrors.confirmPassword && (
                      <div id="confirmError" className="error" role="alert">
                        {fieldErrors.confirmPassword}
                      </div>
                    )}

                    <div className="checkbox-group">
                      <input
                        id="showPassword"
                        type="checkbox"
                        checked={showPassword}
                        onChange={(e) => setShowPassword(e.target.checked)}
                      />
                      <label htmlFor="showPassword" className="checkbox-label">
                        Show passwords
                      </label>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Step 2: Profile Details */}
            {currentStep === 2 && (
              <section aria-labelledby="step2-heading" className="form-section">
                <h2 id="step2-heading" className="section-heading">Profile information</h2>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">
                      First name <span className="required">*</span>
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      onBlur={validateProfileFields}
                      className={fieldErrors.firstName ? 'error' : ''}
                      aria-describedby="firstNameError"
                    />
                    {fieldErrors.firstName && (
                      <div id="firstNameError" className="error" role="alert">
                        {fieldErrors.firstName}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName">
                      Last name <span className="required">*</span>
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      onBlur={validateProfileFields}
                      className={fieldErrors.lastName ? 'error' : ''}
                      aria-describedby="lastNameError"
                    />
                    {fieldErrors.lastName && (
                      <div id="lastNameError" className="error" role="alert">
                        {fieldErrors.lastName}
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === 3 && (
              <section aria-labelledby="step3-heading" className="form-section">
                <h2 id="step3-heading" className="section-heading">Review and confirm</h2>

                <div className="review-section">
                  <div className="review-item">
                    <span className="review-label">Email:</span>
                    <span className="review-value">{email}</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Name:</span>
                    <span className="review-value">
                      {firstName} {lastName}
                    </span>
                  </div>
                </div>

                <div className="checkbox-group" style={{ marginTop: '24px' }}>
                  <input
                    id="agreeToTerms"
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    aria-describedby="termsError"
                  />
                  <label htmlFor="agreeToTerms" className="checkbox-label">
                    I agree to the Terms of Service <span className="required">*</span>
                  </label>
                </div>

                <div className="checkbox-group">
                  <input
                    id="agreeToPrivacy"
                    type="checkbox"
                    checked={agreeToPrivacy}
                    onChange={(e) => setAgreeToPrivacy(e.target.checked)}
                    aria-describedby="privacyError"
                  />
                  <label htmlFor="agreeToPrivacy" className="checkbox-label">
                    I agree to the Privacy Policy <span className="required">*</span>
                  </label>
                </div>

                <p className="field-note" style={{ marginTop: '16px' }}>
                  By creating an account you agree to our Terms of Service and Privacy Policy.
                </p>
              </section>
            )}

            {/* Action Buttons */}
            <div className="form-actions">
              {currentStep > 1 && (
                <button type="button" className="btn-secondary" onClick={handleStepBack} disabled={loading}>
                  Back
                </button>
              )}

              {currentStep < 3 && (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleStepNext}
                  disabled={loading}
                  aria-label={`Continue to step ${currentStep + 1}`}
                >
                  Continue
                </button>
              )}

              {currentStep === 3 && (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleSubmit}
                  disabled={loading || !agreeToTerms || !agreeToPrivacy}
                  aria-label="Create account"
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              )}

              {onSignupCancel && (
                <button type="button" className="btn-secondary" onClick={onSignupCancel} disabled={loading}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </main>
      </div>

      {/* Styles */}
      <style jsx>{`
        .signup-container {
          width: 100%;
          max-width: 920px;
          margin: 0 auto;
          padding: 32px;
        }

        .signup-grid {
          background: white;
          border-radius: 10px;
          box-shadow: 0 6px 30px rgba(11, 34, 68, 0.08);
          padding: 28px;
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 24px;
        }

        /* Sidebar */
        .signup-sidebar {
          padding: 18px;
          border-radius: 8px;
          background: linear-gradient(180deg, #ffffff, #fbfdff);
          border: 1px solid rgba(11, 63, 120, 0.04);
          max-height: fit-content;
        }

        .brand {
          font-weight: 600;
          color: #0b63d6;
          margin-bottom: 12px;
        }

        .lead {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 18px;
        }

        /* Steps */
        .steps {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .step {
          display: flex;
          gap: 12px;
          align-items: center;
          padding: 8px;
          border-radius: 8px;
          transition: background 0.2s ease;
        }

        .step.active {
          background: rgba(11, 99, 214, 0.06);
        }

        .step .index {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: grid;
          place-items: center;
          font-weight: 600;
          color: #0b63d6;
          background: rgba(11, 99, 214, 0.08);
          flex-shrink: 0;
        }

        .step-title {
          font-weight: 600;
          font-size: 13px;
        }

        .step-meta {
          font-size: 12px;
          color: #6b7280;
        }

        /* Progress */
        .progresswrap {
          margin-top: 16px;
          margin-bottom: 16px;
        }

        .progress {
          height: 10px;
          background: #eef3fb;
          border-radius: 999px;
          overflow: hidden;
        }

        .progress > div {
          height: 100%;
          background: linear-gradient(90deg, #0b63d6, #2a9df4);
          transition: width 0.3s ease;
        }

        .help {
          font-size: 13px;
          color: #6b7280;
          margin: 12px 0 0 0;
        }

        /* Main Panel */
        .signup-panel {
          padding: 18px;
        }

        .signup-panel h1 {
          font-size: 20px;
          margin: 0 0 6px 0;
          color: #0f172a;
        }

        .subtitle {
          margin: 0 0 18px 0;
          color: #6b7280;
          font-size: 13px;
        }

        /* Error Banner */
        .error-banner {
          background: #fee2e2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 12px 14px;
          color: #991b1b;
          font-size: 13px;
          margin-bottom: 16px;
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

        /* Form */
        .form-section {
          display: grid;
          gap: 14px;
          margin-bottom: 16px;
        }

        .section-heading {
          font-size: 15px;
          margin: 0 0 6px 0;
          color: #0f172a;
        }

        .form-group {
          display: grid;
          gap: 6px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .form-group label {
          display: block;
          font-size: 13px;
          color: #0f172a;
        }

        .required {
          color: #b00020;
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
          box-shadow: 3px solid rgba(11, 99, 214, 0.18);
        }

        .form-group input.error {
          border-color: #ef4444;
        }

        .field-note {
          font-size: 12px;
          color: #6b7280;
          margin: 0;
        }

        .error {
          color: #b00020;
          font-size: 13px;
          margin: 0;
        }

        /* Password Meter */
        .password-meter {
          height: 8px;
          border-radius: 8px;
          background: #eef3fb;
          overflow: hidden;
          margin-top: 6px;
        }

        .password-meter-fill {
          height: 100%;
          transition: all 0.2s ease;
        }

        /* Checkbox Group */
        .checkbox-group {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-top: 8px;
        }

        .checkbox-group input[type='checkbox'] {
          width: 18px;
          height: 18px;
          cursor: pointer;
          flex-shrink: 0;
        }

        .checkbox-label {
          font-size: 13px;
          color: #6b7280;
          cursor: pointer;
          margin: 0;
        }

        /* Review Section */
        .review-section {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 16px;
        }

        .review-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .review-item:last-child {
          border-bottom: none;
        }

        .review-label {
          font-weight: 600;
          font-size: 13px;
          color: #6b7280;
        }

        .review-value {
          font-weight: 500;
          font-size: 13px;
          color: #0f172a;
        }

        /* Actions */
        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }

        button {
          padding: 10px 14px;
          border: 0;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-primary {
          background: #0b63d6;
          color: white;
          flex: 1;
        }

        .btn-primary:hover:not(:disabled) {
          background: #0950b0;
          box-shadow: 0 4px 12px rgba(11, 99, 214, 0.3);
        }

        .btn-secondary {
          background: white;
          border: 1px solid #e6e9ef;
          color: #0f172a;
        }

        .btn-secondary:hover:not(:disabled) {
          border-color: #d1d5db;
          background: #f9fafb;
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Responsive */
        @media (max-width: 880px) {
          .signup-grid {
            grid-template-columns: 1fr;
            padding: 18px;
          }

          .signup-sidebar {
            order: 2;
          }

          .signup-panel {
            order: 1;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .signup-container {
            padding: 16px;
          }
        }

        @media (max-width: 640px) {
          .signup-grid {
            padding: 16px;
          }

          .signup-panel h1 {
            font-size: 18px;
          }

          .form-actions {
            flex-direction: column;
          }

          button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default SignupForm;
