
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

describe('LoginForm', () => {
  test('shows validation errors for empty inputs', async () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    const submit = screen.getByRole('button', { name: /log in/i });
    fireEvent.click(submit);

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });
});

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
