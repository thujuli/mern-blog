import express from "express";
import { registerCreate, loginCreate } from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", registerCreate);
router.post("/login", loginCreate);

export default router;
