import User from "../models/userModels.js";
import Artist from "../models/artistModel.js";
import Event from "../models/eventModel.js";
import axiosBackend from "axios";

const AdminCltr = {};

const getCoordinates = async (address) => {
  console.log(`🔍 Geocoding address: "${address}"`);
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

AdminCltr.getStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const artistCount = await Artist.countDocuments();
    const eventCount = await Event.countDocuments();

    const recentEvents = await Event.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("artist", "artistName");

    res.json({
      counts: {
        users: userCount,
        artists: artistCount,
        events: eventCount,
      },
      recentEvents,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};

AdminCltr.listAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const role = req.query.role;
    const skip = (page - 1) * limit;

    const query = role ? { role } : {};

    const users = await User.find(query)
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      users,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

AdminCltr.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to update user" });
  }
};

AdminCltr.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};

AdminCltr.createArtistProfile = async (req, res) => {
  const { userId, genre, bio } = req.body;
  try {
    const existing = await Artist.findOne({ user: userId });
    if (existing)
      return res
        .status(400)
        .json({ error: "Artist profile already exists for this user" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const artist = new Artist({
      user: userId,
      artistName: user.userName,
      genre,
      bio,
    });
    await artist.save();
    await artist.populate("user", "userName email");
    res.status(201).json(artist);
  } catch (err) {
    res.status(500).json({ error: "Failed to create artist profile" });
  }
};

AdminCltr.updateArtistProfile = async (req, res) => {
  try {
    const artist = await Artist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("user", "userName email");
    if (!artist)
      return res.status(404).json({ error: "Artist profile not found" });
    res.json(artist);
  } catch (err) {
    res.status(500).json({ error: "Failed to update artist profile" });
  }
};

AdminCltr.createEvent = async (req, res) => {
  try {
    const coords = await getCoordinates(req.body.address);
    const event = new Event({
      ...req.body,
      latitude: coords.lat,
      longitude: coords.lng,
      createdBy: req.user.userId,
    });
    await event.save();
    await event.populate("artist", "artistName");
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: "Failed to create event" });
  }
};

AdminCltr.updateEvent = async (req, res) => {
  try {
    let updateData = { ...req.body };
    if (req.body.address) {
      const coords = await getCoordinates(req.body.address);
      updateData.latitude = coords.lat;
      updateData.longitude = coords.lng;
    }
    const event = await Event.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    }).populate("artist", "artistName");
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: "Failed to update event" });
  }
};

AdminCltr.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete event" });
  }
};

export default AdminCltr;
