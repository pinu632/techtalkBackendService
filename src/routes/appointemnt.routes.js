// routes/appointment.routes.js
import express from "express";
import {
  createAppointment,
  getAppointmentById,
  getAllAppointments,
  updateAppointment,
  deleteAppointment,
} from "../controller/appointment.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

/* ===========================
     CREATE APPOINTMENT
   =========================== */
router.post(
  "/",
  authMiddleware,
  authorizeRoles("admin", "guard"),
  createAppointment
);

/* ===========================
     GET APPOINTMENT BY ID
   =========================== */
router.get(
  "/:id",
  authMiddleware,
  authorizeRoles("admin", "guard","host"),
  getAppointmentById
);

/* ===========================
     GET ALL APPOINTMENTS
   =========================== */
router.post(
  "/list",
  authMiddleware,
  authorizeRoles("admin", "guard","host"),
  getAllAppointments
);

/* ===========================
     UPDATE APPOINTMENT
   =========================== */
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("admin", "guard","host"),
  updateAppointment
);

/* ===========================
     DELETE APPOINTMENT
   =========================== */
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("admin","guard","host"),
  deleteAppointment
);

export default router;
