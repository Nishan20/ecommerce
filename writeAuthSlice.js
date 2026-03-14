const fs = require('fs');
const content = `import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/register", userData);
      toast.success(response.data.message || "Registration successful!");
      return response.data.user;
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/login", credentials);
      toast.success(response.data.message || "Login successful!");
      return response.data.user;
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
