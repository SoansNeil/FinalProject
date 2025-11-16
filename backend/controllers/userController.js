const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

/**
 * Register a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Validate input
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, firstName, and lastName are required',
      });
    }

    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    // Check if user already exists
    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    });

    // Save user to database
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '24h' }
    );

    // Return success response with token
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating account',
      error: error.message,
    });
  }
};

/**
 * Login an existing user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Compare passwords
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Update last login timestamp
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '24h' }
    );

    // Return success response with token
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message,
    });
  }
};

/**
 * Get user's favorite teams
 * @param {string} userId - MongoDB user ID
 * @returns {Array} Array of favorite teams
 */
exports.getFavoriteTeams = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('favoriteTeams');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      count: user.favoriteTeams.length,
      data: user.favoriteTeams,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching favorite teams', error: error.message });
  }
};

/**
 * Add a team to user's favorites
 * @param {string} userId - MongoDB user ID
 * @param {Object} teamData - { teamId, teamName }
 */
exports.addFavoriteTeam = async (req, res) => {
  try {
    const { userId } = req.params;
    const { teamId, teamName } = req.body;

    if (!teamId || !teamName) {
      return res.status(400).json({ message: 'teamId and teamName are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if team is already favorited
    const isAlreadyFavorited = user.favoriteTeams.some((fav) => fav.teamId === teamId);
    if (isAlreadyFavorited) {
      return res.status(400).json({ message: 'Team is already in your favorites' });
    }

    // Add team to favorites
    user.favoriteTeams.push({
      teamId,
      teamName,
      addedAt: new Date(),
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Team added to favorites',
      data: user.favoriteTeams,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding favorite team', error: error.message });
  }
};

/**
 * Remove a team from user's favorites
 * @param {string} userId - MongoDB user ID
 * @param {string} teamId - Team ID to remove
 */
exports.removeFavoriteTeam = async (req, res) => {
  try {
    const { userId, teamId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove team from favorites
    user.favoriteTeams = user.favoriteTeams.filter((fav) => fav.teamId !== teamId);

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Team removed from favorites',
      data: user.favoriteTeams,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error removing favorite team', error: error.message });
  }
};

/**
 * Get user's recent searches
 * @param {string} userId - MongoDB user ID
 * @param {number} limit - Number of searches to return (default: 10)
 */
exports.getRecentSearches = async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    const user = await User.findById(userId).select('recentSearches');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return most recent searches first
    const recentSearches = user.recentSearches.slice(0, limit);

    res.status(200).json({
      success: true,
      count: recentSearches.length,
      data: recentSearches,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recent searches', error: error.message });
  }
};

/**
 * Add a search to user's recent searches
 * @param {string} userId - MongoDB user ID
 * @param {string} query - Search query
 */
exports.addRecentSearch = async (req, res) => {
  try {
    const { userId } = req.params;
    const { query } = req.body;

    if (!query || typeof query !== 'string' || query.trim() === '') {
      return res.status(400).json({ message: 'Search query is required and must be a non-empty string' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add search to the beginning of the array
    user.recentSearches.unshift({
      query: query.trim(),
      searchedAt: new Date(),
    });

    // Keep only the last 50 searches
    if (user.recentSearches.length > 50) {
      user.recentSearches = user.recentSearches.slice(0, 50);
    }

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Search recorded',
      data: user.recentSearches.slice(0, 10), // Return only the 10 most recent
    });
  } catch (error) {
    res.status(500).json({ message: 'Error recording search', error: error.message });
  }
};

/**
 * Clear all recent searches for a user
 * @param {string} userId - MongoDB user ID
 */
exports.clearRecentSearches = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.recentSearches = [];
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Recent searches cleared',
    });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing recent searches', error: error.message });
  }
};

/**
 * Get all user preferences (favorites + recent searches)
 * @param {string} userId - MongoDB user ID
 */
exports.getUserPreferences = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('favoriteTeams recentSearches');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        favoriteTeams: user.favoriteTeams,
        recentSearches: user.recentSearches.slice(0, 10), // Return only 10 most recent
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user preferences', error: error.message });
  }
};
