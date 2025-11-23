import { Router } from "express";
import { createWorkSpaceController, getAllWorkSpacesUserIsMemberController, getWorkSpaceByIdController } from "../controllers/workspace.controller";


const workSpaceRoutes = Router();

workSpaceRoutes.post("/create/new", createWorkSpaceController);
workSpaceRoutes.get("/all", getAllWorkSpacesUserIsMemberController);
workSpaceRoutes.get("/:id", getWorkSpaceByIdController);

export default workSpaceRoutes;