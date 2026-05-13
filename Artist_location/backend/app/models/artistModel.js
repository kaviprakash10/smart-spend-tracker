import mongoose from "mongoose";
const { Schema, model } = mongoose;
const artistSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    artistName: {
      type: String,
      required: true,
      trim: true,
    },

    genre: {
      type: String,
      trim: true,
    },

    bio: {
      type: String,
    },

    profileImage: {
      type: String,
      default: "",
    },
    instagram: {
      type: String,
      default: "",
    },
    twitter: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

const Artist = model("Artist", artistSchema);
export default Artist;
