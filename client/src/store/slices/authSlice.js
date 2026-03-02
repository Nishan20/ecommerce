import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (formData, thunkAPI) => {
    try {
      const res = await axiosInstance.put("/auth/profile/update", formData);
      toast.success(res?.data?.message || "Profile updated");
      return res?.data?.user || null;
    } catch (error) {
      const msg =
        error?.response?.data?.message || "Failed to update profile";
      toast.error(msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async (formData, thunkAPI) => {
    try {
      const res = await axiosInstance.put("/auth/password/update", formData);
      toast.success(res?.data?.message || "Password updated");
      return null;
    } catch (error) {
      const msg =
        error?.response?.data?.message || "Failed to update password";
      toast.error(msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    await axiosInstance.get("/auth/logout");
    toast.success("Logged out");
    return null;
  } catch (error) {
    const msg = error?.response?.data?.message || "Failed to logout";
    toast.error(msg);
    return thunkAPI.rejectWithValue(msg);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    authUser: null,
    isUpdatingProfile: false,
    isUpdatingPassword: false,
    isCheckingAuth: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isUpdatingProfile = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isUpdatingProfile = false;
        state.authUser = action.payload;
      })
      .addCase(updateProfile.rejected, (state) => {
        state.isUpdatingProfile = false;
      })
      .addCase(updatePassword.pending, (state) => {
        state.isUpdatingPassword = true;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.isUpdatingPassword = false;
      })
      .addCase(updatePassword.rejected, (state) => {
        state.isUpdatingPassword = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.authUser = null;
      });
  },
});

export default authSlice.reducer;
