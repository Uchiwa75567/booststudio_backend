import express from 'express';
import multer from 'multer';
import { login, logout, getDashboardStats } from '../controllers/adminController';
import { uploadMedia, getAllMedia, updateMedia, deleteMedia } from '../controllers/mediaController';
import { getAllReservations, updateReservationStatus, deleteReservation } from '../controllers/reservationController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Auth routes (no auth required)
router.post('/login', login);

// Protected routes (auth required)
router.post('/logout', authMiddleware, logout);
router.get('/dashboard/stats', authMiddleware, getDashboardStats);

// Reservation management
router.get('/reservations', authMiddleware, getAllReservations);
router.patch('/reservations/:id/status', authMiddleware, updateReservationStatus);
router.delete('/reservations/:id', authMiddleware, deleteReservation);

// Media management
router.get('/media', authMiddleware, getAllMedia);
router.post('/media', authMiddleware, upload.single('file'), uploadMedia);
router.patch('/media/:id', authMiddleware, updateMedia);
router.delete('/media/:id', authMiddleware, deleteMedia);

export default router;