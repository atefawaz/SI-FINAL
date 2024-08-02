import { Request, Response } from 'express';
import pool from '../boot/database/db_connect';
import { logger } from '../middleware/winston';
import { success, queryError } from '../constants/statusCodes';

export const getMovies = async (req: Request, res: Response) => {
  const { category } = req.query;

  if (category) {
    const result = await getMoviesByCategory(category as string);
    return res.status(success).json({ movies: result });
  } else {
    try {
      const movies = await pool.query(
        'SELECT * FROM movies GROUP BY type, movie_id;'
      );

      const groupedMovies = movies.rows.reduce((acc: any, movie: any) => {
        const { type } = movie;
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push(movie);
        return acc;
      }, {});

      return res.status(success).json({ movies: groupedMovies });
    } catch (error) {
      logger.error(error.stack);
      return res
        .status(queryError)
        .json({ error: 'Exception occurred while fetching movies' });
    }
  }
};

const getMoviesByCategory = async (category: string) => {
  try {
    const movies = await pool.query(
      'SELECT * FROM movies WHERE type = $1 ORDER BY release_date DESC;',
      [category]
    );
    return movies.rows;
  } catch (error) {
    logger.error(error.stack);
  }
};

export const getTopRatedMovies = async (_req: Request, res: Response) => {
  try {
    const movies = await pool.query(
      'SELECT * FROM movies ORDER BY rating DESC LIMIT 10;'
    );
    res.status(success).json({ movies: movies.rows });
  } catch (error) {
    logger.error(error.stack);
    res
      .status(queryError)
      .json({ error: 'Exception occurred while fetching top rated movies' });
  }
};

export const getSeenMovies = async (req: Request, res: Response) => {
  try {
    const movies = await pool.query(
      'SELECT * FROM seen_movies S JOIN movies M ON S.movie_id = M.movie_id WHERE email = $1;',
      [req.user.email]
    );
    res.status(success).json({ movies: movies.rows });
  } catch (error) {
    logger.error(error.stack);
    res
      .status(queryError)
      .json({ error: 'Exception occurred while fetching seen movies' });
  }
};
