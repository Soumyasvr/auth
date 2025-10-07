import express from "express";
import { userAuth } from "../middleware/userAuth.js";
import { getUserData } from "../controllers/userController.js";

export const userRoutes = express.Router();

userRoutes.get("/data", userAuth, getUserData);