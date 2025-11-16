import User from '../models/User.js';

export const getFavoriteTeams = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: user.favoriteTeams,
    });
  } catch (error) {
    console.error('Get favorite teams error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch favorite teams.',
    });
  }
};

export const addFavoriteTeam = async (req, res) => {
  try {
    const { teamId, teamName } = req.body;

    // Validation
    if (!teamId || !teamName) {
      return res.status(400).json({
        success: false,
        message: 'Team ID and name are required.',
      });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Check if team already exists
    const teamExists = user.favoriteTeams.some(
      (team) => team.teamId === teamId.toString()
    );

    if (teamExists) {
      return res.status(400).json({
        success: false,
        message: 'This team is already in your favorites.',
      });
    }

    // Add team to favorites
    user.favoriteTeams.push({
      teamId: teamId.toString(),
      teamName: teamName.trim(),
      addedAt: new Date(),
    });

    await user.save();

    return res.status(201).json({
      success: true,
      message: 'Team added to favorites!',
      data: user.favoriteTeams,
    });
  } catch (error) {
    console.error('Add favorite team error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add team to favorites.',
    });
  }
};

export const removeFavoriteTeam = async (req, res) => {
  try {
    const { teamId } = req.body;

    // Validation
    if (!teamId) {
      return res.status(400).json({
        success: false,
        message: 'Team ID is required.',
      });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Remove team from favorites
    user.favoriteTeams = user.favoriteTeams.filter(
      (team) => team.teamId !== teamId.toString()
    );

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Team removed from favorites!',
      data: user.favoriteTeams,
    });
  } catch (error) {
    console.error('Remove favorite team error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to remove team from favorites.',
    });
  }
};
