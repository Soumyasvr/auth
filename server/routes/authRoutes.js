import express from "express";
import { isAuthenticated, login, logout, register, resetPassword, sendResetOtp, sendVerifyOTP, verifyAccount } from "../controllers/authController.js";
import { userAuth } from "../middleware/userAuth.js";

export const authRoutes = express.Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/logout", logout);
authRoutes.post("/send-otp", userAuth, sendVerifyOTP);
authRoutes.post("/verify-account", userAuth, verifyAccount);
authRoutes.get("/is-auth", userAuth, isAuthenticated);
authRoutes.post("/send-reset-otp", sendResetOtp);
authRoutes.post("/reset-password", resetPassword);