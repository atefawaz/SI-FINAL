import { Request, Response } from 'express';
import messageModel from '../models/messageModel';
import { success, badRequest, queryError } from '../constants/statusCodes';

export const getMessages = async (_req: Request, res: Response) => {
  const messages = await messageModel.find({});
  return res.status(success).json(messages);
};

export const getMessageById = async (req: Request, res: Response) => {
  const { messageId } = req.params;

  try {
    const message = await messageModel.findById(messageId);
    return res.status(success).json(message);
  } catch (error) {
    console.log(
      'Error while getting message from DB',
      (error as Error).message
    );
    return res
      .status(queryError)
      .json({ error: 'Error while getting message' });
  }
};

export const addMessage = async (req: Request, res: Response) => {
  const { message } = req.body;

  if (!message || !message.name) {
    return res.status(badRequest).json({ error: 'missing information' });
  }

  if (!req.session.user) {
    return res.status(queryError).json({ error: 'You are not authenticated' });
  }

  message.user = req.session.user._id;

  try {
    const messageObj = new messageModel(message);
    await messageObj.save();
    return res.status(success).json(messageObj);
  } catch (error) {
    console.log('Error while adding message to DB', (error as Error).message);
    return res.status(queryError).json({ error: 'Failed to add message' });
  }
};

export const editMessage = async (req: Request, res: Response) => {
  const { name } = req.body;
  const { messageId } = req.params;

  if (!name || !messageId)
    return res.status(badRequest).json({ error: 'missing information' });

  try {
    const message = await messageModel.findByIdAndUpdate(
      messageId,
      { name },
      { new: true }
    );
    return res.status(success).json(message);
  } catch (error) {
    console.log('Error while updating message', (error as Error).message);
    return res.status(queryError).json({ error: 'Failed to update message' });
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  const { messageId } = req.params;

  if (!messageId)
    return res.status(badRequest).json({ error: 'missing information' });

  try {
    await messageModel.findByIdAndDelete(messageId);
    return res.status(success).json({ message: 'Message deleted' });
  } catch (error) {
    console.log('Error while deleting message', (error as Error).message);
    return res.status(queryError).json({ error: 'Failed to delete message' });
  }
};
