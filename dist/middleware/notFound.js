"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (_req, res) => {
    const err = new Error('Not Found');
    res.status(404).json({
        error: {
            message: err.message,
        },
    });
};
//# sourceMappingURL=notFound.js.map