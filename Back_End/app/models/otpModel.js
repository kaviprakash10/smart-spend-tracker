import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    otp: {
      type: String,
      required: true,
    },
    otpExpiry: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

// Delete OTPs after they expire (TTL index)
otpSchema.index({ otpExpiry: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("TempOTP", otpSchema);
