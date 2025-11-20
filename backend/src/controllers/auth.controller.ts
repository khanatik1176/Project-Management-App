import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { config } from "../config/app.config";
import { registerSchema } from "../validation/auth.validation";
import { HTTPSTATUS } from "../config/http.config";
import { registerUserService } from "../services/auth.service";


export const googleLoginCallback = asyncHandler(async (req :Request, res: Response) => {

    const currentWorkplace = req.user?.currentWorkplace

    if(!currentWorkplace)
    {
        return res.redirect(`${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`);
    }

    return res.redirect(`${config.FRONTEND_ORIGIN}/workspace/${currentWorkplace}`)

})

export const registerUserController = asyncHandler(async (req: Request, res: Response) => {

    const body = registerSchema.parse({
        ...req.body
    })

    await registerUserService(body);

    return res.status(HTTPSTATUS.CREATED).json({
        message: "User registered successfully",
    })
});