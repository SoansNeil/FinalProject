import express from 'express';
import {
  getTeamsForMap,
  getTeamsByRegion,
  getTeamById,
  getAllRegions,
  searchTeams,
} from '../controllers/teamController.js';

const router = express.Router();

// Get all teams for map (public)
router.get('/map', getTeamsForMap);

// Get all regions (public)
router.get('/regions', getAllRegions);

// Search teams (public)
router.post('/search', searchTeams);

// Get teams by region (public)
router.get('/by-region', getTeamsByRegion);

// Get team by ID (public)
router.get('/:teamId', getTeamById);

export default router;
