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
exports.logout = exports.editPassword = void 0;
const db_connect_1 = __importDefault(require("../boot/database/db_connect"));
const winston_1 = require("../middleware/winston");
const statusCodes_1 = require("../constants/statusCodes");
const editPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        return res.status(statusCodes_1.badRequest).json({ message: 'Missing parameters' });
    }
    if (oldPassword === newPassword) {
        return res
            .status(statusCodes_1.badRequest)
            .json({ message: 'New password cannot be equal to old password' });
    }
    try {
        const result = yield db_connect_1.default.query('SELECT * FROM users WHERE email = $1 AND password = crypt($2, password);', [req.user.email, oldPassword]);
        if (result.rowCount === 0) {
            return res.status(statusCodes_1.badRequest).json({ message: 'Incorrect password' });
        }
        yield db_connect_1.default.query("UPDATE users SET password = crypt($1, gen_salt('bf')) WHERE email = $2;", [newPassword, req.user.email]);
        return res.status(statusCodes_1.success).json({ message: 'Password updated' });
    }
    catch (error) {
        winston_1.logger.error('Error during password update process: ', error.stack);
        return res
            .status(statusCodes_1.queryError)
            .json({ error: 'Exception occurred while updating password' });
    }
});
exports.editPassword = editPassword;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session.user) {
        delete req.session.user;
    }
    return res.status(statusCodes_1.success).json({ message: 'Disconnected' });
});
exports.logout = logout;
//# sourceMappingURL=profile.controller.js.map