require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const session = require('express-session');
const morgan = require('morgan');
const logger = require('../middleware/winston');
const notFound = require('../middleware/notFound');
const healthCheck = require('../middleware/healthCheck');
const verifyToken = require('../middleware/authentication');
const validator = require('../middleware/validator');

const authRoutes = require('../routes/auth.routes');
const messageRoutes = require('../routes/messages.routes');
const usersRoutes = require('../routes/users.routes');
const profileRoutes = require('../routes/profile.routes');
const moviesRoutes = require('../routes/movies.routes');
const ratingRoutes = require('../routes/rating.routes');
const commentsRoutes = require('../routes/comments.routes');

const PORT = process.env.PORT || 8080;
const app = express();

const connectDB = async () => {
  try {
    logger.info('Attempting to connect to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
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
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
          secure: false,
          httpOnly: true,
        },
      })
    );

    app.use(morgan('combined', { stream: logger.stream }));
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
const startApp = async () => {
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

module.exports = { startApp };
