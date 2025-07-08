import { Router } from 'express';
import {
  getDashboardStats,
  getBusinessAnalytics,
  getRecentActivities,
  getWardComparison,
  getTopBusinesses,
} from '../controllers/dashboard.controller';
import { authenticateToken, requireWorkerOrAdmin } from '../middleware/auth.middleware';

const router = Router();

// Protected routes (Worker or Admin)
router.use(authenticateToken);
router.use(requireWorkerOrAdmin);

router.get('/stats', getDashboardStats);
router.get('/analytics', getBusinessAnalytics);
router.get('/activities', getRecentActivities);
router.get('/ward-comparison', getWardComparison);
router.get('/top-businesses', getTopBusinesses);

export default router;