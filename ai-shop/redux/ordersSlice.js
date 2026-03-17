import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchOrders, createOrder } from "@/utils/api";

// Async thunks
export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async (token, { rejectWithValue }) => {
    try {
      const data = await fetchOrders(token);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createUserOrder = createAsyncThunk(
  "orders/createUserOrder",
  async ({ orderData, token }, { rejectWithValue }) => {
    try {
      const data = await createOrder(orderData, token);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearOrdersError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createUserOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUserOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
      })
      .addCase(createUserOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrdersError } = ordersSlice.actions;
export default ordersSlice.reducer;