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
exports.getCommentsById = exports.addComment = void 0;
const winston_1 = require("../middleware/winston");
const statusCodes_1 = require("../constants/statusCodes");
const commentModel_1 = __importDefault(require("../models/commentModel"));
const addComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { movie_id } = req.params;
    const { rating, username, comment, title } = req.body;
    let movieId = parseInt(movie_id);
    if (!movie_id ||
        isNaN(movieId) ||
        !rating ||
        !username ||
        !comment ||
        !title) {
        return res.status(statusCodes_1.badRequest).json({ message: 'Missing parameters' });
    }
    try {
        const commentObj = new commentModel_1.default({
            movie_id: movieId,
            rating,
            username,
            comment,
            title,
        });
        yield commentObj.save();
        return res.status(statusCodes_1.success).json({ message: 'Comment added' });
    }
    catch (error) {
        winston_1.logger.error(error.stack);
        return res
            .status(statusCodes_1.queryError)
            .json({ error: 'Exception occurred while adding comment' });
    }
});
exports.addComment = addComment;
const getCommentsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { movie_id } = req.params;
    let movieId = parseInt(movie_id);
    if (!movie_id || isNaN(movieId)) {
        return res.status(statusCodes_1.badRequest).json({ message: 'movie id missing' });
    }
    try {
        const comments = yield commentModel_1.default.find({ movie_id: movieId });
        return res.status(statusCodes_1.success).json({ comments });
    }
    catch (error) {
        winston_1.logger.error(error.stack);
        return res
            .status(statusCodes_1.queryError)
            .json({ error: 'Exception occurred while fetching comments' });
    }
});
exports.getCommentsById = getCommentsById;
//# sourceMappingURL=comments.controller.js.map