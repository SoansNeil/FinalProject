import React from 'react';
import styles from './ChangePreview.module.css';

function ChangePreview({ changes, onConfirm, onCancel, isSubmitting }) {
  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Review Your Changes</h2>
          <button
            className={styles.closeButton}
            onClick={onCancel}
            type="button"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className={styles.modalContent}>
          <p className={styles.description}>
            Please review the following changes before confirming:
          </p>

          <div className={styles.changesList}>
            {changes.map((change, index) => (
              <div key={index} className={styles.changeItem}>
                <div className={styles.fieldName}>
                  {change.fieldName === 'firstName'
                    ? 'First Name'
                    : change.fieldName === 'lastName'
                    ? 'Last Name'
                    : change.fieldName === 'email'
                    ? 'Email Address'
                    : change.fieldName === 'profilePicture'
                    ? 'Profile Picture'
                    : change.fieldName}
                </div>

                <div className={styles.changeValues}>
                  <div className={styles.oldValue}>
                    <span className={styles.label}>Current:</span>
                    {change.fieldName === 'profilePicture' ? (
                      <span className={styles.value}>
                        {change.oldValue === 'none' ? 'No image' : 'Image set'}
                      </span>
                    ) : (
                      <span className={styles.value}>{change.oldValue}</span>
                    )}
                  </div>

                  <div className={styles.arrow}>→</div>

                  <div className={styles.newValue}>
                    <span className={styles.label}>New:</span>
                    {change.fieldName === 'profilePicture' ? (
                      <span className={styles.value}>
                        {change.newValue === 'none' ? 'No image' : 'Image set'}
                      </span>
                    ) : (
                      <span className={styles.value}>{change.newValue}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.note}>
            <strong>Note:</strong> These changes will be trackable for 24 hours, and you'll be able to revert them if needed.
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button
            className={styles.cancelButton}
            onClick={onCancel}
            disabled={isSubmitting}
            type="button"
          >
            Cancel
          </button>
          <button
            className={styles.confirmButton}
            onClick={onConfirm}
            disabled={isSubmitting}
            type="button"
          >
            {isSubmitting ? 'Saving...' : 'Confirm Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChangePreview;
