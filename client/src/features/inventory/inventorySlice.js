import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import inventoryService from "./inventoryService"
import tokenService from "../token/tokenService"

const initialState = {
    inventories: [],
    inventoryById: [],
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

// get all inventories based on user program
export const getInventoriesByProgram = createAsyncThunk('inventory/all_by_user_program', async ({ token, page, sort, categories, search }, thunkAPI) => {
    try {
        const params = {
            page,
            sort: `${sort.sort},${sort.order}`,
            categories,
            search
        }

        const tokenData = await tokenService.accessToken(token)

        return await inventoryService.getInventoriesByProgram(tokenData, params)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

// get inventory by id
export const getInventoryById = createAsyncThunk('inventory/fetchById', async (id, thunkAPI) => {
    try {

        return await inventoryService.getInventoryById(id)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

// createa inventory
export const createInventory = createAsyncThunk('inventory/add', async (data, thunkAPI) => {
    try {
        const token = await tokenService.accessToken(data)

        return await inventoryService.createInventory(data, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

// update inventory
export const updateInventory = createAsyncThunk('inventory/update', async (data, thunkAPI) => {
    try {
        const token = await tokenService.accessToken(data)
        // console.log(token)

        return await inventoryService.updateInventory(data, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

// delete inventory
// export const deleteInventory = createAsyncThunk('inventory/delete', async (id, thunkAPI) => {
//     try {
//         const token = await tokenService.accessToken(id)

//         return await inventoryService.deleteInventory(id, token)
//     } catch (error) {
//         const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

//         return thunkAPI.rejectWithValue(message)
//     }
// })

export const inventorySlice = createSlice({
    name: 'inventory',
    initialState,
    reducers: {
        inventoryReset: (state) => {
            state.inventories = []
            state.inventoryById = []
            state.isLoading = false
            state.isError = false
            state.message = ""
        }
    },
    extraReducers: (builder) => {
        builder
            // get all inventories builder
            .addCase(getAllInventories.pending, (state) => {
                state.isLoading = true
                state.isError = false
                state.isSuccess = false
            })
            .addCase(getAllInventories.fulfilled, (state, action) => {
                state.isLoading = false
                state.inventories = action.payload
                // state.isSuccess = true
            })
            .addCase(getAllInventories.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            // get all inventories based on user program builder
            .addCase(getInventoriesByProgram.pending, (state) => {
                state.isLoading = true
                state.isError = false
                state.isSuccess = false
            })
            .addCase(getInventoriesByProgram.fulfilled, (state, action) => {
                state.isLoading = false
                state.inventories = action.payload
                // state.isSuccess = true
            })
            .addCase(getInventoriesByProgram.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            // get inventory by id builder
            .addCase(getInventoryById.pending, (state) => {
                state.isLoading = true
                state.isError = false
                state.isSuccess = false
            })
            .addCase(getInventoryById.fulfilled, (state, action) => {
                state.isLoading = false
                state.inventoryById = action.payload
            })
            .addCase(getInventoryById.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            // create inventory builder
            .addCase(createInventory.pending, (state) => {
                state.isLoading = true
            })
            .addCase(createInventory.fulfilled, (state, action) => {
                state.isLoading = false
                state.inventories = action.payload
                state.isSuccess = true
                state.message = action.payload.message
            })
            .addCase(createInventory.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            // update inventory builder
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
        // delete inventory builder
        // .addCase(deleteInventory.pending, (state) => {
        //     state.isLoading = true
        // })
        // .addCase(deleteInventory.fulfilled, (state, action) => {
        //     state.isLoading = false
        //     state.isSuccess = true
        //     state.inventories = action.payload
        //     state.message = action.payload.message
        // })
        // .addCase(deleteInventory.rejected, (state, action) => {
        //     state.isError = true
        //     state.isLoading = false
        //     state.message = action.payload
        // })

    }
})

export const { inventoryReset } = inventorySlice.actions
export default inventorySlice.reducer

