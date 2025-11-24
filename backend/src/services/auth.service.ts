import mongoose from "mongoose";
import UserModel from "../models/user.model";
import AccountModel from "../models/account.model";
import WorkspaceModel from "../models/workspace.model";
import RoleModel from "../models/role-permission.model";
import { Roles } from "../enums/role.enum";
import MemberModel from "../models/member.model";
import { ProviderEnum } from "../enums/account.provider.enum";
import { use } from "passport";
import { NotFoundException, UnauthorizedException } from "../utils/appError";

export const loginOrCreateAccountService = async (data: 
    {
        provider: string,
        displayName: string,
        providerId: string,
        picture?: string,
        email?: string,
    }
) => 
{
    const { provider, displayName, providerId, picture, email } = data;

    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        let user = await UserModel.findOne({email}).session(session);

        if(!user)
        {
            user = new UserModel({
                email,
                name: displayName,
                profilePicture: picture || null,
            })

            await user.save({session});

            const account = new AccountModel(
                {
                    userId: user._id,
                    provider: provider,
                    providerId: providerId,
                }
            );
            await account.save({session});

            const workspace = new WorkspaceModel(
                {
                    name: `${displayName}'s Workspace`,
                    description: 'Personal Workspace',
                    owner: user._id,
                }
            )

            await workspace.save({session});

            const ownerRole = await RoleModel.findOne({
                name: Roles.OWNER,
            }).session(session);

            if(!ownerRole)
            {
                throw new Error('Owner role not found.');
            }

            const member = new MemberModel({
                userId: user._id,
                workspaceId: workspace._id,
                role: ownerRole._id,
                joinedAt: new Date(),
            })
            await member.save({session});

            user.currentWorkplace = workspace._id as mongoose.Types.ObjectId;
            await user.save({session});
        }
        await session.commitTransaction();
        session.endSession();
        
        return {user};  
        
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
    finally {
        session.endSession();
    }
}


export const registerUserService = async (body: {
    email: string,
    name: string,
    password: string,
}) =>
{
    const {email, name, password} = body;
    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        const existingUser = await UserModel.findOne({email}).session(session);

        if(existingUser)
        {
            throw new Error('User with this email already exists');
        }

        const user = new UserModel({
            email,
            name,
            password
        })

        await user.save({session});

        const account = new AccountModel({
            userId: user._id,
            provider: ProviderEnum.EMAIL,
            providerId: email
        });

        await account.save({session});

        const workspace = new WorkspaceModel(
                {
                    name: `${name}'s Workspace`,
                    description: 'Personal Workspace',
                    owner: user._id,
                }
            )

        await workspace.save({session});

        const ownerRole = await RoleModel.findOne({
            name: Roles.OWNER,
        }).session(session);

        if(!ownerRole)
        {
            throw new Error('Owner role not found.');
        }

        const member = new MemberModel({
                userId: user._id,
                workspaceId: workspace._id,
                role: ownerRole._id,
                joinedAt: new Date(),
            })
        await member.save({session});

        user.currentWorkplace = workspace._id as mongoose.Types.ObjectId;
        await user.save({session});

        await session.commitTransaction();
        session.endSession();

        return{ userId: user._id,
            workspaceId: workspace._id
         };

        
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
        
    }
}

export const verifyUserService = async ({
    email,
    password,
    provider = ProviderEnum.EMAIL
}:
{
    email: string,
    password: string,
    provider?: string,
}) =>
{
    const account = await AccountModel.findOne({provider, providerId: email});

    if(!account)
    {
        throw new NotFoundException('Invalid email or password');
    }

    const user = await UserModel.findById(account.userId);

    if(!user)
    {
        throw new NotFoundException('User not found for the given account');
    }

    const isMatch = await user.comparePassword(password);

    if(!isMatch)
    {
        throw new UnauthorizedException('Invalid email or password');
    }

    return user.omitPassword();

}