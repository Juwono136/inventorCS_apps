import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import loanService from "./loanService"
import tokenService from "../token/tokenService"

// load cart from local storage
const loadCartFromLocalStorage = () => {
    try {
        const serializedCart = localStorage.getItem("cartItems");
        return serializedCart ? JSON.parse(serializedCart) : [];
    } catch (error) {
        console.error("Error loading cart from local storage:", error);
        return [];
    }
};

// save cart to local storage
const saveCartToLocalStorage = (cartItems) => {
    try {
        const serializedCart = JSON.stringify(cartItems);
        localStorage.setItem("cartItems", serializedCart);
    } catch (error) {
        console.error("Error saving cart to local storage:", error);
    }
};

const initialState = {
    cartItems: loadCartFromLocalStorage(),
    loanData: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
};


// get all loan transaction
export const getAllLoanTransactions = createAsyncThunk('loan/all', async ({ token, page, sort, loanStatus, search, borrow_date_start, borrow_date_end }, thunkAPI) => {
    try {
        const params = {
            page,
            sort: `${sort.sort},${sort.order}`,
            loanStatus,
            search,
            borrow_date_start,
            borrow_date_end
        }

        const tokenData = await tokenService.accessToken(token)

        return await loanService.getAllLoanTransactions(tokenData, params)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

// get loan transaction by id
export const getLoanTransactionById = createAsyncThunk('loan/fetchById', async (id, thunkAPI) => {
    try {
        const token = await tokenService.accessToken(id)

        return await loanService.getLoanTransactionById(token, id)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

// get user's loan transaction
export const getLoanTransactionsByUser = createAsyncThunk('loan/by_user', async (token, thunkAPI) => {
    try {
        const tokenData = await tokenService.accessToken(token)

        return await loanService.getLoanTransactionsByUser(tokenData)
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

// mark transaction is new or not
export const markTransactionIsNew = createAsyncThunk('loan/is_new', async (id, thunkAPI) => {
    try {
        const token = await tokenService.accessToken(id);

        return await loanService.markTransactionIsNew(id, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

// update loan status to ready to pickup
export const updateStatusToReadyToPickup = createAsyncThunk('loan/ready_to_loan', async (data, thunkAPI) => {
    try {
        const token = await tokenService.accessToken(data)

        return await loanService.updateStatusToReadyToPickup(data, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

// staff confirm handover
export const staffConfirmHandover = createAsyncThunk('loan/staffConfirmHandover', async ({ loanId, checkedItemIds, token }, thunkAPI) => {
    try {
        const tokenData = await tokenService.accessToken(token)

        return await loanService.staffConfirmHandover(loanId, checkedItemIds, tokenData)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

// update loan status to borrowed
export const updateStatusToBorrowed = createAsyncThunk('loan/borrowed-status', async (data, thunkAPI) => {
    try {
        const token = await tokenService.accessToken(data)

        return await loanService.updateStatusToBorrowed(data, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

// confirm borrowed loan item by borrower
export const confirmReceiveByBorrower = createAsyncThunk('/loan/confirm-received', async (data, thunkAPI) => {
    try {
        const token = await tokenService.accessToken(data)

        return await loanService.confirmReceiveByBorrower(data, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

// confirm loan item has already returned by borrower
export const confirmReturnedByBorrower = createAsyncThunk('/loan/confirm-returned', async (data, thunkAPI) => {
    try {
        const token = await tokenService.accessToken(data)

        return await loanService.confirmReturnedByBorrower(data, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

// update loan status to returned
export const updateStatusToReturned = createAsyncThunk('loan/returned-status', async (data, thunkAPI) => {
    try {
        const token = await tokenService.accessToken(data)

        return await loanService.updateStatusToReturned(data, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

// cancel loan transaction by user
export const cancelLoanTransaction = createAsyncThunk('loan/cancelled-loan', async (data, thunkAPI) => {
    try {
        const token = await tokenService.accessToken(data)

        return await loanService.cancelLoanTransaction(data, token)
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
                existingItem.quantity += 1;
            } else {
                state.cartItems.push({ ...item, quantity: 1 });
            }
            saveCartToLocalStorage(state.cartItems);
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter(item => item._id !== action.payload);
            // state.cartItems = []
            saveCartToLocalStorage(state.cartItems);
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
                saveCartToLocalStorage(state.cartItems);
            }
        },
        resetCart: (state) => {
            state.cartItems = [];
            saveCartToLocalStorage(state.cartItems);
        },
        loanReset: (state) => {
            state.isLoading = false
            state.isError = false
            state.message = ""
        }
    },
    extraReducers: (builder) => {
        builder
            // get all loan transactions builder
            .addCase(getAllLoanTransactions.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllLoanTransactions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.loanData = action.payload;
            })
            .addCase(getAllLoanTransactions.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            // get loan transcation by id builder
            .addCase(getLoanTransactionById.pending, (state) => {
                state.isLoading = true
                state.isError = false
                state.isSuccess = false
            })
            .addCase(getLoanTransactionById.fulfilled, (state, action) => {
                state.isLoading = false
                state.loanData = action.payload
            })
            .addCase(getLoanTransactionById.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })

            // get user's loan transactions builder
            .addCase(getLoanTransactionsByUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getLoanTransactionsByUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.loanData = action.payload;
            })
            .addCase(getLoanTransactionsByUser.rejected, (state, action) => {
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
            })

            // mark transaction is new or not
            .addCase(markTransactionIsNew.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(markTransactionIsNew.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.loanData = action.payload;
            })
            .addCase(markTransactionIsNew.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
            })

            // update loan status to ready to pickup builder
            .addCase(updateStatusToReadyToPickup.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateStatusToReadyToPickup.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.loanData = action.payload;
            })
            .addCase(updateStatusToReadyToPickup.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            // staff confirm handover builder
            .addCase(staffConfirmHandover.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(staffConfirmHandover.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.loanData = action.payload;
            })
            .addCase(staffConfirmHandover.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            // update loan status to borrowed builder
            .addCase(updateStatusToBorrowed.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateStatusToBorrowed.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.loanData = action.payload;
            })
            .addCase(updateStatusToBorrowed.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            // confirm borrowed loan item by borrower builder
            .addCase(confirmReceiveByBorrower.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(confirmReceiveByBorrower.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.loanData = action.payload;
            })
            .addCase(confirmReceiveByBorrower.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            // confirm loan item has already returned builder
            .addCase(confirmReturnedByBorrower.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(confirmReturnedByBorrower.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.loanData = action.payload;
            })
            .addCase(confirmReturnedByBorrower.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            // update loan status to returned builder
            .addCase(updateStatusToReturned.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateStatusToReturned.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.loanData = action.payload;
            })
            .addCase(updateStatusToReturned.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            // cancel loan transaction by user builder
            .addCase(cancelLoanTransaction.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(cancelLoanTransaction.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.loanData = action.payload;
            })
            .addCase(cancelLoanTransaction.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
    },
})

export const { addToCart, removeFromCart, updateCartItemQuantity, resetCart, loanReset } = loanSlice.actions;
export default loanSlice.reducer;