"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReservationById = exports.getAllReservations = exports.createReservation = void 0;
const Reservation_1 = require("../models/Reservation");
// Create new reservation
const createReservation = async (req, res) => {
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
        const baseRates = {
            studio: 25000,
            clip_video: 35000,
            photographie: 30000,
            evenement: 40000
        };
        const locationMultipliers = {
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
        const reservation = await Reservation_1.Reservation.create({
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
    }
    catch (error) {
        console.error('Error creating reservation:', error?.stack || error);
        const message = process.env.NODE_ENV === 'development' ? (error?.message || String(error)) : 'Erreur lors de la création de la réservation';
        res.status(500).json({
            success: false,
            message
        });
    }
};
exports.createReservation = createReservation;
// Get all reservations
const getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation_1.Reservation.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json({
            success: true,
            data: reservations,
            count: reservations.length
        });
    }
    catch (error) {
        console.error('Error fetching reservations:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des réservations'
        });
    }
};
exports.getAllReservations = getAllReservations;
// Get reservation by ID
const getReservationById = async (req, res) => {
    try {
        const { id } = req.params;
        const reservation = await Reservation_1.Reservation.findByPk(id);
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
    }
    catch (error) {
        console.error('Error fetching reservation:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération de la réservation'
        });
    }
};
exports.getReservationById = getReservationById;
