import express from "express";
import {
  createNotification,
  getNotificationById,
  getAllNotifications,
  deleteNotification,
} from "../controller/notification.controller.js";

const router = express.Router();

/* ===========================
     CREATE NOTIFICATION
   =========================== */
router.post("/", createNotification);

/* ===========================
     GET NOTIFICATION BY ID
   =========================== */
router.get("/:id", getNotificationById);

/* ===========================
     GET ALL NOTIFICATIONS (Paginated)
   =========================== */
router.post("/list", getAllNotifications);

/* ===========================
     DELETE NOTIFICATION
   =========================== */
router.delete("/:id", deleteNotification);

export default router;
