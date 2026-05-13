import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";

import User from "./app/models/userModels.js";
import Artist from "./app/models/artistModel.js";
import Fan from "./app/models/fanModel.js";
import Event from "./app/models/eventModel.js";

dotenv.config();

const TOTAL_ARTISTS = 300;
const TOTAL_FANS = 1000;
const TOTAL_VENUES = 200;
const TOTAL_EVENTS = 300;

async function seedDatabase() {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected Successfully!");

    console.log("Clearing existing data...");
    await User.deleteMany({});
    await Artist.deleteMany({});
    await Fan.deleteMany({});
    await Event.deleteMany({});

    const passwordHash = await bcryptjs.hash("Password@123", 10);

    console.log("1. Generating Admin...");
    const adminUser = new User({
      userName: "Admin User",
      email: "admin@example.com",
      password: passwordHash,
      role: "admin",
    });
    await adminUser.save();

    console.log(`2. Generating ${TOTAL_ARTISTS} Artists...`);
    const artistsData = [];
    const usersArtistData = [];
    for (let i = 0; i < TOTAL_ARTISTS; i++) {
      const user = new User({
        userName: faker.internet.username(),
        email: faker.internet.email(),
        password: passwordHash,
        role: "artist",
      });
      usersArtistData.push(user);
    }
    const insertedArtistsUsers = await User.insertMany(usersArtistData);

    for (const user of insertedArtistsUsers) {
      artistsData.push({
        user: user._id,
        artistName: faker.person.fullName(),
        genre: faker.music.genre(),
        bio: faker.lorem.paragraph(),
        profileImage: faker.image.avatar(),
        instagram: `https://instagram.com/${user.userName}`,
        twitter: `https://twitter.com/${user.userName}`,
      });
    }
    const insertedArtists = await Artist.insertMany(artistsData);

    console.log(`3. Generating ${TOTAL_FANS} Fans...`);
    const usersFanData = [];
    for (let i = 0; i < TOTAL_FANS; i++) {
      usersFanData.push({
        userName: faker.internet.username(),
        email: faker.internet.email(),
        password: passwordHash,
        role: "fan",
      });
    }
    const insertedFansUsers = await User.insertMany(usersFanData);

    const fansData = [];
    for (const user of insertedFansUsers) {
      // Pick a few random favorite artists
      const randomArtistCount = faker.number.int({ min: 1, max: 4 });
      const favArtists = faker.helpers
        .arrayElements(insertedArtists, randomArtistCount)
        .map((a) => a._id);

      fansData.push({
        user: user._id,
        favoriteArtists: favArtists,
      });
    }
    const insertedFans = await Fan.insertMany(fansData);

    console.log(`4. Generating ${TOTAL_VENUES} Venues...`);
    const venuesPool = [];
    for (let i = 0; i < TOTAL_VENUES; i++) {
      venuesPool.push({
        venueName: faker.company.name() + " Arena",
        address: faker.location.streetAddress(),
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
      });
    }

    console.log(`5. Generating ${TOTAL_EVENTS} Events...`);
    const eventsData = [];
    for (let i = 0; i < TOTAL_EVENTS; i++) {
      const randomArtist = faker.helpers.arrayElement(insertedArtists);
      const randomVenue = faker.helpers.arrayElement(venuesPool);

      // Events in the future
      const eventDate = faker.date.future({ years: 1 });
      const totalPerson = faker.number.int({ min: 100, max: 1000 });

      eventsData.push({
        artist: randomArtist._id,
        createdBy: randomArtist.user,
        venueName: randomVenue.venueName,
        address: randomVenue.address,
        latitude: randomVenue.latitude,
        longitude: randomVenue.longitude,
        eventDate: eventDate,
        status: "UPCOMING",
        totalPerson: totalPerson,
        booked: 0,
        bookedBy: [],
      });
    }
    const insertedEvents = await Event.insertMany(eventsData);

    console.log(`6. Attending fans to events (5-6 events per fan)...`);
    // Randomize the order of events to spread bookings out

    // Convert Mongoose documents to plain arrays to allow fast modification
    const updatableEvents = insertedEvents.map((e) => ({
      _id: e._id,
      booked: 0,
      bookedBy: [],
      totalPerson: e.totalPerson,
    }));

    for (const fan of insertedFansUsers) {
      const eventsToAttend = faker.number.int({ min: 5, max: 6 });
      const randomSelectedEvents = faker.helpers.arrayElements(
        updatableEvents,
        eventsToAttend,
      );

      for (const event of randomSelectedEvents) {
        if (event.booked < event.totalPerson) {
          event.bookedBy.push(fan._id);
          event.booked += 1;
        }
      }
    }

    // Now bulk update the events in DB
    console.log("Saving attended events to Database...");
    const bulkEventOps = updatableEvents
      .filter((e) => e.booked > 0)
      .map((e) => ({
        updateOne: {
          filter: { _id: e._id },
          update: { $set: { bookedBy: e.bookedBy, booked: e.booked } },
        },
      }));

    if (bulkEventOps.length > 0) {
      await Event.bulkWrite(bulkEventOps);
    }

    console.log("✅ Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
