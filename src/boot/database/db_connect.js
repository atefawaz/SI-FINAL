const pg = require('pg');
const parse = require('pg-connection-string').parse;
const logger = require('../../middleware/winston');
require('dotenv').config();

const db_config = parse(process.env.DATABASE_URL);

db_config.max = 10; // Set the max pool size if needed

let db_connection;

function startConnection() {
  // type parsers here
  pg.types.setTypeParser(1082, function (stringValue) {
    return stringValue; // 1082 is for date type
  });

  db_connection = new pg.Pool(db_config);

  db_connection.connect((err) => {
    if (!err) {
      logger.info('PostgreSQL Connected');
    } else {
      logger.error('PostgreSQL Connection Failed', err);
    }
  });

  db_connection.on('error', (err) => {
    logger.error('Unexpected error on idle client', err);
    startConnection();
  });
}

startConnection();

module.exports = db_connection;
