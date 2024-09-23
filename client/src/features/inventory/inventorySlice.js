import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import tokenService from '../token/tokenService'
import inventoryService from "./inventoryService"

const initialState = {
    inventories: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: ""
}

// get all inventories
export const getAllInventories = createAsyncThunk('inventory/all', async ({ page, sort, categories, search }, thunkAPI) => {
    try {
        const params = {
            page,
            sort: `${sort.sort},${sort.order}`,
            categories,
            search
        }

        return await inventoryService.getAllInventories(params)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

export const inventorySlice = createSlice({
    name: 'inventory',
    initialState,
    reducers: {
        inventoryReset: (state) => {
            state.inventories = []
            state.isLoading = false
            state.isError = false
            state.message = ""
        }
    },
    extraReducers: (builder) => {
        builder
            // get all inventories
            .addCase(getAllInventories.pending, (state) => {
                state.isLoading = true
                state.isError = false
                state.isSuccess = false
            })
            .addCase(getAllInventories.fulfilled, (state, action) => {
                state.isLoading = false
                state.inventories = action.payload
                state.isSuccess = true
            })
            .addCase(getAllInventories.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
    }
})

export const { inventoryReset } = inventorySlice.actions
export default inventorySlice.reducer

