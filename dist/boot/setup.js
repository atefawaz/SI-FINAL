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
exports.startApp = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_session_1 = __importDefault(require("express-session"));
const morgan_1 = __importDefault(require("morgan"));
const winston_1 = require("../middleware/winston");
const notFound_1 = __importDefault(require("../middleware/notFound"));
const healthCheck_1 = __importDefault(require("../middleware/healthCheck"));
const authentication_1 = __importDefault(require("../middleware/authentication"));
const validator_1 = __importDefault(require("../middleware/validator"));
const auth_routes_1 = __importDefault(require("../routes/auth.routes"));
const messages_routes_1 = __importDefault(require("../routes/messages.routes"));
const users_routes_1 = __importDefault(require("../routes/users.routes"));
const profile_routes_1 = __importDefault(require("../routes/profile.routes"));
const movies_routes_1 = __importDefault(require("../routes/movies.routes"));
const rating_routes_1 = __importDefault(require("../routes/rating.routes"));
const comments_routes_1 = __importDefault(require("../routes/comments.routes"));
const PORT = process.env.PORT || 8080;
const app = (0, express_1.default)();
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        winston_1.logger.info('Attempting to connect to MongoDB...');
        yield mongoose_1.default.connect(process.env.MONGODB_URI);
        winston_1.logger.info('MongoDB Connected');
    }
    catch (error) {
        winston_1.logger.error('Error connecting to DB: ' + error.message);
        process.exit(1);
    }
});
const registerCoreMiddleWare = () => {
    try {
        app.use((0, express_session_1.default)({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: true,
            cookie: {
                secure: false,
                httpOnly: true,
            },
        }));
        app.use((0, morgan_1.default)('combined', {
            stream: { write: (message) => winston_1.logger.info(message.trim()) },
        }));
        app.use(express_1.default.json());
        app.use((0, cors_1.default)({}));
        app.use((0, helmet_1.default)());
        app.use(validator_1.default);
        app.use(healthCheck_1.default);
        app.use('/auth', auth_routes_1.default);
        app.use('/users', users_routes_1.default);
        app.use('/messages', authentication_1.default, messages_routes_1.default);
        app.use('/profile', authentication_1.default, profile_routes_1.default);
        app.use('/movies', authentication_1.default, movies_routes_1.default);
        app.use('/ratings', authentication_1.default, rating_routes_1.default);
        app.use('/comments', authentication_1.default, comments_routes_1.default);
        app.use(notFound_1.default);
        winston_1.logger.http('Done registering all middlewares');
    }
    catch (err) {
        winston_1.logger.error('Error thrown while executing registerCoreMiddleWare: ' + err.message);
        process.exit(1);
    }
};
const handleError = () => {
    process.on('uncaughtException', (err) => {
        winston_1.logger.error(`UNCAUGHT_EXCEPTION OCCURRED: ${err.stack}`);
        process.exit(1);
    });
};
const startApp = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connectDB();
        registerCoreMiddleWare();
        app.listen(PORT, () => {
            winston_1.logger.info('Listening on 127.0.0.1:' + PORT);
        });
        handleError();
    }
    catch (err) {
        winston_1.logger.error(`startup :: Error while booting the application: ${err.message}`);
        throw err;
    }
});
exports.startApp = startApp;
//# sourceMappingURL=setup.js.map