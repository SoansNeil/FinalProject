import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getFavoriteTeams,
  addFavoriteTeam,
  removeFavoriteTeam,
} from '../controllers/favoriteTeamsController.js';

const router = express.Router();

/**
 * @route   GET /api/favorite-teams
 * @desc    Get all favorite teams for the user
 * @access  Private
 */
router.get('/', protect, getFavoriteTeams);

/**
 * @route   POST /api/favorite-teams
 * @desc    Add a team to favorites
 * @access  Private
 */
router.post('/', protect, addFavoriteTeam);

/**
 * @route   DELETE /api/favorite-teams
 * @desc    Remove a team from favorites
 * @access  Private
 */
router.delete('/', protect, removeFavoriteTeam);

export default router;
