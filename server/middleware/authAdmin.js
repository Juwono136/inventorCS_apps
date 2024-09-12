import User from "../models/user.js"

export const authAdmin = async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.user.id })
        // console.log(user)

        if (user.personal_info.role !== 1) { // 1 = admin
            return res.status(403).json({ message: "Admin resources access denied." })
        }

        next()
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}