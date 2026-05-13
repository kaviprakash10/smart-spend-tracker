import mongoose from "mongoose";
const { Schema, model } = mongoose;
const fanSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    favoriteArtists: [
      {
        type: Schema.Types.ObjectId,
        ref: "Artist",
      },
    ],
  },
  { timestamps: true }
);
const Fan = model("Fan", fanSchema);
export default Fan;