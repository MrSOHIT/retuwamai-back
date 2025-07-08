import { Router } from 'express';
import { login, logout, getProfile, changePassword } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { validate, loginSchema } from '../middleware/validation.middleware';

const router = Router();

// Public routes
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.post('/change-password', authenticateToken, changePassword);

export default router;