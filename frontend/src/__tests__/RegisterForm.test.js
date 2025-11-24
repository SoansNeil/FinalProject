import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RegisterForm from '../components/RegisterForm';

jest.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    register: jest.fn(),
    setAuthError: jest.fn(),
  }),
}));

jest.mock('../services/apiService', () => ({
  authService: {
    register: jest.fn((email, password) =>
      Promise.resolve({ data: { token: 'token', user: { email } } })
    ),
  },
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('RegisterForm', () => {
  test('shows password mismatch error', async () => {
    render(<RegisterForm />);

    fireEvent.change(screen.getByPlaceholderText(/john/i), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByPlaceholderText(/doe/i), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter password/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), {
      target: { value: 'different' },
    });

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
  });
});
