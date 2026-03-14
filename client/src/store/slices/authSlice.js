import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

// Check auth status
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/auth/me");
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Not authenticated");
    }
  }
);

// Register
export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/register", userData);
      toast.success(response.data.message || "Registration successful");
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Login
export const login = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/login", userData);
      toast.success(response.data.message || "Login successful");
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Logout
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/auth/logout");
      toast.success(response.data.message || "Logout successful");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);

// Update profile
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put("/auth/profile/update", userData);
      toast.success(response.data.message || "Profile updated successfully");
      return response.data.user;
    } catch (error) {
      const message = error.response?.data?.message || "Profile update failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Update password
export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put("/auth/password/update", passwordData);
      toast.success(response.data.message || "Password updated successfully");
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Password update failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Forgot password
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/auth/password/forgot", { email });
      toast.success(response.data.message || "Password reset link sent");
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to send reset link";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Reset password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/auth/password/reset/${token}`, {
        password,
        confirmPassword: password,
      });
      toast.success(response.data.message || "Password reset successful");
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Password reset failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isUpdatingPassword: false,
  isCheckingAuth: true,
  isAuthenticated: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetAuthState: (state) => {
      state.isSigningUp = false;
      state.isLoggingIn = false;
      state.isUpdatingProfile = false;
      state.isUpdatingPassword = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.isCheckingAuth = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isCheckingAuth = false;
        state.isAuthenticated = true;
        state.authUser = action.payload;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isCheckingAuth = false;
        state.isAuthenticated = false;
        state.authUser = null;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.isSigningUp = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isSigningUp = false;
        state.isAuthenticated = true;
        state.authUser = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.isSigningUp = false;
        state.error = action.payload;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoggingIn = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggingIn = false;
        state.isAuthenticated = true;
        state.authUser = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoggingIn = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.authUser = null;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isUpdatingProfile = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isUpdatingProfile = false;
        state.authUser = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isUpdatingProfile = false;
        state.error = action.payload;
      })
      // Update Password
      .addCase(updatePassword.pending, (state) => {
        state.isUpdatingPassword = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.isUpdatingPassword = false;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.isUpdatingPassword = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetAuthState } = authSlice.actions;
export default authSlice.reducer;

