jest.mock('axios', () => ({ create: () => ({ interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } }, get: jest.fn(), post: jest.fn() }) }));
import { render } from '@testing-library/react';
import RecentSearches from '../components/RecentSearches';
import { AuthProvider } from '../context/AuthContext';
import { MemoryRouter } from 'react-router-dom';

describe('RecentSearches', () => {
  test('renders without crashing', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <RecentSearches />
        </AuthProvider>
      </MemoryRouter>
    );
  });
});
