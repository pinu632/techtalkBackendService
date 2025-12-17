import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    // Basic Info
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    tech_stack: {
      type: [String],
      required: true,   // e.g., ["React", "Node.js", "MongoDB"]
    },

    // Leader (must be a student)
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    // Members actively working on the project
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      }
    ],

    // Contributors — occasional helpers
    contributors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      }
    ],

    // Links
    github_repo: {
      type: String,
      required: true,
      trim: true,
    },

    live_link: {
      type: String,
      trim: true,
    },

    // Optional Features
    screenshots: [
      {
        type: String, // image URLs
      }
    ],

    tags: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["Planning", "In Progress", "Completed", "On Hold"],
      default: "In Progress",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Project", ProjectSchema);
