import User from '../models/User.js';

const MAX_SEARCHES = 20;

export const getRecentSearches = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Return searches sorted by most recent first
    const searches = user.recentSearches.sort(
      (a, b) => new Date(b.searchedAt) - new Date(a.searchedAt)
    );

    return res.status(200).json({
      success: true,
      data: searches,
    });
  } catch (error) {
    console.error('Get recent searches error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch recent searches.',
    });
  }
};

export const addSearch = async (req, res) => {
  try {
    const { query } = req.body;

    // Validation
    if (!query || query.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Search query is required.',
      });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Remove duplicate if it exists
    user.recentSearches = user.recentSearches.filter(
      (search) => search.query.toLowerCase() !== query.toLowerCase()
    );

    // Add new search at the beginning
    user.recentSearches.unshift({
      query: query.trim(),
      searchedAt: new Date(),
    });

    // Keep only the most recent MAX_SEARCHES searches
    if (user.recentSearches.length > MAX_SEARCHES) {
      user.recentSearches = user.recentSearches.slice(0, MAX_SEARCHES);
    }

    await user.save();

    return res.status(201).json({
      success: true,
      message: 'Search added to history!',
      data: user.recentSearches,
    });
  } catch (error) {
    console.error('Add search error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add search to history.',
    });
  }
};

export const clearSearches = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    user.recentSearches = [];
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Search history cleared!',
      data: [],
    });
  } catch (error) {
    console.error('Clear searches error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to clear search history.',
    });
  }
};
