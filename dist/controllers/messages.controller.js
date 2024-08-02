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
exports.deleteMessage = exports.editMessage = exports.addMessage = exports.getMessageById = exports.getMessages = void 0;
const messageModel_1 = __importDefault(require("../models/messageModel"));
const statusCodes_1 = require("../constants/statusCodes");
const getMessages = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const messages = yield messageModel_1.default.find({});
    return res.status(statusCodes_1.success).json(messages);
});
exports.getMessages = getMessages;
const getMessageById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { messageId } = req.params;
    try {
        const message = yield messageModel_1.default.findById(messageId);
        return res.status(statusCodes_1.success).json(message);
    }
    catch (error) {
        console.log('Error while getting message from DB', error.message);
        return res
            .status(statusCodes_1.queryError)
            .json({ error: 'Error while getting message' });
    }
});
exports.getMessageById = getMessageById;
const addMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { message } = req.body;
    if (!message || !message.name) {
        return res.status(statusCodes_1.badRequest).json({ error: 'missing information' });
    }
    if (!req.session.user) {
        return res.status(statusCodes_1.queryError).json({ error: 'You are not authenticated' });
    }
    message.user = req.session.user._id;
    try {
        const messageObj = new messageModel_1.default(message);
        yield messageObj.save();
        return res.status(statusCodes_1.success).json(messageObj);
    }
    catch (error) {
        console.log('Error while adding message to DB', error.message);
        return res.status(statusCodes_1.queryError).json({ error: 'Failed to add message' });
    }
});
exports.addMessage = addMessage;
const editMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const { messageId } = req.params;
    if (!name || !messageId)
        return res.status(statusCodes_1.badRequest).json({ error: 'missing information' });
    try {
        const message = yield messageModel_1.default.findByIdAndUpdate(messageId, { name }, { new: true });
        return res.status(statusCodes_1.success).json(message);
    }
    catch (error) {
        console.log('Error while updating message', error.message);
        return res.status(statusCodes_1.queryError).json({ error: 'Failed to update message' });
    }
});
exports.editMessage = editMessage;
const deleteMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { messageId } = req.params;
    if (!messageId)
        return res.status(statusCodes_1.badRequest).json({ error: 'missing information' });
    try {
        yield messageModel_1.default.findByIdAndDelete(messageId);
        return res.status(statusCodes_1.success).json({ message: 'Message deleted' });
    }
    catch (error) {
        console.log('Error while deleting message', error.message);
        return res.status(statusCodes_1.queryError).json({ error: 'Failed to delete message' });
    }
});
exports.deleteMessage = deleteMessage;
//# sourceMappingURL=messages.controller.js.map