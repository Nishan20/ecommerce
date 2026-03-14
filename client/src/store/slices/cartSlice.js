import { createSlice } from "@reduxjs/toolkit";

// Get cart from localStorage
const getInitialCart = () => {
  if (typeof window !== "undefined") {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      return JSON.parse(savedCart);
    }
  }
  return {
    items: [],
    shippingInfo: null,
  };
};

const initialState = {
  items: getInitialCart().items || [],
  shippingInfo: getInitialCart().shippingInfo || null,
  isLoading: false,
};

// Save cart to localStorage
const saveCart = (items, shippingInfo) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(
      "cart",
      JSON.stringify({ items, shippingInfo })
    );
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(
        (item) => item.product === product.id
      );

      if (existingItem) {
        // Check stock
        if (existingItem.quantity + quantity <= product.stock) {
          existingItem.quantity += quantity;
        }
      } else {
        state.items.push({
          product: product.id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || "",
          quantity,
          stock: product.stock,
        });
      }

      saveCart(state.items, state.shippingInfo);
    },
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(
        (item) => item.product !== productId
      );
      saveCart(state.items, state.shippingInfo);
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(
        (item) => item.product === productId
      );

      if (item && quantity > 0 && quantity <= item.stock) {
        item.quantity = quantity;
      } else if (quantity <= 0) {
        state.items = state.items.filter(
          (item) => item.product !== productId
        );
      }

      saveCart(state.items, state.shippingInfo);
    },
    clearCart: (state) => {
      state.items = [];
      state.shippingInfo = null;
      saveCart([], null);
    },
    setShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;
      saveCart(state.items, state.shippingInfo);
    },
  },
});

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) =>
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
export const selectCartItemsCount = (state) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0);
export const selectShippingInfo = (state) => state.cart.shippingInfo;

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setShippingInfo,
} = cartSlice.actions;

export default cartSlice.reducer;

