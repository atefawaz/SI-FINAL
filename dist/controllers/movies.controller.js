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
exports.getSeenMovies = exports.getTopRatedMovies = exports.getMovies = void 0;
const db_connect_1 = __importDefault(require("../boot/database/db_connect"));
const winston_1 = require("../middleware/winston");
const statusCodes_1 = require("../constants/statusCodes");
const getMovies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category } = req.query;
    if (category) {
        const result = yield getMoviesByCategory(category);
        return res.status(statusCodes_1.success).json({ movies: result });
    }
    else {
        try {
            const movies = yield db_connect_1.default.query('SELECT * FROM movies GROUP BY type, movie_id;');
            const groupedMovies = movies.rows.reduce((acc, movie) => {
                const { type } = movie;
                if (!acc[type]) {
                    acc[type] = [];
                }
                acc[type].push(movie);
                return acc;
            }, {});
            return res.status(statusCodes_1.success).json({ movies: groupedMovies });
        }
        catch (error) {
            winston_1.logger.error(error.stack);
            return res
                .status(statusCodes_1.queryError)
                .json({ error: 'Exception occurred while fetching movies' });
        }
    }
});
exports.getMovies = getMovies;
const getMoviesByCategory = (category) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movies = yield db_connect_1.default.query('SELECT * FROM movies WHERE type = $1 ORDER BY release_date DESC;', [category]);
        return movies.rows;
    }
    catch (error) {
        winston_1.logger.error(error.stack);
    }
});
const getTopRatedMovies = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movies = yield db_connect_1.default.query('SELECT * FROM movies ORDER BY rating DESC LIMIT 10;');
        res.status(statusCodes_1.success).json({ movies: movies.rows });
    }
    catch (error) {
        winston_1.logger.error(error.stack);
        res
            .status(statusCodes_1.queryError)
            .json({ error: 'Exception occurred while fetching top rated movies' });
    }
});
exports.getTopRatedMovies = getTopRatedMovies;
const getSeenMovies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const movies = yield db_connect_1.default.query('SELECT * FROM seen_movies S JOIN movies M ON S.movie_id = M.movie_id WHERE email = $1;', [req.user.email]);
        res.status(statusCodes_1.success).json({ movies: movies.rows });
    }
    catch (error) {
        winston_1.logger.error(error.stack);
        res
            .status(statusCodes_1.queryError)
            .json({ error: 'Exception occurred while fetching seen movies' });
    }
});
exports.getSeenMovies = getSeenMovies;
//# sourceMappingURL=movies.controller.js.map