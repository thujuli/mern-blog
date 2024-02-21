import express from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { commentCreate } from "../controllers/comment.controller";

const router = express.Router();

router.post("/", verifyToken, commentCreate);

export default router;
