import axios from 'axios';

export const getStaffs = async (req) => {
    try {
        const token = req.headers.authorization
        const response = await axios.get(`${process.env.API_USERS_URL}/get_staffs`, {
            headers: {
                Authorization: token,
            },
        })
        return response.data
    } catch (error) {
        throw new Error(error);
    }
}