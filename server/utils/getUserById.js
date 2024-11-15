import axios from 'axios';

export const getUserById = async (req, userId) => {
    try {
        const token = req.headers.authorization
        const response = await axios.get(`${process.env.API_USERS_URL}/users/${userId}`, {
            headers: {
                Authorization: token,
            },
        })
        return response.data
    } catch (error) {
        throw new Error(error);
    }
}