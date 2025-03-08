import express from "express";
import { login, logout, singup, updateProfile, userDetails } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router()

router.post("/signup", singup)

router.post("/login", login)

router.post("/logout", logout)

router.get("/profile", protectRoute, userDetails)

router.put("/profile", protectRoute, updateProfile)

export default router;