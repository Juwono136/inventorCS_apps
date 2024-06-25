import axios from 'axios';

const API_URL = '/api/user'

// signin user
const signin = async (userData) => {
    const response = await axios.post(API_URL + '/signin', userData)

    if (response.data) {
        localStorage.setItem('profile', JSON.stringify(response.data))
    }

    // console.log(response)

    return response.data
}

// signup user
const signup = async (userData) => {
    const response = await axios.post(API_URL + '/signup', userData)

    return response.data
}

// activate email
const activateMail = async (activationToken) => {
    const response = await axios.post(API_URL + '/activation', {
        activation_token: activationToken
    })

    return response.data
}

// forgot password user
const forgotPassword = async (email) => {
    const response = await axios.post(API_URL + '/forgot', email)

    return response.data
}

// reset password user
const resetPassword = async (data, token) => {
    const response = await axios.post(API_URL + '/reset', data, {
        headers: { Authorization: token }
    })

    return response.data
}

// logout user
const logout = async () => {
    const response = await axios.get(API_URL + '/logout')
    localStorage.removeItem('profile')

    return response.data
}

const authService = {
    signin,
    logout,
    signup,
    activateMail,
    forgotPassword,
    resetPassword
}

export default authService