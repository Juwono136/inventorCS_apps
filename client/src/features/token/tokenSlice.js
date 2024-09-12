import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import tokenService from './tokenService';
import { logout } from '../auth/authSlice';

// access token
export const accessToken = createAsyncThunk('token/refresh_token', async (token, thunkAPI) => {
    try {
        const response = await tokenService.accessToken(token);

        if (response.status === 400) {
            thunkAPI.dispatch(logout());
            return thunkAPI.rejectWithValue('Refresh token expired. Please login!');
        }

        return response;
    } catch (error) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();

        thunkAPI.dispatch(logout());
        return thunkAPI.rejectWithValue(message);
    }
});

const tokenSlice = createSlice({
    name: 'token',
    initialState: {
        value: null
    },
    reducers: {
        setToken: (state, action) => {
            state.value = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(accessToken.fulfilled, (state, action) => {
                state.value = action.payload
            })
    }
})

export const { setToken } = tokenSlice.actions;
export default tokenSlice.reducer;

