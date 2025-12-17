import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const StudentSchema = new mongoose.Schema(
  {
    // Basic Details
    name: { type: String, required: true, trim: true },

    rollNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    course: { type: String, required: true, trim: true },

    semester: {
      type: Number,
      min: 1,
      max: 8,
    },

    class: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "C3", "C4", "C5", "C6", "C7", "C8",
        "I3", "I4", "I5", "I6", "I7", "I8",
        "AI&ML3", "AI&ML4", "AI&ML5", "AI&ML6", "AI&ML7", "AI&ML8",
      ],
    },

    // Authentication
    password: { type: String, required: true },

    // Roles for Access Control
    role: {
      type: [String],
      enum: ["Admin", "Member", "Student"],
      default: ["Student"],
      
    },

    // Optional & Useful Fields
    profilePic: { type: String, default: null },

    isVerified: { type: Boolean, default: false },

    status: {
      type: String,
      enum: ["Active", "Suspended", "Graduated"],
      default: "Active",
    },

    lastLogin: { type: Date },

    failedAttempts: { type: Number, default: 0 },

    isLocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// 🔐 Hash Password Before Save
StudentSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
  } catch (err) {
    console.error("Error hashing password:", err);
  }
});

// 🔍 Compare Password Method
StudentSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model("Student", StudentSchema);
