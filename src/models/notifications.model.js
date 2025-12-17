import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    // Who will receive this notification
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    // Optional: sender (admin, leader, member, etc.)
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },

    // Type of notification
    type: {
      type: String,
      enum: [
        "Event-Created",
        "Event-Registration",
        "Event-Reminder",
        "Work-Assigned",
        "Project-Update",
        "Project-Assigned",
        "Member-Announcement",
        "Blog-Published",
        "General"
      ],
      default: "General",
    },

    // Title + message
    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
    },

    // Link to redirect user (optional)
    link: {
      type: String,
      trim: true,
    },

    // Meta reference for dynamic notifications (optional)
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },

    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },

    // Read / Unread
    is_read: {
      type: Boolean,
      default: false,
    },

    // Optional: can allow priority notifications
    priority: {
      type: String,
      enum: ["Low", "Normal", "High"],
      default: "Normal",
    },

    // Soft delete (if user clears the notification)
    is_deleted: {
      type: Boolean,
      default: false,
    },

    deleted_at: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Notification", NotificationSchema);
