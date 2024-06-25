import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService';

// Get user from localStorage
const user = JSON.parse(localStorage.getItem('profile'))

const initialState = {
    user: user ? user : { isLoggedOut: true, user: null },
    isError: false,
    isSuccess: false,
    isLoading: false,
}

// signin user
export const signin = createAsyncThunk('auth/signin', async (user, thunkAPI) => {
    try {
        return await authService.signin(user)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

// signup user
export const signup = createAsyncThunk('auth/signup', async (newUser, thunkAPI) => {
    try {
        return await authService.signup(newUser)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

// activate email
export const activateMail = createAsyncThunk('auth/activateMail', async (activationToken, thunkAPI) => {
    try {
        return await authService.activateMail(activationToken)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

// forgot password
export const forgotPassword = createAsyncThunk('auth/forgot', async (email, thunkAPI) => {
    try {
        return await authService.forgotPassword(email)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

// reset password
export const resetPassword = createAsyncThunk('auth/reset', async ({ data, token }, thunkAPI) => {
    try {
        return await authService.resetPassword(data, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

// logout user
export const logout = createAsyncThunk('auth/logout', async (thunkAPI) => {
    try {
        return await authService.logout()
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.user = { isLoggedOut: true, user: null }
            state.isLoading = false
            state.isSuccess = false
            state.isError = false
        }
    },
    extraReducers: (builder) => {
        builder
            // signin builder
            .addCase(signin.pending, (state) => {
                state.isLoading = true
            })
            .addCase(signin.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload
            })
            .addCase(signin.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            // signup builder
            .addCase(signup.pending, (state) => {
                state.isLoading = true
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload
            })
            .addCase(signup.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            // activateMail builder
            .addCase(activateMail.pending, (state) => {
                state.isLoading = true
            })
            .addCase(activateMail.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload
            })
            .addCase(activateMail.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            // forgot password builder
            .addCase(forgotPassword.pending, (state) => {
                state.isLoading = true
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            // reset password builder
            .addCase(resetPassword.pending, (state) => {
                state.isLoading = true
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            // logout builder
            .addCase(logout.pending, (state) => {
                state.isLoading = true
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.isLoading = false
                state.user = action.payload
            })
    }
})

export const { reset } = authSlice.actions
export default authSlice.reducer