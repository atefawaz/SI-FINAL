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
exports.logout = exports.getUser = exports.signin = exports.signup = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    if (!username || !password || !email) {
        return res.status(400).json({ error: 'missing information' });
    }
    const hash = bcrypt_1.default.hashSync(password, 10);
    try {
        const user = new userModel_1.default({
            email,
            username,
            password: hash,
        });
        const savedUser = yield user.save();
        return res.status(200).json(savedUser);
    }
    catch (error) {
        return res.status(500).json({ message: 'failed to save user' });
    }
});
exports.signup = signup;
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'missing information' });
    }
    try {
        const user = yield userModel_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        if (!bcrypt_1.default.compareSync(password, user.password)) {
            return res.status(400).json({ message: "Email or password don't match" });
        }
        req.session.user = {
            _id: user._id.toString(),
            email: user.email,
        };
        const token = jsonwebtoken_1.default.sign({ user: { id: user._id, email: user.email } }, process.env.JWT_SECRET_KEY, {
            expiresIn: '1h',
        });
        return res.status(200).json({ token });
    }
    catch (error) {
        console.log('Error while getting user from DB', error.message);
        return res.status(500).json({ error: 'Failed to get user' });
    }
});
exports.signin = signin;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.session.user) {
        return res.status(500).json({ error: 'You are not authenticated' });
    }
    try {
        const user = yield userModel_1.default
            .findById(req.session.user._id, {
            password: 0,
        })
            .populate('messages');
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        return res.status(200).json(user);
    }
    catch (error) {
        console.log('Error while getting user from DB', error.message);
        return res.status(500).json({ error: 'Failed to get user' });
    }
});
exports.getUser = getUser;
const logout = (req, res) => {
    if (req.session.user) {
        delete req.session.user;
    }
    return res.status(200).json({ message: 'Disconnected' });
};
exports.logout = logout;
//# sourceMappingURL=auth.controller.js.map