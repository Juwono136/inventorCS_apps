import axios from 'axios';

export const authStaff = async (req, res, next) => {
    try {
        const token = req.headers.authorization
        const response = await axios.get(`${process.env.API_USERS_URL}/user_infor`, {
            headers: {
                Authorization: token,
            },
        });

        const user = response.data;

        if (user.personal_info.role !== 2) { // 2 = staff
            return res.status(403).json({ message: "Staff resources access denied." });
        }

        next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};