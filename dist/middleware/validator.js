"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("./winston");
const statusCodes_1 = require("../constants/statusCodes");
const validator = (req, res, next) => {
    if (req.body.creation_date) {
        delete req.body.creation_date;
    }
    const creationDate = new Date().toJSON().slice(0, 10);
    req.body.creation_date = creationDate;
    try {
        for (const [key, value] of Object.entries(req.body)) {
            if (value === '') {
                req.body[key] = null;
            }
        }
        next();
    }
    catch (error) {
        winston_1.logger.error(error);
        res.status(statusCodes_1.badRequest).json({ error: 'Bad request' });
    }
};
exports.default = validator;
//# sourceMappingURL=validator.js.map