import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import orderReducer from "./slices/orderSlice";
import productReducer from "./slices/productSlice";
import adminReducer from "./slices/adminSlice";
import popupReducer from "./slices/popupSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    order: orderReducer,
    product: productReducer,
    admin: adminReducer,
    popup: popupReducer,
  },
});

export default store;

