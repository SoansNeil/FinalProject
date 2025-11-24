import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const LoginForm = require('../components/LoginForm').default;

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('LoginForm', () => {
  test('shows validation errors for empty inputs', async () => {
    render(
      <MemoryRouter>
        <LoginForm authHook={{ login: jest.fn(), setAuthError: jest.fn() }} />
      </MemoryRouter>
    );

    const submit = screen.getByRole('button', { name: /log in/i });
    fireEvent.click(submit);

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

  test('calls authService and login on successful submit', async () => {
    const mockLogin = jest.fn();
    const mockAuthHook = { login: mockLogin, setAuthError: jest.fn() };

    const mockAuthService = {
      login: jest.fn().mockResolvedValue({ data: { token: 'token', user: { email: 'john@example.com' } } }),
    };

    render(
      <MemoryRouter>
        <LoginForm authServiceProp={mockAuthService} authHook={mockAuthHook} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => expect(mockAuthService.login).toHaveBeenCalled());
    expect(mockLogin).toHaveBeenCalled();
  });
});
