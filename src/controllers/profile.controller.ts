import { Request, Response } from 'express';
import pool from '../boot/database/db_connect';
import { logger } from '../middleware/winston';
import { badRequest, success, queryError } from '../constants/statusCodes';

export const editPassword = async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(badRequest).json({ message: 'Missing parameters' });
  }

  if (oldPassword === newPassword) {
    return res
      .status(badRequest)
      .json({ message: 'New password cannot be equal to old password' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND password = crypt($2, password);',
      [req.user.email, oldPassword]
    );

    if (result.rowCount === 0) {
      return res.status(badRequest).json({ message: 'Incorrect password' });
    }

    await pool.query(
      "UPDATE users SET password = crypt($1, gen_salt('bf')) WHERE email = $2;",
      [newPassword, req.user.email]
    );

    return res.status(success).json({ message: 'Password updated' });
  } catch (error) {
    logger.error('Error during password update process: ', error.stack);
    return res
      .status(queryError)
      .json({ error: 'Exception occurred while updating password' });
  }
};

export const logout = async (req: Request, res: Response) => {
  if (req.session.user) {
    delete req.session.user;
  }

  return res.status(success).json({ message: 'Disconnected' });
};
