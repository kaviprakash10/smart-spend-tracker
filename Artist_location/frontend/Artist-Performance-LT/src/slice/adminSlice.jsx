import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios";

// Thunks
export const fetchAdminStats = createAsyncThunk(
  "admin/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/admin/stats", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch stats",
      );
    }
  },
);

export const fetchAllUsers = createAsyncThunk(
  "admin/fetchAllUsers",
  async (
    { page = 1, limit = 50, role } = {},
    { rejectWithValue },
  ) => {
    try {
      const response = await axios.get("/admin/users", {
        params: {
          page,
          limit,
          ...(role ? { role } : {}),
        },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch users",
      );
    }
  },
);

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to delete user",
      );
    }
  },
);

export const fetchAllArtists = createAsyncThunk(
  "admin/fetchAllArtists",
  async ({ page = 1, limit = 50 } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get("/artists", {
        params: { page, limit },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch artists",
      );
    }
  },
);

export const promoteToArtist = createAsyncThunk(
  "admin/promoteToArtist",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/admin/artists", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Artist profile created successfully!");
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to promote user",
      );
    }
  },
);

export const updateArtistProfile = createAsyncThunk(
  "admin/updateArtistProfile",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/admin/artists/${id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to update artist profile",
      );
    }
  },
);

export const updateUser = createAsyncThunk(
  "admin/updateUser",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/admin/users/${id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to update user",
      );
    }
  },
);

export const updateRole = createAsyncThunk(
  "admin/updateRole",
  async ({ id, role }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `/users/${id}/role`,
        { role },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      return { id, role: response.data.role || role };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to update role",
      );
    }
  },
);

export const createEvent = createAsyncThunk(
  "admin/createEvent",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/admin/events", formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Event created successfully");
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to create event",
      );
    }
  },
);

export const updateEvent = createAsyncThunk(
  "admin/updateEvent",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/admin/events/${id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to update event",
      );
    }
  },
);

export const fetchAllEvents = createAsyncThunk(
  "admin/fetchAllEvents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/events");
      // response.data includes pagination info; we only need the list
      const payload = response.data;
      if (Array.isArray(payload)) return payload;
      if (payload && Array.isArray(payload.events)) return payload.events;
      return [];
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch events",
      );
    }
  },
);

export const deleteEvent = createAsyncThunk(
  "admin/deleteEvent",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/admin/events/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to delete event",
      );
    }
  },
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    stats: null,
    users: [],
    events: [],
    artists: [], // Added artists
    userPagination: {
      page: 1,
      pages: 1,
      total: 0,
      limit: 50,
      role: null,
    },
    userTotals: {
      artist: 0,
      fan: 0,
    },
    artistPagination: {
      page: 1,
      pages: 1,
      total: 0,
      limit: 50,
    },
    loading: false,
    error: null,
  },
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
    resetAdmin: (state) => {
      state.stats = null;
      state.users = [];
      state.events = [];
      state.artists = [];
      state.userPagination = {
        page: 1,
        pages: 1,
        total: 0,
        limit: 50,
        role: null,
      };
      state.userTotals = { artist: 0, fan: 0 };
      state.artistPagination = {
        page: 1,
        pages: 1,
        total: 0,
        limit: 50,
      };
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Stats
      .addCase(fetchAdminStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
        state.events = action.payload.recentEvents; // Use recent events for initial view
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users || [];
        const role = action.meta?.arg?.role || null;
        state.userPagination = {
          page: action.payload.page || 1,
          pages: action.payload.pages || 1,
          total: action.payload.total || 0,
          limit: action.payload.limit || 50,
          role,
        };
        if (role === "artist" || role === "fan") {
          state.userTotals[role] = action.payload.total || 0;
        }
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Artists
      .addCase(fetchAllArtists.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllArtists.fulfilled, (state, action) => {
        state.loading = false;
        state.artists = action.payload.artists || [];
        state.artistPagination = {
          page: action.payload.page || 1,
          pages: action.payload.pages || 1,
          total: action.payload.total || 0,
          limit: action.payload.limit || 50,
        };
      })
      .addCase(fetchAllArtists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete User
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.payload);
      })
      // Create Event
      .addCase(createEvent.fulfilled, (state, action) => {
        state.events.unshift(action.payload);
      })
      // Promote to Artist
      .addCase(promoteToArtist.fulfilled, (state, action) => {
        state.artists.push(action.payload);
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        const user = state.users.find((u) => u._id === action.payload.id);
        if (user) user.role = action.payload.role;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (u) => u._id === action.payload._id,
        );
        if (index !== -1) state.users[index] = action.payload;
      })
      .addCase(updateArtistProfile.fulfilled, (state, action) => {
        const index = state.artists.findIndex(
          (a) => a._id === action.payload._id,
        );
        if (index !== -1) state.artists[index] = action.payload;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex(
          (e) => e._id === action.payload._id,
        );
        if (index !== -1) state.events[index] = action.payload;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.events = state.events.filter((e) => e._id !== action.payload);
      })
      .addCase(fetchAllEvents.fulfilled, (state, action) => {
        // make sure we always store an array and not undefined/object
        state.events = Array.isArray(action.payload) ? action.payload : [];
      });
  },
});

export const { clearAdminError, resetAdmin } = adminSlice.actions;
export default adminSlice.reducer;
