import Artist from "../models/artistModel.js";
import User from "../models/userModels.js";
import { ArtistValidationSchema } from "../validation/artistValidation.js";

const ArtistCltr = {};

ArtistCltr.create = async (req, res) => {
  const { body } = req;
  const { error, value } = ArtistValidationSchema.validate(body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const existingArtist = await Artist.findOne({ user: req.user.userId });
    if (existingArtist) {
      return res.status(400).json({ error: "Artist profile already exists" });
    }

    // Auto-set artistName from the logged-in user's userName
    const user = await User.findById(req.user.userId);
    const artist = new Artist({
      ...value,
      artistName: user.userName,
      user: req.user.userId,
    });

    await artist.save();
    res.status(201).json(artist);
  } catch (err) {
    res.status(500).json({ error: "Failed to create artist profile" });
  }
};

ArtistCltr.list = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const artists = await Artist.find()
      .populate("user", "userName email")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Artist.countDocuments();

    res.json({
      artists,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch artists" });
  }
};

ArtistCltr.getProfile = async (req, res) => {
  try {
    const artist = await Artist.findOne({ user: req.user.userId }).populate(
      "user",
      "userName email",
    );
    if (!artist) {
      return res.status(404).json({ error: "Artist profile not found" });
    }
    res.json(artist);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch artist profile" });
  }
};

ArtistCltr.updateProfile = async (req, res) => {
  const { body } = req;
  const { error, value } = ArtistValidationSchema.validate(body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    // Auto-set artistName from user's userName
    const user = await User.findById(req.user.userId);

    const artist = await Artist.findOneAndUpdate(
      { user: req.user.userId },
      { ...value, artistName: user.userName, user: req.user.userId },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    ).populate("user", "userName email");

    res.json(artist);
  } catch (err) {
    res.status(500).json({ error: "Failed to update artist profile" });
  }
};

export default ArtistCltr;
