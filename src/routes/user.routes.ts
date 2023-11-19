import express from "express";
import { CreateUserSchema } from "../schema/user.schema";
import validateResource from "../middlewares/validateResource";
import createUserHandler from "../controllers/user.controller";
const router = express();

router.post("/api/users", validateResource(CreateUserSchema), createUserHandler)


export default router