import { render } from '@testing-library/react';
import ProtectedRoute from '../components/ProtectedRoute';

describe('ProtectedRoute', () => {
  test('renders without crashing', () => {
    render(<ProtectedRoute />);
  });
});
