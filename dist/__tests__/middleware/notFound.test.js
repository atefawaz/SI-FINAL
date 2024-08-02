"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notFound_1 = __importDefault(require("../../middleware/notFound"));
describe('Not Found Middleware', () => {
    let req;
    let res;
    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });
    it('should return 404 with error message "Not Found"', () => {
        (0, notFound_1.default)(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            error: {
                message: 'Not Found',
            },
        });
    });
});
//# sourceMappingURL=notFound.test.js.map