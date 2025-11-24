import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchBar from '../components/SearchBar';

jest.mock('../services/apiService', () => ({
  teamsService: {
    searchTeams: jest.fn((query) =>
      Promise.resolve({ data: { success: true, data: [{ _id: '1', teamName: 'Team A', league: 'League 1', country: 'Country' }] } })
    ),
  },
}));

describe('SearchBar', () => {
  test('performs search and shows results, then selects team', async () => {
    const onTeamSelect = jest.fn();
    render(<SearchBar onTeamSelect={onTeamSelect} />);

    const input = screen.getByPlaceholderText(/search teams or leagues/i);
    fireEvent.change(input, { target: { value: 'Team' } });

    // Wait for debounce + async
    await waitFor(() => expect(screen.getByText(/team a/i)).toBeInTheDocument(), { timeout: 2000 });

    fireEvent.click(screen.getByText(/team a/i));
    expect(onTeamSelect).toHaveBeenCalledWith(expect.objectContaining({ teamName: 'Team A' }));
  });
});
