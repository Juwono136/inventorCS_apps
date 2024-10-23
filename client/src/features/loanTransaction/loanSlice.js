import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import loanService from "./loanService"
import tokenService from "../token/tokenService"

const initialState = {
    cartItems: [],
    loanData: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
};

// get all loan transaction
export const getAllLoanTransactions = createAsyncThunk('loan/all', async (token, thunkAPI) => {
    try {
        const tokenData = await tokenService.accessToken(token)

        return await loanService.getAllLoanTransactions(tokenData)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

// create loan transaction
export const createLoanTransaction = createAsyncThunk('loan/create', async (data, thunkAPI) => {
    try {
        const token = await tokenService.accessToken(data)

        return await loanService.createLoanTransaction(data, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

export const loanSlice = createSlice({
    name: 'loan',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;
            const existingItem = state.cartItems.find(i => i._id === item._id);

            if (existingItem) {
                if (existingItem.quantity < item.total_items) {
                    existingItem.quantity += 1;
                }
            } else {
                state.cartItems.push({ ...item, quantity: 1 });
            }
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter(item => item._id !== action.payload);
        },
        updateCartItemQuantity: (state, action) => {
            const { _id, quantity } = action.payload;
            const item = state.cartItems.find(i => i._id === _id);
            if (item) {
                if (quantity > item.total_items) {
                    toast.error("Quantity exceeds available items.");
                } else if (quantity <= 0) {
                    state.cartItems = state.cartItems.filter(i => i._id !== _id);
                } else {
                    item.quantity = quantity;
                }
            }
        },
        resetCart: (state) => {
            state.cartItems = [];
        },
    },
    extraReducers: (builder) => {
        builder
            // get all loan transactions
            .addCase(getAllLoanTransactions.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllLoanTransactions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.loanData = action.payload;
            })
            .addCase(getAllLoanTransactions.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // create loan transaction builder
            .addCase(createLoanTransaction.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createLoanTransaction.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.loanData = action.payload;
                state.cartItems = [];
            })
            .addCase(createLoanTransaction.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
})

export const { addToCart, removeFromCart, updateCartItemQuantity, resetCart } = loanSlice.actions;
export default loanSlice.reducer;