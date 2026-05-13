import Event from "../models/eventModel.js";
import { EventValidationSchema } from "../validation/eventValidation.js";

const EventCltr = {};

import axiosBackend from "axios";

const getCoordinates = async (address) => {
  console.log(`🔍 Geocoding address (Public): "${address}"`);
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
    const response = await axiosBackend.get(url, {
      headers: {
        "User-Agent": "ArtistPerformanceTracker/1.0",
      },
    });

    if (response.data && response.data.length > 0) {
      const result = {
        lat: parseFloat(response.data[0].lat),
        lng: parseFloat(response.data[0].lon),
      };
      console.log(`✅ Found coordinates: ${result.lat}, ${result.lng}`);
      return result;
    } else {
      console.warn(`⚠️ No coordinates found for: "${address}"`);
    }
  } catch (err) {
    console.error("❌ Geocoding error:", err.message);
  }
  return { lat: null, lng: null };
};

EventCltr.create = async (req, res) => {
  const { body } = req;
  const { error, value } = EventValidationSchema.validate(body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    // Check if artist already has a performance on this date
    const startOfDay = new Date(value.eventDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(value.eventDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingEvent = await Event.findOne({
      artist: value.artist,
      eventDate: { $gte: startOfDay, $lte: endOfDay },
    });

    if (existingEvent) {
      return res.status(400).json({
        error: "This artist already has a scheduled performance on this date.",
      });
    }

    const coords = await getCoordinates(value.address);

    const event = new Event({
      ...value,
      latitude: coords.lat,
      longitude: coords.lng,
      createdBy: req.user.userId,
    });

    await event.save();
    res.status(201).json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create event" });
  }
};

EventCltr.list = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const events = await Event.find()
      .populate("artist", "artistName genre")
      .populate("createdBy", "username")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Event.countDocuments();

    res.json({
      events,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

EventCltr.getArtistEvents = async (req, res) => {
  const { artistId } = req.params;
  try {
    const events = await Event.find({ artist: artistId });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch events for artist" });
  }
};

EventCltr.book = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    if (event.bookedBy && event.bookedBy.includes(req.user.userId)) {
      return res
        .status(400)
        .json({ error: "You have already booked this ritual" });
    }

    if (event.booked >= event.totalPerson) {
      return res.status(400).json({ error: "Event is fully booked" });
    }

    event.booked += 1;
    if (!event.bookedBy) event.bookedBy = [];
    event.bookedBy.push(req.user.userId);
    await event.save();

    // Return populated event to mirror getArtistEvents
    await event.populate("artist", "artistName genre");
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to book event" });
  }
};

EventCltr.myBookings = async (req, res) => {
  try {
    const events = await Event.find({ bookedBy: req.user.userId }).populate(
      "artist",
      "artistName genre",
    );
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch your bookings" });
  }
};

export default EventCltr;
