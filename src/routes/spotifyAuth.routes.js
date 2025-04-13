import express from "express";
import {
  redirectToSpotifyLogin,
  handleSpotifyCallback,
} from "../controllers/spotifyAuth.controller.js";

const router = express.Router();

router.get("/login", redirectToSpotifyLogin);
router.get("/callback", handleSpotifyCallback);

export default router;
