import { Request, Response } from 'express';
import pool from '../boot/database/db_connect';
import { logger } from '../middleware/winston';
import { badRequest, success, queryError } from '../constants/statusCodes';
import ratingModel from '../models/ratingModel';

export const addRating = async (req: Request, res: Response) => {
  const { movieId } = req.params;
  const { rating } = req.body;

  let movie_id = parseInt(movieId);

  if (isNaN(movie_id) || !rating) {
    return res.status(badRequest).json({ message: 'Missing parameters' });
  }

  try {
    const ratingObj = new ratingModel({
      email: req.user.email,
      movie_id,
      rating, // equivalent of rating: rating
    });

    await ratingObj.save();

    const ratings = await ratingModel.find({}, { rating });

    const averageRating = ratings.reduce(
      (acc, rating) => acc + rating.rating,
      0
    );

    await pool.query('UPDATE movies SET rating = $1 WHERE movie_id = $2;', [
      averageRating,
      movie_id,
    ]);

    return res.status(success).json({ message: 'Rating added' });
  } catch (error) {
    logger.error(error.stack);
    return res
      .status(queryError)
      .json({ error: 'Exception occurred while adding rating' });
  }
};
