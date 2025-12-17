import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
  {
    // 🔗 Reference to Event
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },

    // 🔗 Reference to Student
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },

    // 🧾 Registration status
    status: {
      type: String,
      enum: ["registered", "cancelled", "attended", "absent"],
      default: "registered",
    },

    // 📅 Attendance tracking
    attendanceMarked: {
      type: Boolean,
      default: false,
    },

    attendanceMarkedAt: {
      type: Date,
    },

    // 🎓 Certificate info
    certificateIssued: {
      type: Boolean,
      default: false,
    },

    certificateUrl: {
      type: String, // optional PDF link
    },

    // 👥 For team events (optional, future-proof)
    teamName: {
      type: String,
      trim: true,
    },

    teamMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],

    // 📝 Extra info (if you add custom questions later)
    responses: {
      type: Map,
      of: String,
    },

    // 🚫 Soft delete
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

export default mongoose.model("Registration",registrationSchema);