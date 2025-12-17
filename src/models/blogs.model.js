import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    // -----------------------------
    // Basic Info
    // -----------------------------
    title: {
      type: String,
      required: true,
      trim: true,
    },

    excerpt: {
      type: String,
    },

    // Author reference (Student)
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    date: {
      type: Date,
      default: Date.now,
    },

    read_time: {
      type: String, // e.g., "5 min read"
    },

    views: {
      type: Number,
      default: 0,
    },

    category: {
      type: String,
      trim: true,
    },

    // -----------------------------
    // Cover Image
    // -----------------------------
    cover: {
      type: String, // Cloudinary URL
    },

    // -----------------------------
    // Content (HTML)
    // -----------------------------
    content: {
      type: String,
    },

    // -----------------------------
    // Arrays
    // -----------------------------
    subtopics: {
      type: [String],
      default: [],
    },

    suggested_articles: {
      type: [String],
      default: [],
    },

    tags: {
      type: [String],
      default: [],
    },

    // -----------------------------
    // Status
    // -----------------------------
    status: {
      type: String,
      enum: ["Draft", "Published", "Archived"],
      default: "Draft",
    },

    // -----------------------------
    // Engagement
    // -----------------------------
    likes: {
      type: Number,
      default: 0,
    },

    comments_count: {
      type: Number,
      default: 0,
    },

    // -----------------------------
    // For search optimization
    // -----------------------------
    search_text: {
      type: String,
      index: "text", // MongoDB text index for title + content search
    },
  },
  { timestamps: true }
);

// Auto-generate search text every save
BlogSchema.pre("save", async function (next) {
  try {
    this.search_text = `${this.title} ${this.content}`;
    next();
  } catch (error) {
    console.error("Error Saving search_text", error);
  }
});

export default mongoose.model("Blog", BlogSchema);
