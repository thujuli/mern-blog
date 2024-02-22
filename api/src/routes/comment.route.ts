import express from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { commentCreate, commentIndex } from "../controllers/comment.controller";

const router = express.Router();

router.post("/", verifyToken, commentCreate);
router.get("/:postId", commentIndex);

export default router;
