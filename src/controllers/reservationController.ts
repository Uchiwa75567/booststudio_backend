import { Request, Response } from 'express';
import { Reservation } from '../models/Reservation';

// Create new reservation
export const createReservation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, phone, serviceType, location, duration, dateTime, comments } = req.body;

    // Validate required fields
    if (!fullName || !phone || !serviceType || !location || !duration || !dateTime) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
      return;
    }

    // Validate types and allowed values to avoid runtime errors
    const baseRates: Record<string, number> = {
      studio: 25000,
      clip_video: 35000,
      photographie: 30000,
      evenement: 40000
    };

    const locationMultipliers: Record<string, number> = {
      studio: 1,
      exterieur: 1.2,
      domicile: 1.3
    };

    if (!baseRates[serviceType]) {
      res.status(400).json({ success: false, message: `Invalid serviceType: ${serviceType}` });
      return;
    }

    if (!locationMultipliers[location]) {
      res.status(400).json({ success: false, message: `Invalid location: ${location}` });
      return;
    }

    const numericDuration = Number(duration);
    if (Number.isNaN(numericDuration) || numericDuration <= 0) {
      res.status(400).json({ success: false, message: `Invalid duration: ${duration}` });
      return;
    }

    // Create reservation
    const reservation = await Reservation.create({
      id: `RES-${Date.now()}`,
      fullName,
      phone,
      serviceType,
      location,
      duration: numericDuration,
      dateTime,
      comments: comments || '',
      status: 'pending'
    });

    // Calculate price
    const total = baseRates[serviceType] * numericDuration * locationMultipliers[location];

    res.status(201).json({
      success: true,
      message: 'Réservation créée avec succès',
      data: {
        reservation,
        pricing: {
          baseRate: baseRates[serviceType],
          duration,
          locationMultiplier: locationMultipliers[location],
          total
        }
      }
    });
  } catch (error: any) {
    console.error('Error creating reservation:', error?.stack || error);
    const message = process.env.NODE_ENV === 'development' ? (error?.message || String(error)) : 'Erreur lors de la création de la réservation';
    res.status(500).json({
      success: false,
      message
    });
  }
};

// Get all reservations
export const getAllReservations = async (req: Request, res: Response): Promise<void> => {
  try {
    const reservations = await Reservation.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json({
      success: true,
      data: reservations,
      count: reservations.length
    });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des réservations'
    });
  }
};

// Get reservation by ID
export const getReservationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findByPk(id);

    if (!reservation) {
      res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
      return;
    }

    res.json({
      success: true,
      data: reservation
    });
  } catch (error) {
    console.error('Error fetching reservation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la réservation'
    });
  }
};

// Update reservation status
export const updateReservationStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      res.status(400).json({
        success: false,
        message: 'Statut invalide'
      });
      return;
    }

    const reservation = await Reservation.findByPk(id);

    if (!reservation) {
      res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
      return;
    }

    await reservation.update({ status });

    res.json({
      success: true,
      message: 'Statut mis à jour avec succès',
      data: reservation
    });
  } catch (error) {
    console.error('Error updating reservation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la réservation'
    });
  }
};

// Delete reservation
export const deleteReservation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findByPk(id);

    if (!reservation) {
      res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
      return;
    }

    await reservation.destroy();

    res.json({
      success: true,
      message: 'Réservation supprimée avec succès'
    });
  } catch (error) {
    console.error('Error deleting reservation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la réservation'
    });
  }
};