import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchProducts, getAiRecommendations } from "@/utils/api";

// Async thunks
export const fetchProductsAsync = createAsyncThunk(
  "products/fetchProducts",
  async (params, { rejectWithValue }) => {
    try {
      const data = await fetchProducts(params);
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
      const data = await getAiRecommendations(queryData);
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