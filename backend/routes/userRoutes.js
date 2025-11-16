const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth'); // Assumes you have authentication middleware

/**
 * Authentication Routes (no auth middleware needed)
 */

// Register a new user
router.post('/register', userController.register);

// Login user
router.post('/login', userController.login);

/**
 * Favorite Teams Routes (protected routes - require authentication)
 */

// Get all favorite teams for a user
router.get('/:userId/favorites', auth, userController.getFavoriteTeams);

// Add a team to favorites
router.post('/:userId/favorites', auth, userController.addFavoriteTeam);

// Remove a team from favorites
router.delete('/:userId/favorites/:teamId', auth, userController.removeFavoriteTeam);

/**
 * Recent Searches Routes (protected routes - require authentication)
 */

// Get recent searches for a user
router.get('/:userId/searches', auth, userController.getRecentSearches);

// Add a new search to recent searches
router.post('/:userId/searches', auth, userController.addRecentSearch);

// Clear all recent searches
router.delete('/:userId/searches', auth, userController.clearRecentSearches);

/**
 * Combined Preferences Route (protected route - requires authentication)
 */

// Get all user preferences (favorites + recent searches)
router.get('/:userId/preferences', auth, userController.getUserPreferences);

module.exports = router;
