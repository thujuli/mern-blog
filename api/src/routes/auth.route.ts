import express from "express";
import { registerCreate } from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", registerCreate);

export default router;
