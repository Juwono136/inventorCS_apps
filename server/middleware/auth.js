import jwt from 'jsonwebtoken';
import axios from 'axios';

export const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        // console.log(token)
        if (!token) return res.status(403).json({ message: "Token Expired or Invalid Authentication." })

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
            if (err) return res.status(403).json({ message: "Token Expired or Invalid Authentication." });

            try {
                const response = await axios.get(`${process.env.API_USERS_URL}/user_infor`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });

                req.user = response.data;
                user = response.data
                next();
            } catch (apiError) {
                return res.status(500).json({ message: "Failed to retrieve user data from API." });
            }

        });
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}