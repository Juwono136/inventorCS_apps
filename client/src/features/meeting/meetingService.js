import axios from 'axios'

const API_URL = '/service/meeting'

// create a request meeting
const createMeeting = async (meetingData, loanId, token) => {
    const response = await axios.post(API_URL + `/create_meeting/${loanId}`, meetingData, {
        headers: { Authorization: `Bearer ${token}` }
    })

    return response.data
}

// get all meetings
const getAllMeetings = async (token, params) => {
    const response = await axios.get(API_URL + '/all_meetings', {
        headers: { Authorization: `Bearer ${token}` },
        params
    })

    return response.data
}
// get meeting by loan id
const getMeetingByLoanId = async (token, loanId) => {
    const response = await axios.get(API_URL + `/get_meeting_by_loan/${loanId}`, {
        headers: { Authorization: `Bearer ${token}` }
    })

    return response.data
}

const meetingService = {
    createMeeting,
    getAllMeetings,
    getMeetingByLoanId
}

export default meetingService