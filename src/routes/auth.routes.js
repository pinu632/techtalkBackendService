import express from "express";
import logger from "../logs/logger.js";
import {
  getMe,
  login,
  refreshAccessToken,
} from "../controller/auth.controller.js";

const router = express.Router();

router.post(
  "/login",
  (req, res, next) => {
    logger.info("➡️ POST /auth/login — Login route called");
    next();
  },
  login
);


router.post(
  "/refresh-token",
  (req, res, next) => {
    logger.info("➡️ POST /auth/refresh-token — Refresh Token route called");
    next();
  },
  refreshAccessToken
);


router.get(
  "/getUser",
  (req, res, next) => {
    logger.info("➡️ GET /auth/getUser — Get User route called");
    next();
  },
  getMe
);

export default router;
