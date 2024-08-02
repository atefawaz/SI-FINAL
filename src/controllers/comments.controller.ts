import { Request, Response } from 'express';
import { logger } from '../middleware/winston';
import { badRequest, success, queryError } from '../constants/statusCodes';
import commentModel from '../models/commentModel';

export const addComment = async (req: Request, res: Response) => {
  const { movie_id } = req.params;
  const { rating, username, comment, title } = req.body;

  let movieId = parseInt(movie_id);

  if (
    !movie_id ||
    isNaN(movieId) ||
    !rating ||
    !username ||
    !comment ||
    !title
  ) {
    return res.status(badRequest).json({ message: 'Missing parameters' });
  }

  try {
    const commentObj = new commentModel({
      movie_id: movieId,
      rating,
      username,
      comment,
      title,
    });

    await commentObj.save();

    return res.status(success).json({ message: 'Comment added' });
  } catch (error) {
    logger.error(error.stack);
    return res
      .status(queryError)
      .json({ error: 'Exception occurred while adding comment' });
  }
};

export const getCommentsById = async (req: Request, res: Response) => {
  const { movie_id } = req.params;

  let movieId = parseInt(movie_id);

  if (!movie_id || isNaN(movieId)) {
    return res.status(badRequest).json({ message: 'movie id missing' });
  }

  try {
    const comments = await commentModel.find({ movie_id: movieId });
    return res.status(success).json({ comments });
  } catch (error) {
    logger.error(error.stack);
    return res
      .status(queryError)
      .json({ error: 'Exception occurred while fetching comments' });
  }
};
