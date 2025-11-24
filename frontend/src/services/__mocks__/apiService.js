// Centralized mock for apiService used by tests
const authService = {
  login: jest.fn((email, password) =>
    Promise.resolve({ data: { token: 'token', user: { email } } })
  ),
};

const teamsService = {
  searchTeams: jest.fn((query) =>
    Promise.resolve({ data: { success: true, data: [{ _id: '1', teamName: 'Team A', league: 'League 1', country: 'Country' }] } })
  ),
};

module.exports = {
  authService,
  teamsService,
};
