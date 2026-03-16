import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../store/slices/authSlice";
import cartReducer from "../store/slices/cartSlice";
import orderReducer from "../store/slices/orderSlice";
import productReducer from "../store/slices/productSlice";
import adminReducer from "../store/slices/adminSlice";
import popupReducer from "../store/slices/popupSlice";

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
