import express from "express";
import {
  register,
  login,
  sendEmailOTP,
  verifyEmailOTP,
  sendPhoneOTP,
  verifyPhoneOTP,
  sendSignupOTP,
  verifySignupOTP,
  getProfile,
  updateProfile,
  googleLoginCallback,
} from "../controllers/authController.js";
import passport from "passport";
import { protectRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// OTP Auth routes
router.post("/email-otp", sendEmailOTP);
router.post("/verify-email-otp", verifyEmailOTP);

router.post("/phone-otp", sendPhoneOTP);
router.post("/verify-phone-otp", verifyPhoneOTP);

router.post("/send-signup-otp", sendSignupOTP);
router.post("/verify-signup-otp", verifySignupOTP);

// Profile routes
router.get("/profile", protectRoute, getProfile);
router.put("/profile", protectRoute, updateProfile);

// Google Auth routes
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);
router.get(
  "/google/callback",
  (req, res, next) => {
    passport.authenticate("google", { session: false }, (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        return res.redirect(
          `${frontendUrl}/signin?error=${encodeURIComponent(info?.message || "User not found")}`,
        );
      }
      req.user = user;
      next();
    })(req, res, next);
  },
  googleLoginCallback,
);

export default router;
