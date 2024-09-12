import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import userService from './userService'
import tokenService from '../token/tokenService'

const initialState = {
    userInfor: [],
    allUsersInfor: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: ''
}

// get user infor
export const getUserInfor = createAsyncThunk('user/infor', async (token, thunkAPI) => {
    try {
        const tokenData = await tokenService.accessToken(token)

        return await userService.getUserInfor(tokenData)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

// get all users infor
export const getAllUsersInfor = createAsyncThunk('user/all_users', async ({ token, page, sort, program, search }, thunkAPI) => {
    try {
        const params = {
            page,
            sort: `${sort.sort},${sort.order}`,
            program,
            search
        }
        const tokenData = await tokenService.accessToken(token)

        return await userService.getAllUsersInfor(tokenData, params)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

// update user
export const updateUser = createAsyncThunk('user/update', async (data, thunkAPI) => {
    try {
        const token = await tokenService.accessToken(data)

        return await userService.updateUser(data, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

// update user role
export const updateUserRole = createAsyncThunk('user/update_role', async (data, thunkAPI) => {
    try {
        const token = await tokenService.accessToken(data)

        return await userService.updateUserRole(data, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

// delete user
export const deleteUser = createAsyncThunk('user/delete', async (id, thunkAPI) => {
    try {
        const token = await tokenService.accessToken(id)
        return await userService.deleteUser(id, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        userReset: (state) => {
            state.userInfor = []
            state.allUsersInfor = []
            state.isLoading = false
            state.isError = false
            state.message = ""
        }
    },
    extraReducers: (builder) => {
        builder
            // get user infor builder
            .addCase(getUserInfor.pending, (state) => {
                state.isLoading = true
                state.isError = false
                state.isSuccess = false
            })
            .addCase(getUserInfor.fulfilled, (state, action) => {
                state.isLoading = false
                state.userInfor = action.payload
            })
            .addCase(getUserInfor.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            // get all users infor
            .addCase(getAllUsersInfor.pending, (state) => {
                state.isLoading = true
                state.isError = false
                state.isSuccess = false
            })
            .addCase(getAllUsersInfor.fulfilled, (state, action) => {
                state.isLoading = false
                state.allUsersInfor = action.payload
            })
            .addCase(getAllUsersInfor.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            // update user
            .addCase(updateUser.pending, (state) => {
                state.isLoading = true
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.userInfor = action.payload
                state.isSuccess = true
                state.isLoading = false
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.isError = true
                state.isLoading = false
                state.message = action.payload
            })
            // update user role
            .addCase(updateUserRole.pending, (state) => {
                state.isLoading = true
            })
            .addCase(updateUserRole.fulfilled, (state, action) => {
                state.isSuccess = true
                state.isLoading = false
                state.message = action.payload.message
                if (state.allUsersInfor && state.allUsersInfor.length > 0) {
                    const updateUserRoleIndex = state.allUsersInfor.findIndex(userRole => userRole._id === action.payload._id)
                    // console.log(updateUserRoleIndex)

                    if (updateUserRoleIndex !== -1) {
                        state.allUsersInfor[updateUserRoleIndex] = action.payload
                    }
                }
            })
            .addCase(updateUserRole.rejected, (state, action) => {
                state.isError = true
                state.isLoading = false
                state.message = action.payload
            })
            // delete user
            .addCase(deleteUser.pending, (state) => {
                state.isLoading = true
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.message = action.payload.message
                state.allUsersInfor = action.payload
                // state.message = "User deleted"
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
    }
})

export const { userReset } = userSlice.actions
export default userSlice.reducer