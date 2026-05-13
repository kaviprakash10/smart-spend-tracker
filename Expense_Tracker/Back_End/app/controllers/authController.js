import User from "../models/userModel.js";
import TempOTP from "../models/otpModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  validateRegister,
  validateLogin,
  validateEmailOTP,
  validatePhoneOTP,
} from "../validators/authValidator.js";
import { sendEmail } from "../utils/emailService.js";
import { sendSMS } from "../utils/smsService.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "fallback_secret", {
    expiresIn: "30d",
  });
};

export const register = async (req, res) => {
  try {
    const { error } = validateRegister(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const { name, email, password, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Error in registration" });
  }
};

export const login = async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (
      user &&
      user.password &&
      (await bcrypt.compare(password, user.password))
    ) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Generate a random 6-digit OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const sendEmailOTP = async (req, res) => {
  try {
    const { error } = validateEmailOTP(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = Date.now() + 1 * 60 * 1000; // 1 minute
    await user.save();

    await sendEmail(
      user.email,
      "Your Login OTP",
      `Your OTP for login is ${otp}`,
    );

    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("Error in sendEmailOTP:", error);
    const status = error.message.includes("identical") ? 400 : 500;
    res.status(status).json({ message: error.message || "Failed to send OTP" });
  }
};

export const verifyEmailOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Error verifying OTP" });
  }
};

export const sendPhoneOTP = async (req, res) => {
  try {
    const { error } = validatePhoneOTP(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const { phone, email } = req.body;
    let user;
    if (email) {
      user = await User.findOne({ email });
    } else if (phone) {
      user = await User.findOne({ phone });
    }

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.phone) return res.status(400).json({ message: "No phone number associated with this account" });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = Date.now() + 1 * 60 * 1000; // 1 minute
    await user.save();

    await sendSMS(user.phone, `Your Login OTP is ${otp}`);

    res.status(200).json({ message: "OTP sent to phone" });
  } catch (error) {
    console.error("Error in sendPhoneOTP:", error);
    // Treat configuration/Twilio errors as 400 Bad Request instead of 500 Internal Server Error
    const status = (error.message.includes("SMS Service Error") || error.message.includes("identical")) ? 400 : 500;
    res.status(status).json({ message: error.message || "Failed to send OTP" });
  }
};

export const verifyPhoneOTP = async (req, res) => {
  try {
    const { phone, email, otp } = req.body;
    let user;
    if (email) {
      user = await User.findOne({ email });
    } else if (phone) {
      user = await User.findOne({ phone });
    }

    if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Error verifying OTP" });
  }
};

export const sendSignupOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: "Phone number is required" });

    // Check if user already exists
    const userExists = await User.findOne({ phone });
    if (userExists) return res.status(400).json({ message: "Phone number already registered" });

    const otp = generateOTP();
    const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes for signup

    await TempOTP.findOneAndUpdate(
      { phone },
      { otp, otpExpiry },
      { upsert: true, new: true }
    );

    await sendSMS(phone, `Your ExpenseMaster signup verification code is ${otp}`);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error in sendSignupOTP:", error);
    // Treat configuration/Twilio errors as 400 Bad Request instead of 500 Internal Server Error
    const status = (error.message.includes("SMS Service Error") || error.message.includes("identical")) ? 400 : 500;
    res.status(status).json({ message: error.message || "Failed to send OTP" });
  }
};

export const verifySignupOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const record = await TempOTP.findOne({ phone });

    if (!record || record.otp !== otp || record.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Mark as verified (we could delete or keep for a short time, the TTL will handle it)
    await TempOTP.deleteOne({ phone });

    res.status(200).json({ message: "Phone verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error verifying OTP" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const googleLoginCallback = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication failed" });
  }

  const token = generateToken(req.user._id);

  // Instead of json response, you would typically redirect to frontend
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  res.redirect(`${frontendUrl}/signin?token=${token}`);
};
