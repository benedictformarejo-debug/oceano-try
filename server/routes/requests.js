import express from 'express';
import { getAllRequests, createRequest, updateRequestStatus } from '../controllers/requestsController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/',             authenticateToken, getAllRequests);
router.post('/',            authenticateToken, createRequest);
router.patch('/:id/status', authenticateToken, updateRequestStatus);

export default router;