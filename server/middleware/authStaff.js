import User from "../models/user.js";

export const authStaff = async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.user._id });

        if (user.personal_info.role !== 2) { // 2 = staff
            return res.status(403).json({ message: "Staff resources access denied." });
        }

        next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};