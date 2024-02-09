import express from "express";
import { userUpdate, userDestroy } from "../controllers/user.controller";
import userVerificationMiddleware from "../middlewares/userVerification.middleware";

const router = express.Router();

router.put("/:userId", userVerificationMiddleware, userUpdate);
router.delete("/:userId", userVerificationMiddleware, userDestroy);

export default router;
