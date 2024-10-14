import axios from 'axios';

export const authAdminOrStaff = async (req, res, next) => {
    try {
        const token = req.headers.authorization
        const response = await axios.get(`${process.env.API_USERS_URL}/user_infor`, {
            headers: {
                authorization: token,
            },
        });

        const user = response.data;

        if (!user.personal_info.role.includes(1) && !user.personal_info.role.includes(2)) {
            return res.status(403).json({ message: "Access denied." });
        }


        next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};