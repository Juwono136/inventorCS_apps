import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import tokenService from '../token/tokenService';
import meetingService from './meetingService';

// Initial state
const initialState = {
    meeting: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
};

// create a request meeting
export const createMeeting = createAsyncThunk('meeting/create', async ({ meetingData, loanId, token }, thunkAPI) => {
    try {
        const tokenData = await tokenService.accessToken(token)

        return await meetingService.createMeeting(meetingData, loanId, tokenData)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

const meetingSlice = createSlice({
    name: 'meeting',
    initialState,
    reducers: {
        meetingReset: (state) => {
            state.meeting = null;
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder
            // create request meeting builder
            .addCase(createMeeting.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
            })
            .addCase(createMeeting.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
                state.meeting = action.payload;
            })
            .addCase(createMeeting.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.message = action.payload;
            });
    }
})

export const { meetingReset } = meetingSlice.actions
export default meetingSlice.reducer