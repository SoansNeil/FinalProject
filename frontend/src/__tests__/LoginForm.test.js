import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '../components/LoginForm';

jest.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    login: jest.fn(),
    setAuthError: jest.fn(),
  }),
}));

jest.mock('../services/apiService', () => ({
  authService: {
    login: jest.fn((email, password) =>
      Promise.resolve({ data: { token: 'token', user: { email } } })
    ),
  },
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('LoginForm', () => {
  test('shows validation errors for empty inputs', async () => {
    render(<LoginForm />);

    const submit = screen.getByRole('button', { name: /log in/i });
    fireEvent.click(submit);

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

  test('calls authService and login on successful submit', async () => {
    const { authService } = require('../services/apiService');
    const { useAuth } = require('../hooks/useAuth');
    const loginMock = useAuth().login;

    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => expect(authService.login).toHaveBeenCalled());
    expect(loginMock).toHaveBeenCalled();
  });
});
