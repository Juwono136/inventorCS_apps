import axios from 'axios'

const API_URL = '/service/meeting'

// create a request meeting
const createMeeting = async (meetingData, loanId, token) => {
    const response = await axios.post(API_URL + `/create_meeting/${loanId}`, meetingData, {
        headers: { Authorization: `Bearer ${token}` }
    })

    return response.data
}

const meetingService = {
    createMeeting
}

export default meetingService