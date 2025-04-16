import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import tokenService from '../token/tokenService';
import meetingService from './meetingService';

// Initial state
const initialState = {
    meeting: null,
    meetingInfoByLoanId: null,
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


// get all meetings
export const getAllMeetings = createAsyncThunk('meeting/all', async ({ token, page, sort, meetingStatus, search, meeting_date_start, meeting_date_end }, thunkAPI) => {
    try {
        const params = {
            page,
            sort: `${sort.sort},${sort.order}`,
            meetingStatus,
            search,
            meeting_date_start,
            meeting_date_end
        }

        const tokenData = await tokenService.accessToken(token)

        return await meetingService.getAllMeetings(tokenData, params)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

// get meeting by loan id
export const getMeetingByLoanId = createAsyncThunk('meeting/loan_id', async (id, thunkAPI) => {
    try {
        const token = await tokenService.accessToken(id)

        return await meetingService.getMeetingByLoanId(token, id)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

        return thunkAPI.rejectWithValue(message)
    }
})

// approve meeting by staff
export const approveMeeting = createAsyncThunk('meeting/approve', async (data, thunkAPI) => {
    try {
        const token = await tokenService.accessToken(data)

        return await meetingService.approveMeeting(data, token)
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
            })

            // get all meetings builder
            .addCase(getAllMeetings.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllMeetings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.meeting = action.payload;
            })
            .addCase(getAllMeetings.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            // get meeting by id builder
            .addCase(getMeetingByLoanId.pending, (state) => {
                state.isLoading = true
                state.isError = false
                state.isSuccess = false
            })
            .addCase(getMeetingByLoanId.fulfilled, (state, action) => {
                state.isLoading = false
                state.meetingInfoByLoanId = action.payload
            })
            .addCase(getMeetingByLoanId.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })

            // approve meeting by staff builder
            .addCase(approveMeeting.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(approveMeeting.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.meetingInfoByLoanId = action.payload;
            })
            .addCase(approveMeeting.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
    }
})

export const { meetingReset } = meetingSlice.actions
export default meetingSlice.reducer