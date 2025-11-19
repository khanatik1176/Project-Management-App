import { NextFunction, Request, Response } from "express";


type asyncControllerType = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export const asyncHandler = (controller: asyncControllerType): asyncControllerType => {

    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await controller(req, res, next);
        } catch (error) {
            next(error);
        }
    };

};