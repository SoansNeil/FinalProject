jest.mock('axios', () => ({ create: () => ({ interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } }, get: jest.fn(), post: jest.fn() }) }));
import { render } from '@testing-library/react';
import PersonalInfoSettings from '../components/PersonalInfoSettings';
import { AuthProvider } from '../context/AuthContext';

describe('PersonalInfoSettings', () => {
  test('renders without crashing', () => {
    render(
      <AuthProvider>
        <PersonalInfoSettings />
      </AuthProvider>
    );
  });
});
