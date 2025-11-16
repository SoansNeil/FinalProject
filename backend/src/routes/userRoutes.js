import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  getChangeHistory,
  revertProfileChange,
} from '../controllers/userController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get user profile
router.get('/profile', getUserProfile);

// Update user profile
router.put('/profile', updateUserProfile);

// Get change history
router.get('/profile/history', getChangeHistory);

// Revert a change
router.post('/profile/revert', revertProfileChange);

export default router;
