import express from "express";
import userVerificationMiddleware from "../middlewares/userVerification.middleware";
import { postCreate, postIndex } from "../controllers/post.controller";

const router = express.Router();

router.post("/", userVerificationMiddleware, postCreate);
router.get("/", postIndex);

export default router;
