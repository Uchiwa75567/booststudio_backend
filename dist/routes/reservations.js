"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reservationController_1 = require("../controllers/reservationController");
const router = express_1.default.Router();
// POST /api/reservations - Create new reservation
router.post('/', reservationController_1.createReservation);
// GET /api/reservations - Get all reservations
router.get('/', reservationController_1.getAllReservations);
// GET /api/reservations/:id - Get reservation by ID
router.get('/:id', reservationController_1.getReservationById);
exports.default = router;
