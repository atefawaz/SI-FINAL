"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const statusCodes_1 = require("../constants/statusCodes");
const winston_1 = require("../middleware/winston");
const db_connect_1 = __importDefault(require("../boot/database/db_connect"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, username, password, country, city, street } = req.body;
    if (!email || !username || !password || !country) {
        return res.status(statusCodes_1.badRequest).json({ message: 'Missing parameters' });
    }
    const client = yield db_connect_1.default.connect();
    try {
        const result = yield client.query('SELECT * FROM users WHERE email = $1;', [
            email,
        ]);
        if (result.rowCount > 0) {
            return res
                .status(statusCodes_1.userAlreadyExists)
                .json({ message: 'User already has an account' });
        }
        const hashedPassword = bcrypt_1.default.hashSync(password, 10);
        yield client.query('BEGIN');
        const addedUser = yield client.query(`INSERT INTO users(email, username, password, creation_date)
       VALUES ($1, $2, $3, NOW()) RETURNING id;`, [email, username, hashedPassword]);
        winston_1.logger.info('USER ADDED', addedUser.rowCount);
        const address = yield client.query(`INSERT INTO addresses(email, country, street, city) VALUES ($1, $2, $3, $4);`, [email, country, street, city]);
        winston_1.logger.info('ADDRESS ADDED', address.rowCount);
        yield client.query('COMMIT');
        return res.status(statusCodes_1.success).json({ message: 'User created' });
    }
    catch (error) {
        yield client.query('ROLLBACK');
        winston_1.logger.error('Error during registration process: ', error.stack);
        return res.status(statusCodes_1.queryError).json({
            message: 'Exception occurred while registering',
            error: error.message,
        });
    }
    finally {
        client.release();
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(statusCodes_1.badRequest).json({ message: 'Missing parameters' });
    }
    try {
        const result = yield db_connect_1.default.query('SELECT * FROM users WHERE email = $1;', [
            email,
        ]);
        if (result.rowCount === 0) {
            return res.status(statusCodes_1.notFound).json({ message: 'Incorrect email/password' });
        }
        const user = result.rows[0];
        const isPasswordValid = bcrypt_1.default.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(statusCodes_1.notFound).json({ message: 'Incorrect email/password' });
        }
        req.session.user = {
            _id: user.id,
            email: user.email,
        };
        const token = jsonwebtoken_1.default.sign({ user: { email: user.email } }, process.env.JWT_SECRET_KEY, {
            expiresIn: '1h',
        });
        return res.status(statusCodes_1.success).json({ token, username: user.username });
    }
    catch (err) {
        winston_1.logger.error('Error during login process: ', err.stack);
        return res
            .status(statusCodes_1.queryError)
            .json({ error: 'Exception occurred while logging in' });
    }
});
exports.login = login;
//# sourceMappingURL=users.controller.js.map