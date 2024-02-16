import express from "express";
import {
  userUpdate,
  userDestroy,
  userIndex,
} from "../controllers/user.controller";
import { verifyToken } from "../middlewares/auth.middleware";

const router = express.Router();

router.put("/:userId", verifyToken, userUpdate);
router.delete("/:userId", verifyToken, userDestroy);
router.get("/", verifyToken, userIndex);

export default router;
