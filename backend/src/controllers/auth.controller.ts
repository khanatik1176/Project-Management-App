import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { config } from "../config/app.config";


export const googleLoginCallback = asyncHandler(async (req :Request, res: Response) => {

    const currentWorkplace = req.user?.currentWorkplace

    if(!currentWorkplace)
    {
        return res.redirect(`${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`);
    }

    return res.redirect(`${config.FRONTEND_ORIGIN}/workspace/${currentWorkplace}`)

})