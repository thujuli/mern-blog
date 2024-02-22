import express from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import {
  postCreate,
  postIndex,
  postDestroy,
  postUpdate,
  postComments,
} from "../controllers/post.controller";

const router = express.Router();

router.post("/", verifyToken, postCreate);
router.get("/", postIndex);
router.delete("/:postId", verifyToken, postDestroy);
router.put("/:postId", verifyToken, postUpdate);
router.get("/:postId/comments", postComments);

export default router;
