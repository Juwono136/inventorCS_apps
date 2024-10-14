import axios from 'axios'

const API_URL = '/api/user'

// get user infor
const getUserInfor = async (token) => {

    const response = await axios.get(API_URL + '/user_infor', {
        headers: { Authorization: `Bearer ${token}` }
    })

    return response.data
}

// get all user infor (admin)
const getAllUsersInfor = async (token, params) => {
    const response = await axios.get(API_URL + "/all_infor", {
        headers: { Authorization: `Bearer ${token}` },
        params
    })

    return response.data
}

// update user infor
const updateUser = async (data, token) => {
    const response = await axios.patch(API_URL + '/update_user', data, {
        headers: { Authorization: `Bearer ${token}` }
    })

    return response.data
}

// update user role
const updateUserRole = async (data, token) => {

    const response = await axios.patch(API_URL + `/update_role/${data._id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
    })

    return response.data
}

// update user status
const updateUserStatus = async (data, token) => {
    const response = await axios.patch(API_URL + `/update_user_status/${data._id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
    })

    return response.data
}

// delete user (admin)
// const deleteUser = async (userId, token) => {
//     const response = await axios.delete(API_URL + `/delete/${userId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//     })

//     return response.data
// }

const userService = {
    getUserInfor,
    getAllUsersInfor,
    updateUser,
    updateUserRole,
    updateUserStatus,
}

export default userService