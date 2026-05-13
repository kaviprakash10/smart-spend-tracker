import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios";

export const fetchArtistProfile = createAsyncThunk(
  "artist/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/artists/profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return response.data;
    } catch (err) {
      if (err.response?.status === 404) {
        return null; // No profile yet — this is valid, not an error
      }
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch artist profile",
      );
    }
  },
);

export const updateArtistProfile = createAsyncThunk(
  "artist/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.put("/artists/profile", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Profile updated successfully!");
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to update profile",
      );
    }
  },
);

export const fetchMyEvents = createAsyncThunk(
  "artist/fetchMyEvents",
  async (artistId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/events/artist/${artistId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch events",
      );
    }
  },
);

export const addEvent = createAsyncThunk(
  "artist/addEvent",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/events", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Event manifested successfully!");
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to create event",
      );
    }
  },
);

const artistSlice = createSlice({
  name: "artist",
  initialState: {
    profile: null,
    events: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearArtistError: (state) => {
      state.error = null;
    },
    resetArtist: (state) => {
      state.profile = null;
      state.events = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArtistProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchArtistProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchArtistProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateArtistProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateArtistProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateArtistProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchMyEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addEvent.pending, (state) => {
        state.loading = true;
      })
      .addCase(addEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events.push(action.payload);
      })
      .addCase(addEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearArtistError, resetArtist } = artistSlice.actions;
export default artistSlice.reducer;
