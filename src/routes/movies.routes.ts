import express from 'express';
import * as movieServices from '../controllers/movies.controller';

const router = express.Router();

router.get('/', movieServices.getMovies);
router.get('/top', movieServices.getTopRatedMovies);
router.get('/me', movieServices.getSeenMovies);

export default router;
