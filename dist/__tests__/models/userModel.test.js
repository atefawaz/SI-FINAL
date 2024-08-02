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
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const userModel_1 = __importDefault(require("../../models/userModel"));
let mongoServer;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    yield mongoose_1.default.connect(uri);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.disconnect();
    yield mongoServer.stop();
}));
describe('User Model', () => {
    it('should create a user successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = new userModel_1.default({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',
        });
        const savedUser = yield user.save();
        expect(savedUser._id).toBeDefined();
        expect(savedUser.username).toBe('testuser');
        expect(savedUser.email).toBe('testuser@example.com');
    }));
    it('should throw validation error for missing required fields', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = new userModel_1.default({});
        let err;
        try {
            yield user.save();
        }
        catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose_1.default.Error.ValidationError);
        expect(err.errors.email).toBeDefined();
        expect(err.errors.password).toBeDefined();
    }));
    it('should enforce unique constraint on email', () => __awaiter(void 0, void 0, void 0, function* () {
        const user1 = new userModel_1.default({
            username: 'user1',
            email: 'unique@example.com',
            password: 'password123',
        });
        yield user1.save();
        const user2 = new userModel_1.default({
            username: 'user2',
            email: 'unique@example.com',
            password: 'password456',
        });
        let err;
        try {
            yield user2.save();
        }
        catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose_1.default.Error);
        expect(err.code).toBe(11000);
    }));
});
//# sourceMappingURL=userModel.test.js.map