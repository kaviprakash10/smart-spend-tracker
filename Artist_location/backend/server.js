import dotenv from "dotenv";
dotenv.config();

import express from "express";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import cors from "cors";
import cron from "node-cron";
import ConfigureDB from "./config/db.js";
import { fileURLToPath } from "url";
import EventCltr from "./app/controllers/eventController.js";
import UserCltr from "./app/controllers/userController.js";
import ArtistCltr from "./app/controllers/artistController.js";
import AdminCltr from "./app/controllers/adminController.js";
import auth from "./app/middlewere/authUser.js";
import admin from "./app/middlewere/authAdmin.js";
import artist from "./app/middlewere/authArtist.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure DB
ConfigureDB();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "5mb" }));

// Access log
app.use(
  morgan("combined", {
    stream: fs.createWriteStream(path.join(__dirname, "access.log"), {
      flags: "a",
    }),
  }),
);
// Routes
app.post("/api/register", UserCltr.register); // checked
app.post("/api/login", UserCltr.login); // checked
app.get("/api/profile", auth, UserCltr.getProfile); // checked
app.patch("/api/users/:id/role", auth, UserCltr.updateRole); // checked

// Artist routes
app.post("/api/artists", auth, artist, ArtistCltr.create);
app.get("/api/artists", ArtistCltr.list);
app.get("/api/artists/profile", auth, artist, ArtistCltr.getProfile);
app.put("/api/artists/profile", auth, artist, ArtistCltr.updateProfile);

// Admin Routes
app.get("/api/admin/stats", auth, admin, AdminCltr.getStats);
app.get("/api/admin/users", auth, admin, AdminCltr.listAllUsers);
app.put("/api/admin/users/:id", auth, admin, AdminCltr.updateUser);
app.delete("/api/admin/users/:id", auth, admin, AdminCltr.deleteUser);
app.post("/api/admin/artists", auth, admin, AdminCltr.createArtistProfile);
app.put("/api/admin/artists/:id", auth, admin, AdminCltr.updateArtistProfile);
app.post("/api/admin/events", auth, admin, AdminCltr.createEvent);
app.put("/api/admin/events/:id", auth, admin, AdminCltr.updateEvent);
app.delete("/api/admin/events/:id", auth, admin, AdminCltr.deleteEvent);

// Public/General Event routes
app.get("/api/events", EventCltr.list);
app.post("/api/events", auth, artist, EventCltr.create);
app.get("/api/events/artist/:artistId", EventCltr.getArtistEvents);
app.get("/api/events/my-bookings", auth, EventCltr.myBookings);
app.patch("/api/events/:id/book", auth, EventCltr.book);

app.listen(port, () => {
  console.log(`Your Tracker is running on port ${port}`);
});
