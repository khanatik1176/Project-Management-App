import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";

export const createWorkSpaceController = asyncHandler (async (req:Request, res:Response) => {

    const body = req.body;

    

    return res.status(201).json({
        message: "Workspace created successfully",
    });
});