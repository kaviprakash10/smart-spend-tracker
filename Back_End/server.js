import dotenv from "dotenv";
dotenv.config();

import express from "express";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import cors from "cors";
import cron from "node-cron";
import { fileURLToPath } from "url";
import authRoutes from "./app/routes/authRoutes.js";
import expenseRoutes from "./app/routes/expenseRoutes.js";
import passport from "./config/passport.js";
import ConfigureDB from "./config/db.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to Database
ConfigureDB();

const app = express();
const port = process.env.PORT || 5000;
// Access log
app.use(
  morgan("combined", {
    stream: fs.createWriteStream(path.join(__dirname, "access.log"), {
      flags: "a",
    }),
  }),
);

// Error log
app.use(
  morgan("combined", {
    stream: fs.createWriteStream(path.join(__dirname, "error.log"), {
      flags: "a",
    }),
  }),
);

app.use(cors());
app.use(express.json());

// Initialize Passport
app.use(passport.initialize());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

app.listen(port, () => {
  console.log(`Your ExpenseTracker is running on port ${port}`);
});
