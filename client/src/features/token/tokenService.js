import axios from 'axios'

const API_URL = '/api/user'

// refresh token
const accessToken = async (token) => {
    const response = await axios.post(API_URL + '/refresh_token', token)

    return response.data.access_token
}

const tokenService = {
    accessToken,
}

export default tokenService;