import axios from 'axios';

export const authAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization
        const response = await axios.get(`${process.env.API_USERS_URL}/user_infor`, {
            headers: {
                Authorization: token,
            },
        });

        const user = response.data;

        if (!user.personal_info.role.includes(1) && !user.personal_info.role.includes(3)) { // 1 = admin for app 1, 3 = admin for app 2, ...
            return res.status(403).json({ message: "Admin resources access denied." })
        }

        next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};