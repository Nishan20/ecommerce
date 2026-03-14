import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";
import { clearCart } from "./cartSlice";

// Create order
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/orders", orderData);
      toast.success(response.data.message || "Order placed successfully");
      return response.data.order;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to create order";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Get my orders
export const getMyOrders = createAsyncThunk(
  "order/getMyOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/orders/my-orders");
      return response.data.orders;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch orders";
      return rejectWithValue(message);
    }
  }
);

// Get single order
export const getSingleOrder = createAsyncThunk(
  "order/getSingleOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/orders/${orderId}`);
      return response.data.order;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch order";
      return rejectWithValue(message);
    }
  }
);

// Get all orders (Admin)
export const getAllOrders = createAsyncThunk(
  "order/getAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/orders/all-orders");
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch orders";
      return rejectWithValue(message);
    }
  }
);

// Update order status (Admin)
export const updateOrderStatus = createAsyncThunk(
  "order/updateOrderStatus",
  async ({ orderId, orderStatus }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/orders/${orderId}/status`, {
        orderStatus,
      });
      toast.success("Order status updated successfully");
      return response.data.order;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update order status";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Delete order (Admin)
export const deleteOrder = createAsyncThunk(
  "order/deleteOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/orders/${orderId}`);
      toast.success("Order deleted successfully");
      return orderId;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete order";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  orders: [],
  currentOrder: null,
  allOrders: [],
  isLoading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get My Orders
      .addCase(getMyOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(getMyOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Single Order
      .addCase(getSingleOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSingleOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(getSingleOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get All Orders (Admin)
      .addCase(getAllOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allOrders = action.payload.orders;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Order Status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.allOrders.findIndex(
          (order) => order.id === action.payload.id
        );
        if (index !== -1) {
          state.allOrders[index] = action.payload;
        }
      })
      // Delete Order
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.allOrders = state.allOrders.filter(
          (order) => order.id !== action.payload
        );
      });
  },
});

export const { clearCurrentOrder, clearError } = orderSlice.actions;
export default orderSlice.reducer;

