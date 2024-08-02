import { Request, Response } from 'express';
export declare const signup: (req: Request, res: Response) => Promise<any>;
export declare const signin: (req: Request, res: Response) => Promise<any>;
export declare const getUser: (req: Request, res: Response) => Promise<any>;
export declare const logout: (req: Request, res: Response) => any;
