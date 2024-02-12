import express from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { postCreate, postIndex } from "../controllers/post.controller";

const router = express.Router();

router.post("/", verifyToken, postCreate);
router.get("/", postIndex);

export default router;
