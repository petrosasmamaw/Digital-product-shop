import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item._id === newItem._id);
      if (existingItem) {
        existingItem.quantity += 1;
        existingItem.subtotal = existingItem.quantity * existingItem.price;
      } else {
        state.items.push({ ...newItem, quantity: 1, subtotal: newItem.price });
      }
      state.totalQuantity += 1;
      state.totalPrice += newItem.price;
    },
    removeFromCart(state, action) {
      const id = action.payload;
      const existingItem = state.items.find((item) => item._id === id);
      if (!existingItem) return;
      state.totalQuantity -= existingItem.quantity;
      state.totalPrice -= existingItem.subtotal;
      state.items = state.items.filter((item) => item._id !== id);
    },
    decreaseQuantity(state, action) {
      const id = action.payload;
      const existingItem = state.items.find((item) => item._id === id);
      if (!existingItem) return;
      if (existingItem.quantity === 1) {
        state.items = state.items.filter((item) => item._id !== id);
      } else {
        existingItem.quantity -= 1;
        existingItem.subtotal -= existingItem.price;
      }
      state.totalQuantity -= 1;
      state.totalPrice -= existingItem.price;
    },
    clearCart(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
  },
});

export const { addToCart, removeFromCart, decreaseQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
