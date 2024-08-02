import { Pool } from 'pg';
import { logger } from '../../middleware/winston';

const db_config = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5454,
  max: 10,
};

const pool = new Pool(db_config);

pool.on('connect', () => {
  logger.info('PostgreSQL Connected');
});

pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export default pool;
