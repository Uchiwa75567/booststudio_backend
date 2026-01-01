import express from 'express';
import { createReservation, getAllReservations, getReservationById, updateReservationStatus, deleteReservation } from '../controllers/reservationController';

const router = express.Router();

// POST /api/reservations - Create new reservation
router.post('/', createReservation);

// GET /api/reservations - Get all reservations
router.get('/', getAllReservations);

// GET /api/reservations/:id - Get reservation by ID
router.get('/:id', getReservationById);

// PATCH /api/reservations/:id/status - Update reservation status
router.patch('/:id/status', updateReservationStatus);

// DELETE /api/reservations/:id - Delete reservation
router.delete('/:id', deleteReservation);

export default router;