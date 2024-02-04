import express from "express";
import { userUpdate } from "../controllers/user.controller";
import userVerificationMiddleware from "../middlewares/userVerification.middleware";

const router = express.Router();

router.put("/:userId", userVerificationMiddleware, userUpdate);

export default router;
