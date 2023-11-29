import express from "express";
import { CreateUserSchema, VerifyUserSchema } from "../schema/user.schema";
import validateResource from "../middlewares/validateResource";
import { createUserHandler, verifyUserHandler } from "../controllers/user.controller";
const router = express();

router.post("/api/user/create", validateResource(CreateUserSchema), createUserHandler);
router.post("/api/user/verify/:id/:verificationCode", validateResource(VerifyUserSchema), verifyUserHandler)


export default router