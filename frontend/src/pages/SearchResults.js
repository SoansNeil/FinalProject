import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './SearchResults.module.css';

const SearchResults = () => {
  const { query } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!query) {
      navigate('/dashboard');
      return;
    }

    fetchSearchResults();
  }, [query, navigate]);

  const fetchSearchResults = async () => {
    try {
      setLoading(true);
      setError('');

      // Simulate search results - in a real app, this would call an API
      const mockResults = [
        {
          id: 'man-utd',
          name: 'Manchester United',
          location: 'Manchester, England',
          founded: 1878,
          league: 'Premier League',
        },
        {
          id: 'man-city',
          name: 'Manchester City',
          location: 'Manchester, England',
          founded: 1880,
          league: 'Premier League',
        },
        {
          id: 'man-utd-youth',
          name: 'Manchester United Academy',
          location: 'Manchester, England',
          founded: 2000,
          league: 'Youth Academy',
        },
      ];

      setResults(mockResults);

      // Log the search to recent searches if user is logged in
      if (user?.id) {
        await logSearch(query);
      }
    } catch (err) {
      setError('Failed to fetch search results');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const logSearch = async (searchTerm) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/recent-searches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ query: searchTerm }),
      });
    } catch (err) {
      console.error('Failed to log search:', err);
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className={styles['search-results-container']}>
        <div className={styles['loading']}>
          <div className={styles['spinner']}></div>
          <p>Loading results for "{query}"...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles['search-results-container']}>
      <button className={styles['back-btn']} onClick={handleBack}>
        ← Back to Dashboard
      </button>

      <div className={styles['search-header']}>
        <h1>Search Results for "{query}"</h1>
        <p className={styles['result-count']}>
          {results.length} {results.length === 1 ? 'team' : 'teams'} found
        </p>
      </div>

      {error && (
        <div className={styles['error-message']}>
          <p>{error}</p>
        </div>
      )}

      {results.length === 0 ? (
        <div className={styles['no-results']}>
          <p>No teams found matching your search.</p>
          <button className={styles['search-btn']} onClick={handleBack}>
            Try a Different Search
          </button>
        </div>
      ) : (
        <div className={styles['results-grid']}>
          {results.map((team) => (
            <div key={team.id} className={styles['result-card']}>
              <div className={styles['card-header']}>
                <h3>{team.name}</h3>
              </div>

              <div className={styles['card-content']}>
                <div className={styles['info-row']}>
                  <span className={styles['label']}>Location:</span>
                  <span className={styles['value']}>{team.location}</span>
                </div>

                <div className={styles['info-row']}>
                  <span className={styles['label']}>League:</span>
                  <span className={styles['value']}>{team.league}</span>
                </div>

                <div className={styles['info-row']}>
                  <span className={styles['label']}>Founded:</span>
                  <span className={styles['value']}>{team.founded}</span>
                </div>
              </div>

              <button className={styles['details-btn']}>View Details</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
