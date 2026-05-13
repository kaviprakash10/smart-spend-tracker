import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/authSlice";
import adminReducer from "../slice/adminSlice";
import artistReducer from "../slice/artistSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    artist: artistReducer,
  },
});
export default store;
