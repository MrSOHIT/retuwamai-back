import { Router } from 'express';
import authRoutes from './auth.routes';
import businessRoutes from './business.routes';
import categoryRoutes from './category.routes';
import dashboardRoutes from './dashboard.routes';

const router = Router();

// Mount all routes
router.use('/auth', authRoutes);
router.use('/businesses', businessRoutes);
router.use('/categories', categoryRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;