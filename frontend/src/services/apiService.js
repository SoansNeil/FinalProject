import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
// No token-based authentication needed

// Handle responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

const authService = {
  register: (email, password, firstName, lastName) => {
    return apiClient.post('/users/register', {
      email,
      password,
      firstName,
      lastName,
    });
  },

  login: (email, password) => {
    return apiClient.post('/users/login', {
      email,
      password,
    });
  },
};

const favoriteTeamsService = {
  getFavoriteTeams: (userId) => {
    return apiClient.get(`/users/${userId}/favorites`);
  },

  addFavoriteTeam: (userId, teamId, teamName) => {
    return apiClient.post(`/users/${userId}/favorites`, {
      teamId,
      teamName,
    });
  },

  removeFavoriteTeam: (userId, teamId) => {
    return apiClient.delete(`/users/${userId}/favorites/${teamId}`);
  },
};

const recentSearchesService = {
  getRecentSearches: (userId) => {
    return apiClient.get(`/users/${userId}/searches`);
  },

  addRecentSearch: (userId, query) => {
    return apiClient.post(`/users/${userId}/searches`, {
      query,
    });
  },

  clearRecentSearches: (userId) => {
    return apiClient.delete(`/users/${userId}/searches`);
  },
};

const userPreferencesService = {
  getUserPreferences: (userId) => {
    return apiClient.get(`/users/${userId}/preferences`);
  },
};

const teamsService = {
  getTeamsForMap: () => {
    return apiClient.get('/teams/map');
  },

  getTeamsByRegion: (country, region) => {
    return apiClient.get('/teams/by-region', {
      params: { country, region },
    });
  },

  getTeamById: (teamId) => {
    return apiClient.get(`/teams/${teamId}`);
  },

  getAllRegions: () => {
    return apiClient.get('/teams/regions');
  },

  searchTeams: (query) => {
    return apiClient.post('/teams/search', { query });
  },
};

export { authService, favoriteTeamsService, recentSearchesService, userPreferencesService, teamsService };

export default apiClient;
