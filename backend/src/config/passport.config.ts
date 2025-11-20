import passport from "passport";
import { Request } from "express";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {Strategy as LocalStrategy} from "passport-local";
import { config } from "./app.config";
import { NotFoundException } from "../utils/appError";
import { ProviderEnum } from "../enums/account.provider.enum";
import { loginOrCreateAccountService, verifyUserService } from "../services/auth.service";


passport.use( 
    new GoogleStrategy(
        {
            clientID: config.GOOGLE_CLIENT_ID,
            clientSecret: config.GOOGLE_CLIENT_SECRET,
            callbackURL: config.GOOGLE_CALLBACK_URL,
            scope: ['profile', 'email'],
            passReqToCallback: true,
        },
        async (req: Request, accessToken: string, refreshToken: string, profile: any, done: Function) =>
        {
            try {
                const {email, sub:googleId, picture} = profile._json;
                // console.log("Google profile:", profile);
                // console.log("Google GoogleID:", googleId);
                if(!googleId)
                {
                    throw new NotFoundException('Google ID not found in user profile');
                }

                const {user} = await loginOrCreateAccountService({
                    provider: ProviderEnum.GOOGLE,
                    displayName: profile.displayName,
                    providerId: googleId,
                    picture: picture,
                    email: email,
                })
                done(null, user);
                
            } catch (error) {
                done(error, false);
                
            }
        }
));


passport.use( new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        session: true,
    },

    async (email: string, password: string, done: Function) => {
        try {
            const user = await verifyUserService({email,password});
            return done(null, user);
        } catch (error: any) {
            done(error, false,  { message: error?.message });
        }
    }

)
);

passport.serializeUser((user: any, done) => {
    done(null, user._id);
});

passport.deserializeUser((user:any, done) => {
    done(null, user);
});