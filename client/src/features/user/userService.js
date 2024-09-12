import axios from 'axios'

const API_URL = '/api/user'

// get user infor
const getUserInfor = async (token) => {

    const response = await axios.get(API_URL + '/user_infor', {
        headers: { Authorization: token }
    })

    return response.data
}

// get all user infor (admin)
const getAllUsersInfor = async (token, params) => {
    const response = await axios.get(API_URL + "/all_infor", {
        headers: { Authorization: token },
        params
    })

    return response.data
}

// update user infor
const updateUser = async (data, token) => {
    const response = await axios.patch(API_URL + '/update_user', data, {
        headers: { Authorization: token }
    })

    return response.data
}

// update user role
const updateUserRole = async (data, token) => {
    const response = await axios.patch(API_URL + `/update_role/${data._id}`, data, {
        headers: { Authorization: token }
    })

    return response.data
}

// delete user (admin)
const deleteUser = async (userId, token) => {
    const response = await axios.delete(API_URL + `/delete/${userId}`, {
        headers: { Authorization: token }
    })

    return response.data
}

const userService = {
    getUserInfor,
    getAllUsersInfor,
    updateUser,
    updateUserRole,
    deleteUser
}

export default userService