import { Request, Response } from 'express';
import {
  queryError,
  notFound,
  success,
  badRequest,
  userAlreadyExists,
} from '../constants/statusCodes';
import { logger } from '../middleware/winston';
import pool from '../boot/database/db_connect';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req: Request, res: Response) => {
  const { email, username, password, country, city, street } = req.body;

  if (!email || !username || !password || !country) {
    return res.status(badRequest).json({ message: 'Missing parameters' });
  }

  const client = await pool.connect();

  try {
    const result = await client.query('SELECT * FROM users WHERE email = $1;', [
      email,
    ]);
    if (result.rowCount > 0) {
      return res
        .status(userAlreadyExists)
        .json({ message: 'User already has an account' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    await client.query('BEGIN');

    const addedUser = await client.query(
      `INSERT INTO users(email, username, password, creation_date)
       VALUES ($1, $2, $3, NOW()) RETURNING id;`,
      [email, username, hashedPassword]
    );
    logger.info('USER ADDED', addedUser.rowCount);

    const address = await client.query(
      `INSERT INTO addresses(email, country, street, city) VALUES ($1, $2, $3, $4);`,
      [email, country, street, city]
    );
    logger.info('ADDRESS ADDED', address.rowCount);

    await client.query('COMMIT');

    return res.status(success).json({ message: 'User created' });
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('Error during registration process: ', error.stack);
    return res.status(queryError).json({
      message: 'Exception occurred while registering',
      error: error.message,
    });
  } finally {
    client.release();
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(badRequest).json({ message: 'Missing parameters' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1;', [
      email,
    ]);

    if (result.rowCount === 0) {
      return res.status(notFound).json({ message: 'Incorrect email/password' });
    }

    const user = result.rows[0];
    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return res.status(notFound).json({ message: 'Incorrect email/password' });
    }

    req.session.user = {
      _id: user.id,
      email: user.email,
    };

    const token = jwt.sign(
      { user: { email: user.email } },
      process.env.JWT_SECRET_KEY as string,
      {
        expiresIn: '1h',
      }
    );

    return res.status(success).json({ token, username: user.username });
  } catch (err) {
    logger.error('Error during login process: ', err.stack);
    return res
      .status(queryError)
      .json({ error: 'Exception occurred while logging in' });
  }
};
