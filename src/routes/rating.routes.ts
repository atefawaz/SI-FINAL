import express from 'express';
import * as ratingService from '../controllers/rating.controller';

const router = express.Router();

router.post('/:movieId', ratingService.addRating);

export default router;
