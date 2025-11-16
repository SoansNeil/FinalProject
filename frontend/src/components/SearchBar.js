import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { teamsService } from '../services/apiService';
import styles from './SearchBar.module.css';

function SearchBar({ onTeamSelect = null, placeholder = 'Search teams or leagues...' }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const debounceTimer = useRef(null);

  // Fetch search results
  const performSearch = async (query) => {
    if (!query || query.trim().length === 0) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    try {
      setIsSearching(true);
      const response = await teamsService.searchTeams(query.trim());

      if (response.data.success) {
        setSearchResults(response.data.data || []);
        setShowDropdown(response.data.data.length > 0);
        setSelectedIndex(-1);
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setShowDropdown(false);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle input change with debouncing
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setSelectedIndex(-1);

    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer for search
    debounceTimer.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showDropdown || searchResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          selectTeam(searchResults[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  // Select a team from results
  const selectTeam = (team) => {
    setSearchQuery('');
    setSearchResults([]);
    setShowDropdown(false);
    setSelectedIndex(-1);

    if (onTeamSelect) {
      onTeamSelect(team);
    }
  };

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.searchBarContainer} ref={searchRef}>
      <div className={styles.searchInputWrapper}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => searchQuery && setShowDropdown(true)}
          placeholder={placeholder}
          className={styles.searchInput}
          autoComplete="off"
        />
        {isSearching && <div className={styles.spinner} />}
      </div>

      {showDropdown && searchResults.length > 0 && (
        <div className={styles.dropdownResults}>
          {searchResults.map((team, index) => (
            <div
              key={team._id}
              className={`${styles.resultItem} ${
                index === selectedIndex ? styles.selected : ''
              }`}
              onClick={() => selectTeam(team)}
            >
              <div className={styles.resultContent}>
                {team.logo && (
                  <img
                    src={team.logo}
                    alt={team.teamName}
                    className={styles.resultLogo}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                <div className={styles.resultInfo}>
                  <div className={styles.resultName}>{team.teamName}</div>
                  <div className={styles.resultMeta}>
                    {team.league && (
                      <span className={styles.league}>{team.league}</span>
                    )}
                    {team.country && (
                      <span className={styles.country}>{team.country}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showDropdown && searchQuery && searchResults.length === 0 && !isSearching && (
        <div className={styles.noResults}>
          <p>No teams found matching "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
