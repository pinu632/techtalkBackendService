import mongoose from "mongoose";

const GallerySchema = new mongoose.Schema(
  {
    // CDN storage URL
    url: {
      type: String,
      required: true,
    },

    // Cloudinary / S3 public ID (MUST HAVE for deletion)
    storage_id: {
      type: String,
      required: true,
      trim: true,
    },

    // Caption
    caption: {
      type: String,
      trim: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    // Uploaded by (Student reference)
    uploaded_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },

    blog:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },

    // Optional associations
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },

    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    },

    type: {
      type: String,
      enum: [
        "Event",
        "Project",
        "Member",
        "Club",
        "Random",
        "Achievement",
        "Competition",
        "Workshop",
        "Banner",
        "Event Poster",
        "Blog Cover",
        "Blog Content Image"
      ],
      default: "Event Poster",
    },

    priority: {
      type: Number,
      default: 0,
    },

    metadata: {
      width: Number,
      height: Number,
      format: String,
      size_in_kb: Number,
    },

    is_public: {
      type: Boolean,
      default: true,
    },

    // ----------------------------------
    // DELETE MANAGEMENT
    // ----------------------------------
    is_deleted: {
      type: Boolean,
      default: false,
    },

    deleted_at: {
      type: Date,
    },

    deleted_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    }
  },
  { timestamps: true }
);

export default mongoose.model("Gallery", GallerySchema);
