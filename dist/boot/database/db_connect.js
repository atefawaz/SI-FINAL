"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const winston_1 = require("../../middleware/winston");
const db_config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5454,
    max: 10,
};
const pool = new pg_1.Pool(db_config);
pool.on('connect', () => {
    winston_1.logger.info('PostgreSQL Connected');
});
pool.on('error', (err) => {
    winston_1.logger.error('Unexpected error on idle client', err);
    process.exit(-1);
});
exports.default = pool;
//# sourceMappingURL=db_connect.js.map