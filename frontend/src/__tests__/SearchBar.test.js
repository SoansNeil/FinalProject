import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const SearchBar = require('../components/SearchBar').default;

describe('SearchBar', () => {
  test('performs search and shows results, then selects team', async () => {
    // Create a mock teamsService and inject it via props
    const teamsServiceMock = {
      searchTeams: jest.fn().mockResolvedValue({ data: { success: true, data: [{ _id: '1', teamName: 'Team A', league: 'League 1', country: 'Country' }] } })
    };
    const onTeamSelect = jest.fn();

    render(
      <MemoryRouter>
        <SearchBar onTeamSelect={onTeamSelect} teamsServiceProp={teamsServiceMock} />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/search teams or leagues/i);
    fireEvent.change(input, { target: { value: 'Team' } });

    // Wait for debounce + async and for the mocked service to be called
    await waitFor(() => expect(teamsServiceMock.searchTeams).toHaveBeenCalledWith('Team'), { timeout: 2000 });
    await waitFor(() => expect(screen.getByText(/team a/i)).toBeInTheDocument(), { timeout: 2000 });

    fireEvent.click(screen.getByText(/team a/i));
    expect(onTeamSelect).toHaveBeenCalledWith(expect.objectContaining({ teamName: 'Team A' }));
  });
});
