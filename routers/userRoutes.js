import express from "express";
const router = express.Router();

import {
  registerUserController,
  loginUserController,
  completeProfileController,
  checkAuthController,
} from "../controllers/userController.js";

import authMiddleware from "../middleware/auth.js";

router.post("/register", registerUserController);

router.post("/login", loginUserController);

router.post("/complete-profile", authMiddleware, completeProfileController);

router.get("/check", authMiddleware, checkAuthController);

export default router;
