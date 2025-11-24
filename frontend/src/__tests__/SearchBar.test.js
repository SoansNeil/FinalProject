
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SearchBar from '../components/SearchBar';

describe('SearchBar', () => {
  test('renders and allows input', () => {
    render(
      <BrowserRouter>
        <SearchBar />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText(/search teams or leagues/i);
    fireEvent.change(input, { target: { value: 'Team' } });
    expect(input.value).toBe('Team');
  });
});
