import express from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import {
  commentCreate,
  commentLike,
  commentUpdate,
  commentDestroy,
} from "../controllers/comment.controller";

const router = express.Router();

router.post("/", verifyToken, commentCreate);
router.put("/:commentId/like", verifyToken, commentLike);
router.put("/:commentId/", verifyToken, commentUpdate);
router.delete("/:commentId/", verifyToken, commentDestroy);

export default router;
