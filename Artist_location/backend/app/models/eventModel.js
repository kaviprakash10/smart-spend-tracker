import mongoose from "mongoose";
const { Schema, model } = mongoose;
const eventSchema = new Schema(
  {
    artist: {
      type: Schema.Types.ObjectId,
      ref: "Artist",
      required: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    venueName: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
    },

    latitude: {
      type: Number,
    },

    longitude: {
      type: Number,
    },

    eventDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["UPCOMING", "COMPLETED", "CANCELLED"],
      default: "UPCOMING",
    },

    totalPerson: {
      type: Number,
      required: true,
    },

    booked: {
      type: Number,
      default: 0,
    },

    bookedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);

// Prevent duplicate event
eventSchema.index({ artist: 1, venueName: 1, eventDate: 1 }, { unique: true });

const Event = model("Event", eventSchema);

export default Event;
