import { Request, Response } from 'express';
export declare const getMovies: (req: Request, res: Response) => Promise<any>;
export declare const getTopRatedMovies: (_req: Request, res: Response) => Promise<void>;
export declare const getSeenMovies: (req: Request, res: Response) => Promise<void>;
