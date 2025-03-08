import express from "express";
import { History, runCode, SaveExecution } from "../controllers/execution.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post('/run', runCode)

router.post('/run/:fileName', protectRoute, SaveExecution)

router.get('/history', protectRoute, History)

export default router;