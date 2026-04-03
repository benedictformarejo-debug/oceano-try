import express from 'express';
import { getAllRooms, getRoomById, updateRoom } from '../controllers/roomController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/',         getAllRooms);
router.get('/:id',      getRoomById);
router.patch('/:id',    authenticateToken, updateRoom);

export default router;