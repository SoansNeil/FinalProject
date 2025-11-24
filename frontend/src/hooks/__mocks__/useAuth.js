// Centralized mock for useAuth hook used in tests
const mockLogin = jest.fn();

const useAuth = () => ({
  login: mockLogin,
  setAuthError: jest.fn(),
});

module.exports = {
  useAuth,
  mockLogin,
};
