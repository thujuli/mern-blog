import express from "express";
import {
  registrationStore,
  loginStore,
  googleStore,
  logoutDestroy,
} from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", registrationStore);
router.post("/login", loginStore);
router.post("/google", googleStore);
router.delete("/logout", logoutDestroy);

export default router;
