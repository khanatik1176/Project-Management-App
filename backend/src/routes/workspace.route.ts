import { Router } from "express";


const workSpaceRoutes = Router();

workSpaceRoutes.post("/create/new", createWorkSpaceController);

export default workSpaceRoutes;