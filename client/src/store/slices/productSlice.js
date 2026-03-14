import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

// Get all products
export const getAllProducts = createAsyncThunk(
  "product/getAllProducts",
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await axiosInstance.get(`/products?${queryParams}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch products";
      return rejectWithValue(message);
    }
  }
);

// Get single product
export const getSingleProduct = createAsyncThunk(
  "product/getSingleProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/products/${productId}`);
      return response.data.product;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch product";
      return rejectWithValue(message);
    }
  }
);

// Get all categories
export const getAllCategories = createAsyncThunk(
  "product/getAllCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/products/categories");
      return response.data.categories;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch categories";
      return rejectWithValue(message);
    }
  }
);

// Create product (Admin)
export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/products", productData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Product created successfully");
      return response.data.product;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to create product";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Update product (Admin)
export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({ productId, productData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/products/${productId}`, productData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Product updated successfully");
      return response.data.product;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update product";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Delete product (Admin)
export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/products/${productId}`);
      toast.success("Product deleted successfully");
      return productId;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete product";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Create category (Admin)
export const createCategory = createAsyncThunk(
  "product/createCategory",
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/products/categories", categoryData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Category created successfully");
      return response.data.category;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to create category";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Delete category (Admin)
export const deleteCategory = createAsyncThunk(
  "product/deleteCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/products/categories/${categoryId}`);
      toast.success("Category deleted successfully");
      return categoryId;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete category";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Create review
export const createReview = createAsyncThunk(
  "product/createReview",
  async ({ productId, rating, comment }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/products/${productId}/review`, {
        rating,
        comment,
        productId,
      });
      toast.success("Review added successfully");
      return response.data.review;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to add review";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  products: [],
  product: null,
  categories: [],
  totalProducts: 0,
  totalPages: 1,
  currentPage: 1,
  isLoading: false,
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearProduct: (state) => {
      state.product = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Products
      .addCase(getAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
        state.totalProducts = action.payload.totalProducts;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Single Product
      .addCase(getSingleProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSingleProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.product = action.payload;
      })
      .addCase(getSingleProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get All Categories
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      // Create Product
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload);
      })
      // Update Product
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      // Delete Product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload);
      })
      // Create Category
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      // Delete Category
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter((c) => c.id !== action.payload);
      });
  },
});

export const { clearProduct, clearError } = productSlice.actions;
export default productSlice.reducer;

