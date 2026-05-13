const artist = (req, res, next) => {
  if (req.user.role !== "artist") {
    return res.status(403).json({ message: "Access denied. Artists only." });
  }
  next();
};

export default artist;
