import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import userReducer from "./userSlice";
import ordersReducer from "./ordersSlice";
import productsReducer from "./productsSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,
    orders: ordersReducer,
    products: productsReducer,
  },
});
