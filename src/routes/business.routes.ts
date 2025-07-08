import { Router } from 'express';
import {
  createBusiness,
  getAllBusinesses,
  getBusinessById,
  updateBusiness,
  deleteBusiness,
  searchBusinesses,
  getBusinessesByWard,
  getBusinessStats,
} from '../controllers/business.controller';
import { authenticateToken, requireWorkerOrAdmin, requireAdmin } from '../middleware/auth.middleware';
import { validate, createBusinessSchema, paginationSchema } from '../middleware/validation.middleware';
import { uploadMultiple, handleUploadError } from '../middleware/upload.middleware';

const router = Router();

// Public routes
router.get('/search', validate(paginationSchema), searchBusinesses);
router.get('/stats', getBusinessStats);
router.get('/ward/:ward', getBusinessesByWard);
router.get('/:id', getBusinessById);

// Protected routes (Worker or Admin)
router.use(authenticateToken);
router.use(requireWorkerOrAdmin);

router.post(
  '/',
  uploadMultiple,
  handleUploadError,
  validate(createBusinessSchema),
  createBusiness
);

router.get('/', validate(paginationSchema), getAllBusinesses);

router.put(
  '/:id',
  uploadMultiple,
  handleUploadError,
  updateBusiness
);

// Admin only routes
router.delete('/:id', requireAdmin, deleteBusiness);

export default router;