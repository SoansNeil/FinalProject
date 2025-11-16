import React, { useState } from 'react';
import PersonalInfoSettings from '../components/PersonalInfoSettings';
import styles from './SettingsPage.module.css';

function SettingsPage() {
  const [activeTab, setActiveTab] = useState('personal');

  return (
    <div className={styles.settingsContainer}>
      <div className={styles.settingsWrapper}>
        <h1 className={styles.title}>Settings</h1>
        
        <div className={styles.tabsContainer}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'personal' ? styles.active : ''}`}
              onClick={() => setActiveTab('personal')}
            >
              Personal Information
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'security' ? styles.active : ''}`}
              onClick={() => setActiveTab('security')}
              disabled
            >
              Security
            </button>
          </div>
        </div>

        <div className={styles.tabContent}>
          {activeTab === 'personal' && <PersonalInfoSettings />}
          {activeTab === 'security' && (
            <div className={styles.placeholder}>Security settings coming soon...</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
