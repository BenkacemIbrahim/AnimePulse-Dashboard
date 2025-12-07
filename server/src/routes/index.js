import { Router } from 'express';
import authRoutes from './auth.js';
import postRoutes from './posts.js';
import categoryRoutes from './categories.js';
import commentRoutes from './comments.js';
import subscriberRoutes from './subscribers.js';
import profileRoutes from './profile.js';
import settingsRoutes from './settings.js';
import analyticsRoutes from './analytics.js';
import uploadsRoutes from './uploads.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/posts', postRoutes);
router.use('/categories', categoryRoutes);
router.use('/comments', commentRoutes);
router.use('/subscribers', subscriberRoutes);
router.use('/profile', profileRoutes);
router.use('/settings', settingsRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/uploads', uploadsRoutes);

export default router;
