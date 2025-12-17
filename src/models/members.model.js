import mongoose from "mongoose";

const MemberSchema = new mongoose.Schema(
  {
    // Unique Member ID (optional but useful)
    member_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // Student Reference (1:1)
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      unique: true,
    },

    // Member-only fields
    join_date: {
      type: Date,
      required: true,
    },

    skills: {
      type: [String],
      default: [],
    },

    achievements: {
      type: String,
      trim: true,
    },

    additional_details: {
      type: String,
    },

    // -------------------------------
    // ✅ Project References (Registered on TTC DB)
    // -------------------------------
    projects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      }
    ],

    // -------------------------------
    // ✅ External Projects (NOT registered on TTC DB)
    // -------------------------------
    external_projects: [
      {
        name: { type: String, required: true },
        description: { type: String },
        tech_stack: { type: [String], default: [] },
        github_link: { type: String },
        live_link: { type: String },
      }
    ],

    // -------------------------------
    // ✅ Social Media Links
    // -------------------------------
    socials: {
      github: { type: String, trim: true },
      linkedin: { type: String, trim: true },
      portfolio: { type: String, trim: true },
      instagram: { type: String, trim: true },
      twitter: { type: String, trim: true },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Member", MemberSchema);
