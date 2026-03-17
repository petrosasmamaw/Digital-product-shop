import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE_URL = "http://localhost:5000/api";

// Async thunks
export const fetchProductsAsync = createAsyncThunk(
  "products/fetchProducts",
  async (params, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams(params);
      const res = await fetch(`${API_BASE_URL}/products?${query}`);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProductAsync = createAsyncThunk(
  "products/fetchProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${productId}`);
      if (!res.ok) throw new Error("Failed to fetch product");
      const data = await res.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getAiRecommendationsAsync = createAsyncThunk(
  "products/getAiRecommendations",
  async (queryData, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/ai/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(queryData),
      });
      if (!res.ok) throw new Error("Failed to get AI recommendations");
      const data = await res.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    total: 0,
    loading: false,
    error: null,
    currentProduct: null,
    productLoading: false,
    productError: null,
    aiResults: null,
    aiLoading: false,
    aiError: null,
  },
  reducers: {
    clearProductsError(state) {
      state.error = null;
    },
    clearAiResults(state) {
      state.aiResults = null;
      state.aiError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products || [];
        state.total = action.payload.total || 0;
      })
      .addCase(fetchProductsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductAsync.pending, (state) => {
        state.productLoading = true;
        state.productError = null;
      })
      .addCase(fetchProductAsync.fulfilled, (state, action) => {
        state.productLoading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductAsync.rejected, (state, action) => {
        state.productLoading = false;
        state.productError = action.payload;
      })
      .addCase(getAiRecommendationsAsync.pending, (state) => {
        state.aiLoading = true;
        state.aiError = null;
      })
      .addCase(getAiRecommendationsAsync.fulfilled, (state, action) => {
        state.aiLoading = false;
        state.aiResults = action.payload;
      })
      .addCase(getAiRecommendationsAsync.rejected, (state, action) => {
        state.aiLoading = false;
        state.aiError = action.payload;
      });
  },
});

export const { clearProductsError, clearAiResults } = productsSlice.actions;
export default productsSlice.reducer;