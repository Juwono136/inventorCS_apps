import axios from 'axios';

const API_URL = '/api/user'

// signin user
const signin = async (userData) => {
    const response = await axios.post(API_URL + '/signin', userData);

    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response.data;
};

// select role
const selectRole = async (userId, selectedRole) => {
    const response = await axios.post(`${API_URL}/select-role`, { userId, selectedRole });

    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
    }

    // console.log(response.data)

    return response.data;
};

// signup user
const signup = async (userData) => {
    const response = await axios.post(API_URL + '/signup', userData)

    return response.data
}

// activation email
const activateMail = async (activationToken) => {
    const response = await axios.post(API_URL + '/activation', {
        activation_token: activationToken
    })

    return response.data
}

// forgot password
const forgotPassword = async (email) => {
    const response = await axios.post(API_URL + '/forgot', email)

    return response.data
}

// reset password
const resetPassword = async (data, token) => {
    const response = await axios.post(API_URL + '/reset', data, {
        headers: { Authorization: `Bearer ${token}` }
    })

    return response.data
}

// user logout
const logout = async () => {
    const response = await axios.get(API_URL + '/logout')
    localStorage.removeItem('user')

    return response.data
}

const authService = {
    signin,
    selectRole,
    signup,
    activateMail,
    forgotPassword,
    resetPassword,
    logout
}

export default authService