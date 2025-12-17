import cron from "node-cron";
import moment from "moment";
import Appointment from "../models/appointemnet.js";
import Floor from "../models/Floor.js";
import Notification from "../models/notification.js";
import { createNotificationService } from "../services/notification.services.js";

export const runCronJobs = () => {
  // Run every 5 minutes
  cron.schedule("*/1 * * * *", async () => {
    console.log("⏳ Checking for visitor no-show...");

    try {
      // Fetch all scheduled appointments
      const appointments = await Appointment.find({ status: "scheduled" })
        .populate("floor")
        .populate("visitor")
        .populate("host");

      for (const appt of appointments) {
        const appointmentDateTime = moment(
          `${moment(appt.date).format("YYYY-MM-DD")} ${appt.time}`,
          "YYYY-MM-DD HH:mm"
        );

        
        const now = moment();

        // Check if now is 15 minutes after the appointment time
        if (now.isAfter(appointmentDateTime.add(15, "minutes"))) {
          console.log(`🚨 No-show detected for appointment ${appt._id}`);

          // Cancel the appointment
          appt.status = "cancelled";
          await appt.save();

          // Fetch guard assigned to that floor
          const guardId = appt.floor.assignedGuards; // make sure floor schema has this
         

          // Create a notification
          await createNotificationService({
            user: guardId,
            userModel: "Guard",
            title: "Visitor No-Show Alert",
            message: `The visitor (${appt.visitor.name}) scheduled to meet ${appt.host.name} at ${appt.time} has not arrived within 15 minutes. The appointment has been marked as cancelled.`,
            type: "VISITOR_NO_SHOW",
            relatedAppointment: appt._id,
            relatedVisitor: appt.visitor._id,
            relatedHost: appt.host._id,
          });

          console.log(`📨 No-show notification sent to guard: ${guardId}`);
        }
      }

      console.log("✔ Visitor no-show check completed.");
    } catch (error) {
      console.error("❌ Error in no-show cron:", error);
    }
  });
};
