import express from "express";
import { initiateSignup, login, logout, updateProfile, userDetails, verifyAndCreateUser } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router()

// router.post("/signup", singup)

router.post("/login", login)

router.post("/logout", logout)

router.get("/profile", protectRoute, userDetails)

router.put("/profile", protectRoute, updateProfile)

router.post('/initiate-signup', initiateSignup);

router.get('/verify-email/:token', verifyAndCreateUser);
export default router;