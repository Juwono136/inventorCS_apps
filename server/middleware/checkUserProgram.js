import { getUserById } from "../utils/getUserById.js";

export const checkUserProgram = async (req, res, next) => {
    try {
        const userData = await getUserById(req, req.user._id);

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        req.userData = userData;
        // console.log(userData)

        if (req.query.item_program && req.item_program !== userData.personal_info.program) {
            return res.status(403).json({ message: "You do not have access to this program's inventory" });
        }

        next()
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}