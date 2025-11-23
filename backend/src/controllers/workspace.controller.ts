import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { changeRoleSchema, createWorkspaceSchema, updateWorkspaceSchema, workspaceSchema } from "../validation/workspace.validation";
import { HTTPSTATUS } from "../config/http.config";
import { changeMemberRoleService, createWorkspaceService, deleteWorkSpaceService, getAllWorkSpacesUserIsMemberService, getWorkSpaceAnalyticsService, getWorkSpaceByIdService, getWorkSpaceMembersService, updateWorkSpaceByIdService } from "../services/workspace.service";
import { getMemberRoleInWorkspace } from "../services/member.service";
import { Permissions } from "../enums/role.enum";
import { roleGuard } from "../utils/roleGuard";

export const createWorkSpaceController = asyncHandler (async (req:Request, res:Response) => {

    const body = createWorkspaceSchema.parse(req.body);

    const userId = req.user?._id;

    const { workspace } = await createWorkspaceService(userId, body);

    return res.status(HTTPSTATUS.CREATED).json({
        message: "Workspace created successfully",
        workspace,
    });
});


export const getAllWorkSpacesUserIsMemberController = asyncHandler (async (req:Request, res:Response) => {

    const userId = req.user?._id;

    const { workspaces} = await getAllWorkSpacesUserIsMemberService(userId);


});

export const getWorkSpaceByIdController = asyncHandler (async (req:Request, res:Response) => {
    
    const workspaceId = workspaceSchema.parse(req.params.id);
    const userId = req.user?._id;

    await getMemberRoleInWorkspace(userId, workspaceId);

    const {workspace} = await getWorkSpaceByIdService(workspaceId);

    return res.status(HTTPSTATUS.OK).json({
        message: "Workspace fetched successfully",
        workspace,
    });

});


export const getWorkSpaceMembersController = asyncHandler (async (req:Request, res:Response) => {
   

    const workspaceId = workspaceSchema.parse(req.params.id);
    const userId = req.user?._id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);

    roleGuard(role, [Permissions.VIEW_ONLY]);

    const { members, roles} = await getWorkSpaceMembersService(workspaceId);

    return res.status(HTTPSTATUS.OK).json({
        message: "Workspace members fetched successfully",
        members,
        roles,
    });


});


export const getWorkSpaceAnalyticsController = asyncHandler (async (req:Request, res:Response) => {

    const workspaceId = workspaceSchema.parse(req.params.id);
    const userId = req.user?._id;
    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.VIEW_ONLY]);

    const {analytics} =  await getWorkSpaceAnalyticsService(workspaceId);

    return res.status(HTTPSTATUS.OK).json({
        message: "Workspace analytics fetched successfully",
        analytics,
    });
});

export const changeWorkSpaceMemberRoleController = asyncHandler (async (req:Request, res:Response) => {

    const workspaceId = workspaceSchema.parse(req.params.id);
    const userId = req.user?._id;
    const { memberId, roleId } = changeRoleSchema.parse(req.body);

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.CHANGE_MEMBER_ROLE]);


    const { member} = await changeMemberRoleService(workspaceId, memberId, roleId);

    return res.status(HTTPSTATUS.OK).json({
        message: "Member role changed successfully",
        member,
    });




});


export const updateWorkSpaceByIdController = asyncHandler (async (req:Request, res:Response) => {
    const workspaceId = workspaceSchema.parse(req.params.id);
    const {name, description} = updateWorkspaceSchema.parse(req.body);
    const userId = req.user?._id;

    const { role } = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.EDIT_WORKSPACE]);

    const { workspace } = await updateWorkSpaceByIdService(workspaceId, name, description);

    return res.status(HTTPSTATUS.OK).json({
        message: "Workspace updated successfully",
        workspace
    });



});

export const deleteWorkSpaceByIdController = asyncHandler ( async (req:Request, res:Response) => {

    const workspaceId = workspaceSchema.parse(req.params.id);
    const userId = req.user?._id;
    const {role} = await getMemberRoleInWorkspace(userId, workspaceId);
    roleGuard(role, [Permissions.DELETE_WORKSPACE]);


    const {currentWorkspace} = await deleteWorkSpaceService(workspaceId, userId);

    return res.status(HTTPSTATUS.OK).json({
        message: "Workspace deleted successfully",
        currentWorkspace
    });
    
});