import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../app/models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "dummy_id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "dummy_secret",
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          const email =
            profile.emails && profile.emails.length > 0
              ? profile.emails[0].value
              : null;
          if (email) {
            user = await User.findOne({ email });
          }

          if (user) {
            user.googleId = profile.id;
            await user.save();
          } else {
            // User not found - do not create new user
            return done(null, false, { message: "User not found" });
          }
        }
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    },
  ),
);

export default passport;
