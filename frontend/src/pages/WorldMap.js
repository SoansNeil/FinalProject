import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Popup, CircleMarker, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import apiService from '../services/apiService';
import styles from './WorldMap.module.css';

const regions = {
  Europe: {
    bounds: [[35.0, -10.0], [71.0, 40.0]],
    color: '#0066cc',
  },
  'South America': {
    bounds: [[12.0, -82.0], [-56.0, -35.0]],
    color: '#00aa44',
  },
  Asia: {
    bounds: [[-10.0, 60.0], [55.0, 150.0]],
    color: '#ff6600',
  },
  Africa: {
    bounds: [[-35.0, -20.0], [37.0, 55.0]],
    color: '#ff3333',
  },
  'North America': {
    bounds: [[15.0, -170.0], [85.0, -55.0]],
    color: '#9933ff',
  },
};

function WorldMap() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [mapCenter] = useState([20, 0]);
  const [mapZoom] = useState(2);

  useEffect(() => {
    fetchTeamsForMap();
  }, []);

  const fetchTeamsForMap = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiService.get('/teams/map');

      if (response.data.success) {
        setTeams(response.data.data);
      } else {
        setError('Failed to load teams data');
      }
    } catch (err) {
      console.error('Error fetching teams:', err);
      setError('Failed to load map data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkerClick = (team) => {
    setSelectedTeam(team);
  };

  const handleRegionClick = (regionName) => {
    const region = regions[regionName];
    if (region && window.map) {
      window.map.fitBounds(region.bounds);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading world map...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>⚽ World Soccer Teams Map</h1>
        <p>Click on markers to view team details • Click regions to zoom in</p>
      </div>

      <div className={styles.controls}>
        {Object.keys(regions).map((region) => (
          <button
            key={region}
            className={styles.regionBtn}
            onClick={() => handleRegionClick(region)}
            style={{
              borderColor: regions[region].color,
              color: regions[region].color,
            }}
          >
            {region}
          </button>
        ))}
      </div>

      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        className={styles.map}
        ref={(el) => {
          if (el) window.map = el._leaflet_map;
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {teams.map((team) => (
          <CircleMarker
            key={team._id}
            center={[team.latitude, team.longitude]}
            radius={6}
            fillColor="#0066cc"
            fillOpacity={0.8}
            stroke={true}
            weight={2}
            color="#white"
            opacity={0.8}
            eventHandlers={{
              click: () => handleMarkerClick(team),
            }}
          >
            <Popup>
              <div className={styles.popupContent}>
                <h3>{team.teamName}</h3>
                <p>
                  <strong>Region:</strong> {team.region}
                </p>
                <p>
                  <strong>Country:</strong> {team.country}
                </p>
                <p>
                  <strong>League:</strong> {team.league}
                </p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {selectedTeam && (
        <div className={styles.teamInfo}>
          <button
            className={styles.closeBtn}
            onClick={() => setSelectedTeam(null)}
          >
            ✕
          </button>
          <div className={styles.teamDetails}>
            <div className={styles.logoSection}>
              {selectedTeam.logo ? (
                <img
                  src={selectedTeam.logo}
                  alt={selectedTeam.teamName}
                  className={styles.teamLogo}
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ccircle cx=%2250%22 cy=%2250%22 r=%2245%22 fill=%22%23ddd%22/%3E%3Ctext x=%2250%22 y=%2250%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22 font-size=%2224%22 font-weight=%22bold%22%3E⚽%3C/text%3E%3C/svg%3E';
                  }}
                />
              ) : (
                <div className={styles.logoPlaceholder}>⚽</div>
              )}
            </div>
            <h2>{selectedTeam.teamName}</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.label}>Country:</span>
                <span className={styles.value}>{selectedTeam.country}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Region:</span>
                <span className={styles.value}>{selectedTeam.region}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>League:</span>
                <span className={styles.value}>{selectedTeam.league}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>Founded:</span>
                <span className={styles.value}>
                  {selectedTeam.founded || 'Unknown'}
                </span>
              </div>
            </div>

            {selectedTeam.stadium && (
              <div className={styles.section}>
                <h4>Stadium</h4>
                <p>{selectedTeam.stadium}</p>
              </div>
            )}

            {selectedTeam.recentPerformance && (
              <div className={styles.section}>
                <h4>Recent Performance</h4>
                <div className={styles.performanceGrid}>
                  <div className={styles.perfItem}>
                    <span className={styles.perfLabel}>Wins</span>
                    <span className={styles.perfValue}>
                      {selectedTeam.recentPerformance.wins}
                    </span>
                  </div>
                  <div className={styles.perfItem}>
                    <span className={styles.perfLabel}>Draws</span>
                    <span className={styles.perfValue}>
                      {selectedTeam.recentPerformance.draws}
                    </span>
                  </div>
                  <div className={styles.perfItem}>
                    <span className={styles.perfLabel}>Losses</span>
                    <span className={styles.perfValue}>
                      {selectedTeam.recentPerformance.losses}
                    </span>
                  </div>
                  <div className={styles.perfItem}>
                    <span className={styles.perfLabel}>Goals</span>
                    <span className={styles.perfValue}>
                      {selectedTeam.recentPerformance.goals}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default WorldMap;
