import express from 'express';
import { createReview, getReviewsByRoom, getUserReviews, getAllReviews, deleteReview } from '../controllers/reviewsController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/',              authenticateToken, createReview);
router.get('/room/:roomId',   getReviewsByRoom);
router.get('/user',           authenticateToken, getUserReviews);
router.get('/all',            authenticateToken, getAllReviews);
router.delete('/:id',         authenticateToken, deleteReview);

export default router;