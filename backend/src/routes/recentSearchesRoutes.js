import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getRecentSearches,
  addSearch,
  clearSearches,
} from '../controllers/recentSearchesController.js';

const router = express.Router();

/**
 * @route   GET /api/recent-searches
 * @desc    Get all recent searches for the user
 * @access  Private
 */
router.get('/', protect, getRecentSearches);

/**
 * @route   POST /api/recent-searches
 * @desc    Add a search to history
 * @access  Private
 */
router.post('/', protect, addSearch);

/**
 * @route   DELETE /api/recent-searches
 * @desc    Clear all searches
 * @access  Private
 */
router.delete('/', protect, clearSearches);

export default router;
