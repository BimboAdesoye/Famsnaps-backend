import express from "express";
const router = express.Router();

import {
    registerUserController,
    loginUserController,
    completeProfileController,
} from "../controllers/userController.js";

import authMiddleware from '../middleware/auth.js'; 

router.post("/register", registerUserController);

router.post("/login", loginUserController);

router.post("/complete-profile", authMiddleware, completeProfileController);

export default router;
