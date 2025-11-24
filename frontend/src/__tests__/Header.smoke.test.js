import { render } from '@testing-library/react';
import Header from '../components/Header';
import { AuthProvider } from '../context/AuthContext';

describe('Header', () => {
  test('renders without crashing', () => {
    render(
      <AuthProvider>
        <Header />
      </AuthProvider>
    );
  });
});
