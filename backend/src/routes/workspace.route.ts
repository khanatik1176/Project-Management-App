import { Router } from "express";
import { changeWorkSpaceMemberRoleController, createWorkSpaceController, deleteWorkSpaceByIdController, getAllWorkSpacesUserIsMemberController, getWorkSpaceAnalyticsController, getWorkSpaceByIdController, getWorkSpaceMembersController, updateWorkSpaceByIdController } from "../controllers/workspace.controller";


const workSpaceRoutes = Router();

workSpaceRoutes.post("/create/new", createWorkSpaceController);

workSpaceRoutes.put("/change/member/role/:id", changeWorkSpaceMemberRoleController);
workSpaceRoutes.put("/update/:id", updateWorkSpaceByIdController);
workSpaceRoutes.delete("/delete/:id", deleteWorkSpaceByIdController);

workSpaceRoutes.get("/all", getAllWorkSpacesUserIsMemberController);
workSpaceRoutes.get("/members/:id", getWorkSpaceMembersController);
workSpaceRoutes.get("/analytics/:id", getWorkSpaceAnalyticsController);
workSpaceRoutes.get("/:id", getWorkSpaceByIdController);

export default workSpaceRoutes;