import mongoose from "mongoose";
const { Schema, model } = mongoose;
const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      minlength: 4,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["admin", "artist", "fan"],
      default: "fan",
    },
  },
  {
    timestamps: true,
  },
);

const User = model("User", userSchema);
export default User;
