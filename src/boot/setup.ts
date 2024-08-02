import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import session from 'express-session';
import morgan from 'morgan';
import { logger } from '../middleware/winston';
import notFound from '../middleware/notFound';
import healthCheck from '../middleware/healthCheck';
import verifyToken from '../middleware/authentication';
import validator from '../middleware/validator';

import authRoutes from '../routes/auth.routes';
import messageRoutes from '../routes/messages.routes';
import usersRoutes from '../routes/users.routes';
import profileRoutes from '../routes/profile.routes';
import moviesRoutes from '../routes/movies.routes';
import ratingRoutes from '../routes/rating.routes';
import commentsRoutes from '../routes/comments.routes';

const PORT = process.env.PORT || 8080;
const app = express();

const connectDB = async () => {
  try {
    logger.info('Attempting to connect to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI as string);
    logger.info('MongoDB Connected');
  } catch (error) {
    logger.error('Error connecting to DB: ' + error.message);
    process.exit(1); // Exit process with failure
  }
};

// Middleware registration
const registerCoreMiddleWare = () => {
  try {
    app.use(
      session({
        secret: process.env.SESSION_SECRET as string,
        resave: false,
        saveUninitialized: true,
        cookie: {
          secure: false,
          httpOnly: true,
        },
      })
    );

    app.use(
      morgan('combined', {
        stream: { write: (message: string) => logger.info(message.trim()) },
      })
    );
    app.use(express.json());
    app.use(cors({}));
    app.use(helmet());

    app.use(validator);
    app.use(healthCheck);

    app.use('/auth', authRoutes);
    app.use('/users', usersRoutes);
    app.use('/messages', verifyToken, messageRoutes);
    app.use('/profile', verifyToken, profileRoutes);
    app.use('/movies', verifyToken, moviesRoutes);
    app.use('/ratings', verifyToken, ratingRoutes);
    app.use('/comments', verifyToken, commentsRoutes);

    app.use(notFound);

    logger.http('Done registering all middlewares');
  } catch (err) {
    logger.error(
      'Error thrown while executing registerCoreMiddleWare: ' + err.message
    );
    process.exit(1);
  }
};

// Uncaught exception handling
const handleError = () => {
  process.on('uncaughtException', (err) => {
    logger.error(`UNCAUGHT_EXCEPTION OCCURRED: ${err.stack}`);
    process.exit(1); // Exit process with failure
  });
};

// Start application
export const startApp = async () => {
  try {
    await connectDB(); // Ensure DB is connected before starting the app
    registerCoreMiddleWare();

    app.listen(PORT, () => {
      logger.info('Listening on 127.0.0.1:' + PORT);
    });

    handleError();
  } catch (err) {
    logger.error(
      `startup :: Error while booting the application: ${err.message}`
    );
    throw err;
  }
};
