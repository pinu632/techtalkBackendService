import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    type: {
      type: String,
      enum: ["Tech", "Non Tech", "Seminar", "Expert Talk"],
      required: true,
    },

    scheduled_date: { type: Date, required: true },

    start_time: { type: String, required: true }, // store "HH:mm"
    end_time: { type: String },

    poster_link: { type: String },

    rules: { type: String },

    rules_link: { type: String, trim: true },

    coordinators: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
          required: true,
        },
        name: { type: String },
        role: {
          type: String,
          enum: ["Lead", "Support", "Volunteer"],
          default: "Support",
        },
      },
    ],
    report: { type: String },

    venue: { type: String, trim: true },

    description: { type: String },

    status: {
      type: String,
      enum: ["Upcoming", "Ongoing", "Completed", "Active"],
      default: "Upcoming",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default mongoose.model("Event", EventSchema);
