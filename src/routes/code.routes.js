import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { allFiles, fileById, saveFile, deleteById, updateById } from "../controllers/code.controller.js";

const router = express.Router();

router.post('/saveFile', protectRoute, saveFile);

router.get('/files', protectRoute, allFiles);

router.get('/files/:fileName', protectRoute, fileById)

router.post('/files/:fileName', protectRoute, updateById)

router.delete('/files/:fileName', protectRoute, deleteById);

export default router;