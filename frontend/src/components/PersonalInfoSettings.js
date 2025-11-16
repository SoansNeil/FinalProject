import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import apiService from '../services/apiService';
import ChangePreview from './ChangePreview';
import styles from './PersonalInfoSettings.module.css';

function PersonalInfoSettings() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    profilePicture: '',
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [pendingChanges, setPendingChanges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load user profile on mount
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const response = await apiService.get('/users/profile');
        if (response.data.success) {
          const userData = response.data.data;
          setFormData({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            profilePicture: userData.profilePicture || '',
          });
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'firstName':
        if (!value || value.trim().length < 2) {
          newErrors.firstName = 'First name must be at least 2 characters long.';
        } else if (value.length > 50) {
          newErrors.firstName = 'First name cannot exceed 50 characters.';
        } else {
          delete newErrors.firstName;
        }
        break;

      case 'lastName':
        if (!value || value.trim().length < 2) {
          newErrors.lastName = 'Last name must be at least 2 characters long.';
        } else if (value.length > 50) {
          newErrors.lastName = 'Last name cannot exceed 50 characters.';
        } else {
          delete newErrors.lastName;
        }
        break;

      case 'email':
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!value || !emailRegex.test(value)) {
          newErrors.email = 'Please provide a valid email address.';
        } else {
          delete newErrors.email;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return !newErrors[name];
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setSuccess('');
    validateField(name, value);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          profilePicture: 'File size must not exceed 5MB.',
        }));
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({
          ...prev,
          profilePicture: 'Please upload an image file.',
        }));
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          profilePicture: event.target.result,
        }));
        delete errors.profilePicture;
        setErrors({ ...errors });
        setSuccess('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePreviewClick = async () => {
    // Validate all fields
    const isFirstNameValid = validateField('firstName', formData.firstName);
    const isLastNameValid = validateField('lastName', formData.lastName);
    const isEmailValid = validateField('email', formData.email);

    if (!isFirstNameValid || !isLastNameValid || !isEmailValid) {
      return;
    }

    // Determine what changed
    const changes = [];

    if (formData.firstName !== user.firstName) {
      changes.push({
        fieldName: 'firstName',
        oldValue: user.firstName,
        newValue: formData.firstName,
      });
    }

    if (formData.lastName !== user.lastName) {
      changes.push({
        fieldName: 'lastName',
        oldValue: user.lastName,
        newValue: formData.lastName,
      });
    }

    if (formData.email !== user.email) {
      changes.push({
        fieldName: 'email',
        oldValue: user.email,
        newValue: formData.email,
      });
    }

    if (formData.profilePicture !== (user.profilePicture || '')) {
      changes.push({
        fieldName: 'profilePicture',
        oldValue: user.profilePicture || 'none',
        newValue: formData.profilePicture || 'none',
      });
    }

    if (changes.length === 0) {
      setSuccess('No changes to save.');
      return;
    }

    setPendingChanges(changes);
    setShowPreview(true);
  };

  const handleConfirmChanges = async () => {
    setIsSubmitting(true);
    try {
      const response = await apiService.put('/users/profile', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        profilePicture: formData.profilePicture,
      });

      if (response.data.success) {
        setSuccess('Profile updated successfully!');
        setShowPreview(false);
        setPendingChanges([]);
        setErrors({});
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile.';
      setErrors((prev) => ({
        ...prev,
        submit: message,
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading your profile...</div>;
  }

  return (
    <>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Personal Information</h2>
        <p className={styles.sectionDescription}>
          Update your personal details. Your changes will be tracked for 24 hours so you can revert them if needed.
        </p>

        <form className={styles.form}>
          {/* Success Message */}
          {success && <div className={styles.successMessage}>{success}</div>}

          {/* Submit Error */}
          {errors.submit && <div className={styles.errorMessage}>{errors.submit}</div>}

          {/* First Name Field */}
          <div className={styles.formGroup}>
            <label htmlFor="firstName" className={styles.label}>
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
              placeholder="Enter your first name"
            />
            {errors.firstName && (
              <span className={styles.errorText}>{errors.firstName}</span>
            )}
          </div>

          {/* Last Name Field */}
          <div className={styles.formGroup}>
            <label htmlFor="lastName" className={styles.label}>
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
              placeholder="Enter your last name"
            />
            {errors.lastName && (
              <span className={styles.errorText}>{errors.lastName}</span>
            )}
          </div>

          {/* Email Field */}
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              placeholder="Enter your email address"
            />
            {errors.email && (
              <span className={styles.errorText}>{errors.email}</span>
            )}
          </div>

          {/* Profile Picture Field */}
          <div className={styles.formGroup}>
            <label htmlFor="profilePicture" className={styles.label}>
              Profile Picture
            </label>
            <div className={styles.fileInputWrapper}>
              <input
                type="file"
                id="profilePicture"
                name="profilePicture"
                onChange={handleFileUpload}
                accept="image/*"
                className={styles.fileInput}
              />
              <label htmlFor="profilePicture" className={styles.fileLabel}>
                Choose Image
              </label>
            </div>
            {errors.profilePicture && (
              <span className={styles.errorText}>{errors.profilePicture}</span>
            )}
            {formData.profilePicture && !errors.profilePicture && (
              <div className={styles.previewContainer}>
                <img
                  src={formData.profilePicture}
                  alt="Profile preview"
                  className={styles.previewImage}
                />
                <span className={styles.previewText}>Image selected</span>
              </div>
            )}
          </div>

          {/* Preview Changes Button */}
          <div className={styles.formActions}>
            <button
              type="button"
              onClick={handlePreviewClick}
              disabled={isSubmitting}
              className={styles.previewButton}
            >
              {isSubmitting ? 'Saving...' : 'Preview Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Change Preview Modal */}
      {showPreview && (
        <ChangePreview
          changes={pendingChanges}
          onConfirm={handleConfirmChanges}
          onCancel={() => {
            setShowPreview(false);
            setPendingChanges([]);
          }}
          isSubmitting={isSubmitting}
        />
      )}
    </>
  );
}

export default PersonalInfoSettings;
