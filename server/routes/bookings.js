import express from 'express';
import { createBooking, getUserBookings, getAllBookings } from '../controllers/bookingController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, createBooking);
router.get('/user', authenticateToken, getUserBookings);
router.get('/all', authenticateToken, getAllBookings);

export default router;
