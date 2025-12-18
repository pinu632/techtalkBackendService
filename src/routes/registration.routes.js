import express from "express";
import * as RegistrationController from "../controller/registration.controller.js";
import logger from "../logs/logger.js";

const router = express.Router();

// Logger utility middleware
const logRoute = (message) => (req, res, next) => {
  logger.info(message, {
    path: req.originalUrl,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  next();
};

// Create single registration
router.post(
  "/",
  logRoute("POST /registration - Create single registration"),
  RegistrationController.createRegistration
);
router.post(
  "/check",
  logRoute("POST /registration/check "),
  RegistrationController.checkRegistrationStatus
);

// Bulk create registrations
router.post(
  "/bulk",
  logRoute("POST /registration/bulk - Bulk create registrations"),
  RegistrationController.createManyRegistrations
);

// Get registration by ID (with eventId and studentId populated)
router.get(
  "/:id",
  logRoute("GET /registration/:id - Get registration by ID"),
  RegistrationController.getRegistrationById
);

// Get all registrations (via POST for filtering, pagination, etc.)
router.post(
  "/list",
  logRoute("POST /registration/list - Get all registrations"),
  RegistrationController.getAllRegistrations
);

// Update registration by ID
router.put(
  "/:id",
  logRoute("PUT /registration/:id - Update registration by ID"),
  RegistrationController.updateRegistration
);

// Delete registration by ID
router.delete(
  "/:id",
  logRoute("DELETE /registration/:id - Delete registration by ID"),
  RegistrationController.deleteRegistration
);

// Mark attendance
router.post(
  "/mark-attendance",
  logRoute("POST /registration/mark-attendance - Mark attendance"),
  RegistrationController.markAttendance
);

// Issue certificate
router.post(
  "/issue-certificate",
  logRoute("POST /registration/issue-certificate - Issue certificate"),
  RegistrationController.issueCertificate
);

// Cancel registration by ID
router.post(
  "/cancel/:id",
  logRoute("POST /registration/cancel/:id - Cancel registration by ID"),
  RegistrationController.cancelRegistration
);

// Cancel registration by eventId & studentId
router.post(
  "/cancel",
  logRoute("POST /registration/cancel - Cancel registration by eventId and studentId"),
  RegistrationController.cancelRegistrationByEventAndStudent
);

// Reactivate registration by eventId & studentId
router.post(
  "/reactivate",
  logRoute("POST /registration/reactivate - Reactivate registration"),
  RegistrationController.reactivateRegistration
);

// Register with student check and auto-create student if necessary
router.post(
  "/register-with-student-check",
  logRoute("POST /registration/register-with-student-check - Register with student check"),
  RegistrationController.registerWithStudentCheck
);

export default router;

