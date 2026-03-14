import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

// Fetch dashboard stats
export const fetchStats = createAsyncThunk(
  "admin/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/admin/dashboard-stats");
      // return entire payload so we have stats and recent lists
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch stats";
      return rejectWithValue(message);
    }
  }
);

// Fetch users (paginated maybe)
export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/admin/users?page=${page}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch users";
      return rejectWithValue(message);
    }
  }
);

// Update user role
export const updateUserRole = createAsyncThunk(
  "admin/updateUserRole",
  async ({ id, role }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/admin/users/${id}/role`, { role });
      toast.success(response.data.message || "User role updated");
      return response.data.user;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update role";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Delete user
export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/admin/users/${id}`);
      toast.success(response.data.message || "User deleted");
      return id;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete user";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  stats: null,
  recentOrders: [],
  recentUsers: [],
  users: [],
  totalUsers: 0,
  currentPage: 1,
  totalPages: 1,
  isLoading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.stats;
        state.recentOrders = action.payload.recentOrders;
        state.recentUsers = action.payload.recentUsers;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.users;
        state.totalUsers = action.payload.totalUsers;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const idx = state.users.findIndex((u) => u.id === action.payload.id);
        if (idx !== -1) state.users[idx] = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
      });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;
