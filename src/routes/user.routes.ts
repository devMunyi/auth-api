import express from "express";
import { CreateUserSchema, ForgotPasswordSchema, VerifyUserSchema } from "../schema/user.schema";
import validateResource from "../middlewares/validateResource";
import { createUserHandler, forgotPasswordHandler, verifyUserHandler } from "../controllers/user.controller";
const router = express();



router.post("/api/user/forgotpassword", validateResource(ForgotPasswordSchema), forgotPasswordHandler);
router.post("/api/user/create", validateResource(CreateUserSchema), createUserHandler);
router.post("/api/user/verify/:id/:verificationCode", validateResource(VerifyUserSchema), verifyUserHandler)


export default router