import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import logger from "./logs/logger.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import http from 'http'

import authRoutes from "./routes/auth.routes.js";
import studentRoutes from "./routes/student.routes.js";
import mediaRoutes from "./routes/media.routes.js";
import eventRoutes from "./routes/event.routes.js"
import registrationRoutes from "./routes/registration.routes.js";
import blogRoutes from './routes/blogs.routes.js'
import membersRoutes from './routes/memeber.routes.js'




dotenv.config();

const app = express();


// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// runCronJobs()

// Default Route
app.get("/", (req, res) => {
  res.send("Visitor Management System API Working 🚀");
});

// Import Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/student", studentRoutes);
// app.use("/api/v1/floor", floorRoutes);
// // app.use("/api/admin", adminRoutes);
// app.use("/api/v1/visitor", visitorRoutes);
// app.use("/api/v1/appointments", appointmentRoutes);

// app.use("/api/v1/guard", guardRoute);
app.use("/api/v1/event", eventRoutes);

app.use("/api/v1/registration", registrationRoutes);
app.use("/api/v1/media", mediaRoutes);
app.use("/api/v1/blogs", blogRoutes);
app.use("/api/v1/members", membersRoutes);
// app.use("/api/v1/notification", notificationRoutes);

app.use(errorMiddleware);
logger.info("Serer starting...");
export default app;
