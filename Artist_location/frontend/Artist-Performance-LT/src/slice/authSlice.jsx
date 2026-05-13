import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axios";

export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ formData, redirect }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/register", formData);
      alert("successfully registered");
      redirect();
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.error || "Registration failed";
      return rejectWithValue(msg);
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ formData, redirect }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/login", formData);
      localStorage.setItem("token", response.data.token);
      redirect();
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.error || "Login failed";
      return rejectWithValue(msg);
    }
  },
);

export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch profile",
      );
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isLoggedIn: !!localStorage.getItem("token"),
    error: null,
    loading: false,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      state.user = null;
      state.isLoggedIn = false;
    },
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.loading = false;
        state.isLoggedIn = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isLoggedIn = false;
        localStorage.removeItem("token");
      });
  },
});

export const { logout, clearErrors } = authSlice.actions;
export default authSlice.reducer;
