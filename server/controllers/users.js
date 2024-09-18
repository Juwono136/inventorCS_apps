import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { userSendMail } from './UserSendMail.js';

const { CLIENT_URL } = process.env

// signup
export const signUp = async (req, res) => {
    try {
        const { binusian_id, name, email, program, password, confirmPassword } = req.body

        if (!binusian_id || !name || !email || !program || !password || !confirmPassword) {
            return res.status(400).json({ message: "Please fill in all fields" })
        }

        if (name.length < 3) return res.status(400).json({ message: "Your name must be at least 3 letters long" })

        if (!isMatch(password, confirmPassword)) return res.status(400).json({ message: "Password did not match" })

        if (!validateEmail(email)) return res.status(400).json({ message: "Invalid emails" })

        const user = await User.findOne({
            $or: [
                { "personal_info.email": email },
                { "personal_info.binusian_id": binusian_id }
            ]
        });

        if (user && user.personal_info.status === 'inactive') {
            return res.status(403).json({ message: "Your account is inactive. Please contact admin to reactivate." });
        }

        if (user) return res.status(400).json({ message: "This account already exists" })

        if (!validatePassword(password)) return res.status(400).json({ message: "Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters" })

        const passwordHash = await bcrypt.hash(password, 12)

        const newUser = {
            personal_info: {
                binusian_id,
                name,
                email,
                program,
                password: passwordHash
            }
        }

        const activation_token = createActivationToken(newUser)

        const url = `${CLIENT_URL}/user/activate/${activation_token}`

        userSendMail(email, url, "Verify your email address", "Confirm Email")

        res.json({ message: "Register Success! Please activate your email to start" })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// email activation
export const activateEmail = async (req, res) => {
    try {
        const { activation_token } = req.body;
        const user = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN_SECRET)

        const { binusian_id, name, email, program, password } = user.personal_info

        const check = await User.findOne({ "personal_info.email": email })
        if (check) return res.status(400).json({ message: "This email already exists" })

        const newUser = new User({
            'personal_info.binusian_id': binusian_id,
            'personal_info.name': name,
            'personal_info.email': email,
            'personal_info.program': program,
            'personal_info.password': password
        })

        await newUser.save()

        res.json({ message: "Account has been activated. Please login now!" });
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// singin
export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ "personal_info.email": email })

        if (!email || !password) return res.status(400).json({ message: "Please fill in all fields" })

        if (!user) return res.status(400).json({ message: "Invalid Credentials" })

        if (user.personal_info.status === 'inactive') {
            return res.status(403).json({ message: "Your account is inactive. Please contact admin to reactivate." });
        }

        const isMatch = await bcrypt.compare(password, user.personal_info.password)
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" })

        const refresh_token = createRefreshToken({ id: user._id })

        const expiry = 24 * 60 * 60 * 1000 // 1 day

        res.cookie('refreshtoken', refresh_token, {
            httpOnly: true,
            path: '/api/user/refresh_token',
            maxAge: expiry,
            expires: new Date(Date.now() + expiry)
        })

        res.json({
            message: `🖖Welcome, ${user.personal_info.name}`,
            role: user.personal_info.role
            // isLoggedOut: false
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// get access token
export const getAccessToken = async (req, res) => {
    try {
        const rf_token = req.cookies.refreshtoken

        if (!rf_token) return res.status(400).json({ message: "Please login now!" })

        jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return res.status(400).json({ message: "Please login now!" })

            const access_token = createAccessToken({ id: user.id })
            res.json({ access_token })
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// forgot password
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ "personal_info.email": email })

        if (!email) return res.status(400).json({ message: "Please fill your email" })

        if (!validateEmail(email)) return res.status(400).json({ message: "Invalid emails" })
        if (!user) return res.status(400).json({ message: "This email doesn't exist" })

        const access_token = createAccessToken({ id: user._id })
        const url = `${CLIENT_URL}/user/reset/${access_token}`

        userSendMail(email, url, "Reset your account", "Reset Password")
        res.json({ message: "Please check your email for reset" })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// reset password
export const resetPassword = async (req, res) => {
    try {
        const { password, confirmPassword } = req.body

        if (!validatePassword(password)) return res.status(400).json({ message: "Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters" })

        if (!isMatch(password, confirmPassword)) return res.status(400).json({ message: "Password did not match" })

        const passwordHash = await bcrypt.hash(password, 12)

        await User.findOneAndUpdate({ _id: req.user.id }, {
            "personal_info.password": passwordHash
        })

        res.json({ message: "Password successfully changed. Please login" })
    } catch (error) {
        return res.status(500).json({ message: error })
    }
}

// get user infor
export const getUserInfor = async (req, res) => {
    try {
        const userInfor = await User.findById(req.user.id).select("-personal_info.password")

        res.json(userInfor)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// get all user infor
export const getAllUsersInfor = async (req, res) => {
    try {
        const page = parseInt(req.query.page) - 1 || 0
        const limit = parseInt(req.query.limit) || 10
        const search = req.query.search || ""
        let sort = req.query.sort || "personal_info.name"
        let program = req.query.program || "All"

        const programOptions = [
            "Business Information Systems",
            "Business Managaement & Marketing",
            "Communications",
            "Computer Science",
            "Finance International Program",
            "International Business",
            "Graphic Design and New Media",
            "Digital Business",
        ]

        program === "All"
            ? (program = [...programOptions])
            : (program = req.query.program.split(","))

        req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort])

        let sortBy = {}
        if (sort[1]) {
            sortBy[sort[0]] = sort[1]
        } else {
            sortBy[sort[0]] = "asc"
        }

        const users = await User.find({ "personal_info.name": { $regex: search, $options: "i" } })
            .select("-personal_info.password")
            .where("personal_info.program")
            .in([...program])
            .sort(sortBy)
            .skip(page * limit)
            .limit(limit)

        const totalUsers = await User.countDocuments({
            "personal_info.program": { $in: [...program] },
            "personal_info.name": { $regex: search, $options: "i" }
        })

        const totalPage = Math.ceil(totalUsers / limit)

        const response = {
            totalUsers,
            totalPage,
            page: page + 1,
            limit,
            program: programOptions,
            users
        }

        res.json(response)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// update user info
export const updateUser = async (req, res) => {
    try {
        const { address, phone, bio, program, name, avatar, password, confirm_password, youtube, instagram, facebook, twitter, github, website } = req.body

        if (password) {
            if (password && password !== confirm_password) return res.status(400).json({ message: "Password did not match" });

            if (!validatePassword(password)) return res.status(400).json({ message: "Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters" })
        }

        if (name.length < 3) return res.status(400).json({ message: "Your name must be at least 3 letters long" })

        if (name === "") return res.status(400).json({ message: "Name cannot be empty" });

        const updateFields = {
            "personal_info.address": address,
            "personal_info.phone": phone,
            "personal_info.name": name,
            "personal_info.bio": bio,
            "personal_info.program": program,
            "personal_info.avatar": avatar,
            "social_links.youtube": youtube,
            "social_links.instagram": instagram,
            "social_links.facebook": facebook,
            "social_links.twitter": twitter,
            "social_links.github": github,
            "social_links.website": website
        }

        if (password) {
            const passwordHash = await bcrypt.hash(password, 12)
            updateFields["personal_info.password"] = passwordHash
        }

        const updatedUser = await User.findOneAndUpdate({ _id: req.user.id }, updateFields, { new: true })

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            updatedUser,
            message: 'Update user success'
        })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// update user role
export const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body
        const userRole = [0, 1, 2]

        // Validate role
        if (!userRole.includes(role)) {
            return res.status(400).json({ message: "Invalid user role" });
        }

        const updatedUser = await User.findOneAndUpdate({ _id: req.params.id }, {
            "personal_info.role": role
        }, { new: true })

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Update user role success" })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// update user status
export const updateUserStatus = async (req, res) => {
    try {
        const { status } = req.body

        const validStatuses = ['active', 'inactive'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid user status" });
        }

        const updatedUser = await User.findOneAndUpdate({ _id: req.params.id }, {
            "personal_info.status": status
        }, { new: true })

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" })
        }

        res.json({ message: "User status updated" })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// delete user permanently
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        res.json({ message: "Delete user success" })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

// logout
export const logout = async (req, res) => {
    try {
        res.clearCookie('refreshtoken', { path: 'api/user/refresh_token' })
        return res.json({ message: "Logged out success" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function validatePassword(password) {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/
    return re.test(password)
}

function isMatch(password, confirm_password) {
    if (password === confirm_password) return true
    return false
}

function createRefreshToken(payload) {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' })
}

function createAccessToken(payload) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3m' })
}

function createActivationToken(payload) {
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, { expiresIn: '3m' })
}