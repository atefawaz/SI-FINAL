import { Request, Response } from 'express';
export declare const getMessages: (_req: Request, res: Response) => Promise<any>;
export declare const getMessageById: (req: Request, res: Response) => Promise<any>;
export declare const addMessage: (req: Request, res: Response) => Promise<any>;
export declare const editMessage: (req: Request, res: Response) => Promise<any>;
export declare const deleteMessage: (req: Request, res: Response) => Promise<any>;
