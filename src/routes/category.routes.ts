import { Router } from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getCategoryStats,
} from '../controllers/category.controller';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';
import { validate, createCategorySchema } from '../middleware/validation.middleware';

const router = Router();

// Public routes
router.get('/', getAllCategories);
router.get('/stats', getCategoryStats);
router.get('/:id', getCategoryById);

// Protected routes (Admin only)
router.use(authenticateToken);
router.use(requireAdmin);

router.post('/', validate(createCategorySchema), createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;