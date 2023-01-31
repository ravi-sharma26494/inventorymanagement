import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import productService from './productService';

const initialState = {
    product: null,
    products: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
    totalStoreValue: 0,
    outOfStock: 0,
    category: [],

};

// Create new product
export const createProduct = createAsyncThunk(
    "products/create",
    async(formData, thunkAPI)=>{
        try {
            return await productService.createProduct(formData)
        } catch (error) {

            const message = (
                error.response && error.response.data  && error.response.data.message
            ) || error.message || error.toString();
            console.log(message);
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get All Products
export const getProducts = createAsyncThunk(
    "products/getAll",
    async(_, thunkAPI)=>{
        try {
            return await productService.getProducts();
        } catch (error) {

            const message = (
                error.response && error.response.data  && error.response.data.message
            ) || error.message || error.toString();
            console.log(message);
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    CALC_STORE_VALUE(state, action){
        const products = action.payload;
        const array = [];
        products.map((item)=>{
            const {price, quantity} = item;
            const productValue = price * quantity;
            return array.push(productValue);
        })

        const totalValue = array.reduce((a,b)=>{
            return a + b;
        },0)
        state.totalStoreValue = totalValue;
    }
  },
  extraReducers: (builder)=>{
    builder
        .addCase(createProduct.pending, (state)=>{
            state.isLoading = true;
        })
        .addCase(createProduct.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            console.log(action.payload);
            state.products.push(action.payload);
            toast.success("Product added successfully");
        })
        .addCase(createProduct.rejected, (state, action)=>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
            toast.error(action.payload);
        })
        .addCase(getProducts.pending, (state)=>{
            state.isLoading = true;
        })
        .addCase(getProducts.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            console.log(action.payload);
            state.products = action.payload;

        })
        .addCase(getProducts.rejected, (state, action)=>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
            toast.error(action.payload);
        })
  }
});

export const {CALC_STORE_VALUE} = productSlice.actions

export const selectIsloading = (state)=>state.product.isLoading; // exporting the isLoading state
export const selectTotalStoreValue = (state)=>state.product.totalStoreValue; // exporting the isLoading state
export default productSlice.reducer