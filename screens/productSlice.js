import { createSlice } from '@reduxjs/toolkit';

const productSlice = createSlice({
  name: 'products',
  initialState: {
    apiProducts: [],
    userAddedProducts: [],
    searchResults: [],
  },
  reducers: {
    setApiProducts: (state, action) => {
      state.apiProducts = action.payload;
    },
    addUserProduct: (state, action) => {
      state.userAddedProducts.unshift(action.payload);
    },
    updateUserProduct: (state, action) => {
      const updatedProduct = action.payload;
      state.userAddedProducts = state.userAddedProducts.map(product =>
        product.id === updatedProduct.id ? updatedProduct : product
      );
    },
    deleteUserProduct: (state, action) => {
      const productId = action.payload;
      state.userAddedProducts = state.userAddedProducts.filter(product => product.id !== productId);
    },
    searchProducts: (state, action) => {
      const query = action.payload.toLowerCase();
      const combinedProducts = [...state.apiProducts, ...state.userAddedProducts];
      state.searchResults = combinedProducts.filter(product =>
        product.title.toLowerCase().includes(query)
      );
    },
  },
});

export const { setApiProducts, addUserProduct, updateUserProduct, deleteUserProduct, searchProducts } = productSlice.actions;
export default productSlice.reducer;
