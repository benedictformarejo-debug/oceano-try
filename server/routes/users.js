import express from 'express';
import { getAllUsers, updateUserRole, updateUserStatus } from '../controllers/usersController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/',                authenticateToken, getAllUsers);
router.patch('/:id/role',      authenticateToken, updateUserRole);
router.patch('/:id/status',    authenticateToken, updateUserStatus);

export default router;