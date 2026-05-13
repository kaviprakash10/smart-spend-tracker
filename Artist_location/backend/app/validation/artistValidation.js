import Joi from "joi";

const ArtistValidationSchema = Joi.object({
  genre: Joi.string().trim().min(2).required(),
  bio: Joi.string().trim().min(10).optional().allow(""),
  profileImage: Joi.string().optional().allow(""),
  instagram: Joi.string().optional().allow(""),
  twitter: Joi.string().optional().allow(""),
});

export { ArtistValidationSchema };
