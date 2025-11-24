jest.mock('axios', () => ({ create: () => ({ interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } }, get: jest.fn(), post: jest.fn() }) }));
import { render } from '@testing-library/react';
import FavoriteTeams from '../components/FavoriteTeams';
import { AuthProvider } from '../context/AuthContext';
import { MemoryRouter } from 'react-router-dom';

describe('FavoriteTeams', () => {
  test('renders without crashing', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <FavoriteTeams />
        </AuthProvider>
      </MemoryRouter>
    );
  });
});
