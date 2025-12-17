import mongoose from "mongoose";

const WinnerSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    winners: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
          required: true,
        },

        // Winner position
        position: {
          type: String,
          enum: ["Winner", "Runner Up", "Second Runner Up"],
          required: true,
        },

        // Optional fields for analytics
        score: { type: Number, default: null },

        // Remarks by coordinator / judge
        remarks: { type: String, trim: true },

        // Certificate URL
        certificate_url: { type: String, trim: true },

        // For team events
        team_name: { type: String, trim: true },

        // Members only if team leader is the main student
        team_members: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
          },
        ],
      },
    ],

    declared_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: false, // optional
    },

    isPublished: {
      type: Boolean,
      default: false, // Publish to website/leaderboard
    },
  },
  { timestamps: true }
);

export default mongoose.model("Winner", WinnerSchema);
