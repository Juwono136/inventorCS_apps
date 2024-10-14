import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import inventoryService from "./inventoryService"
import tokenService from "../token/tokenService"

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

// update inventory
export const updateInventory = createAsyncThunk('inventory/update', async (data, thunkAPI) => {
    try {
        const token = await tokenService.accessToken(data)

        return await inventoryService.updateInventory(data, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

// draft inventory
export const draftInventory = createAsyncThunk('inventory/draft', async (data, thunkAPI) => {
    try {
        const token = await tokenService.accessToken(data)

        return await inventoryService.draftInventory(data, token)
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
            // update inventory
            .addCase(updateInventory.pending, (state) => {
                state.isLoading = true
            })
            .addCase(updateInventory.fulfilled, (state, action) => {
                state.isSuccess = true
                state.isLoading = false
                state.message = action.payload.message
                if (state.inventories && state.inventories.length > 0) {
                    const updateInventoryIndex = state.inventories.findIndex(inventory => inventory._id === action.payload._id)

                    if (updateInventoryIndex !== -1) {
                        state.inventories[updateInventoryIndex] = action.payload
                    }
                }
            })
            .addCase(updateInventory.rejected, (state, action) => {
                state.isError = true
                state.isSuccess = false
                state.isLoading = false
                state.message = action.payload
            })
            // draft inventory
            .addCase(draftInventory.pending, (state) => {
                state.isLoading = true
            })
            .addCase(draftInventory.fulfilled, (state, action) => {
                state.isSuccess = true
                state.isLoading = false
                state.message = action.payload.message
                state.inventories = action.payload
            })
            .addCase(draftInventory.rejected, (state, action) => {
                state.isError = true
                state.isLoading = false
                state.message = action.payload
            })

    }
})

export const { inventoryReset } = inventorySlice.actions
export default inventorySlice.reducer

