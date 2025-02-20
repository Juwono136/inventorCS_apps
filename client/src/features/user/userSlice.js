import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import userService from './userService'
import tokenService from '../token/tokenService'

const initialState = {
    userInfor: [],
    allUsersInfor: [],
    userById: [],
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

// get user infor by id
export const getUserById = createAsyncThunk('user/fetchById', async (id, thunkAPI) => {
    try {
        const token = await tokenService.accessToken(id)

        return await userService.getUserById(token, id)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

// get all users infor
export const getAllUsersInfor = createAsyncThunk('user/all_users', async ({ token, page, sort, program, search, all }, thunkAPI) => {
    try {
        const params = {
            page: all ? undefined : page, // ignore `page` if `all=true`
            sort: sort ? `${sort.sort},${sort.order}` : undefined,
            program,
            search,
            all: all || undefined, // add parameter `all` if true
        };

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

// update user status
export const updateUserStatus = createAsyncThunk('user/update_user_status', async (data, thunkAPI) => {
    try {
        const token = await tokenService.accessToken(data)

        return await userService.updateUserStatus(data, token)
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
            state.userById = []
            state.isLoading = false
            state.isError = false
            state.message = ""
        },
        userResetMessage: (state) => {
            state.isLoading = false
            state.isError = false
            state.isSuccess = false
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
            // get user infor by ID builder
            .addCase(getUserById.pending, (state) => {
                state.isLoading = true
                state.isError = false
                state.isSuccess = false
            })
            .addCase(getUserById.fulfilled, (state, action) => {
                state.isLoading = false
                state.userById = action.payload
            })
            .addCase(getUserById.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            // get all users infor builder
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
            // update user status
            .addCase(updateUserStatus.pending, (state) => {
                state.isLoading = true
            })
            .addCase(updateUserStatus.fulfilled, (state, action) => {
                state.isSuccess = true
                state.isLoading = false
                state.message = action.payload.message
                if (state.allUsersInfor && state.allUsersInfor.length > 0) {
                    const updateUserStatusIndex = state.allUsersInfor.findIndex(userRole => userRole._id === action.payload._id)
                    // console.log(updateUserStatusIndex)

                    if (updateUserStatusIndex !== -1) {
                        state.allUsersInfor[updateUserStatusIndex] = action.payload
                    }
                }
            })
            .addCase(updateUserStatus.rejected, (state, action) => {
                state.isError = true
                state.isLoading = false
                state.message = action.payload
            })
        // delete user
        // .addCase(deleteUser.pending, (state) => {
        //     state.isLoading = true
        // })
        // .addCase(deleteUser.fulfilled, (state, action) => {
        //     state.isLoading = false
        //     state.isSuccess = true
        //     state.message = action.payload.message
        //     state.allUsersInfor = action.payload
        //     // state.message = "User deleted"
        // })
        // .addCase(deleteUser.rejected, (state, action) => {
        //     state.isLoading = false
        //     state.isError = true
        //     state.message = action.payload
        // })
    }
})

export const { userReset, userResetMessage } = userSlice.actions
export default userSlice.reducer