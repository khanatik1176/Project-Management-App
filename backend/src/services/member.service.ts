import { ErrorCodeEnum } from "../enums/error-code.enums";
import { Roles } from "../enums/role.enum";
import MemberModel from "../models/member.model";
import RoleModel from "../models/role-permission.model";
import WorkspaceModel from "../models/workspace.model";
import { BadRequestException, NotFoundException, UnauthorizedException } from "../utils/appError";

export const getMemberRoleInWorkspace = async (userId: string, workspaceId: string) => {

    const workspace = await WorkspaceModel.findById(workspaceId);

    if(!workspace)
    {
        throw new NotFoundException("Workspace not found");
    }

    const member = await MemberModel.findOne({
        userId,
        workspaceId,
    }).populate('role');

    if(!member)
    {
        throw new UnauthorizedException("Member not found in this workspace",
            ErrorCodeEnum.ACCESS_UNAUTHORIZED
        );
    }


    const roleName = member?.role?.name;

    return {role: roleName};



}


export const joinWorkSpaceService = async (userId: string | undefined, inviteCode: string) => {

    const workspace = await WorkspaceModel.findOne({ inviteCode }).exec();

    if(!workspace)
    {
        throw new NotFoundException("Invalid invite code. Workspace not found.");
    }

    const existingMember = await MemberModel.findOne({
        userId,
        workspaceId: workspace._id
    }).exec();

    if(existingMember)
    {
        throw new BadRequestException("You are already a member of this workspace.");
    }

    const role = await RoleModel.findOne({ name: Roles.MEMBER });

    if(!role)
    {
        throw new NotFoundException("Member role not found.");
    }

    const newMember = new MemberModel({
        userId,
        workspaceId: workspace._id,
        role: role._id,
    });

    await newMember.save();


    return { workspaceId: workspace._id, role: role.name };


}