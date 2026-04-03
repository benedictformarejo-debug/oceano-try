import express from 'express';
import {
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
  getBookedDates,
  getBookingByRef,
  cancelBookingByRef,
  modifyBooking,
} from '../controllers/bookingController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/',                        createBooking);
router.get('/user',                     authenticateToken, getUserBookings);
router.get('/all',                      authenticateToken, getAllBookings);
router.patch('/:id/status',             authenticateToken, updateBookingStatus);
router.delete('/:id',                   authenticateToken, deleteBooking);
router.get('/booked-dates/:roomId',     getBookedDates);
router.get('/manage',  getBookingByRef);
router.post('/cancel', cancelBookingByRef);
router.patch('/:id/modify', authenticateToken, modifyBooking);

export default router;