import express from "express";
import {
  google,
  login,
  logout,
  registration,
} from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", registration);
router.post("/login", login);
router.post("/google", google);
router.delete("/logout", logout);

export default router;
