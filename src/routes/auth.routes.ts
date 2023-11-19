import express from "express";
import sessionHandler from "../controllers/session.controller";
const router = express();

router.post("/api/auth", sessionHandler)


export default router