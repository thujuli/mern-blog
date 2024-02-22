import express from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { commentCreate, commentLike } from "../controllers/comment.controller";

const router = express.Router();

router.post("/", verifyToken, commentCreate);
router.put("/:commentId/like", verifyToken, commentLike);

export default router;
