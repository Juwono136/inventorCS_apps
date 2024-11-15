import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import tokenService from "../token/tokenService";
import notificationService from "./notificationService";

const initialState = {
    notifications: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: ''
};

// get user notification
export const getNotificationByUser = createAsyncThunk('notification/by_user', async (token, thunkAPI) => {
    try {
        const tokenData = await tokenService.accessToken(token);
        return await notificationService.getNotificationByUser(tokenData);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// mark notification as read
export const markNotificationAsRead = createAsyncThunk('notification/mark_as_read', async (notificationId, thunkAPI) => {
    try {
        const token = await tokenService.accessToken(notificationId);

        return await notificationService.markNotificationAsRead(notificationId, token);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        notificationReset: (state) => {
            state.notifications = [];
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder
            // get user notification builder
            .addCase(getNotificationByUser.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
            })
            .addCase(getNotificationByUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.notifications = action.payload;
            })
            .addCase(getNotificationByUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            // mark notification as read builder
            .addCase(markNotificationAsRead.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
            })
            .addCase(markNotificationAsRead.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.notifications = action.payload
            })
            .addCase(markNotificationAsRead.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    }
});

export const { notificationReset } = notificationSlice.actions;
export default notificationSlice.reducer;
