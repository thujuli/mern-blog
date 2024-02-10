import express from "express";
import userVerificationMiddleware from "../middlewares/userVerification.middleware";
import { postCreate } from "../controllers/post.controller";

const router = express.Router();

router.post("/", userVerificationMiddleware, postCreate);

export default router;
