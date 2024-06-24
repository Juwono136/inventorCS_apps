import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { sendMail } from './sendMail.js';

const { CLIENT_URL } = process.env

export const signUp = async (req, res) => {
    try {
        const { binusian_id, name, email, password, confirmPassword } = req.body

        if (!binusian_id || !name || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "Please fill in all fields." })
        }

        if (name.length < 3) return res.status(400).json({ message: "Your name must be at least 3 letters long." })

        if (!isMatch(password, confirmPassword)) return res.status(400).json({ message: "Password don't match." })

        if (!validateEmail(email)) return res.status(400).json({ message: "Invalid emails." })

        const user = await User.findOne({ "personal_info.email": email })

        if (user) return res.status(400).json({ message: "This email already exists." })

        if (!validatePassword(password)) return res.status(400).json({ message: "Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters" })

        const passwordHash = await bcrypt.hash(password, 12)

        const newUser = {
            personal_info: {
                binusian_id,
                name,
                email,
                password: passwordHash
            }
        }

        const activation_token = createActivationToken(newUser)

        const url = `${CLIENT_URL}/user/activate/${activation_token}`

        sendMail(email, url, "Verify your email address")

        res.json({ message: "Register Success! Please activate your email to start." })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const activateEmail = async (req, res) => {
    try {
        const { activation_token } = req.body;
        const user = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN_SECRET)

        const { binusian_id, name, email, password } = user.personal_info

        const check = await User.findOne({ "personal_info.email": email })
        if (check) return res.status(400).json({ message: "This email already exists." })

        const newUser = new User({
            'personal_info.binusian_id': binusian_id,
            'personal_info.name': name,
            'personal_info.email': email,
            'personal_info.password': password
        })

        await newUser.save()

        res.json({ message: "Account has been activated. Please login now!" });
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ "personal_info.email": email })

        if (!email || !password) return res.status(400).json({ message: "Please fill in all fields." })

        if (!user) return res.status(400).json({ message: "Invalid Credentials." })

        const isMatch = await bcrypt.compare(password, user.personal_info.password)
        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials." })

        const refresh_token = createRefreshToken({ id: user._id })
        res.cookie('refreshtoken', refresh_token, {
            httpOnly: true,
            path: 'api/user/refresh_token',
            maxAge: 1 * 24 * 60 * 60 * 1000 // 1 days
        })

        res.json({
            email: user.personal_info.email,
            message: "Login success.",
            isLoggedOut: false
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

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

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ "personal_info.email": email })

        if (!email) return res.status(400).json({ message: "Please fill your email." })

        if (!validateEmail(email)) return res.status(400).json({ message: "Invalid emails." })
        if (!user) return res.status(400).json({ message: "This email doesn't exist." })

        const access_token = createAccessToken({ id: user._id })
        const url = `${CLIENT_URL}/user/reset/${access_token}`

        sendMail(email, url, "Reset your password")
        res.json({ message: "Please check your email for reset" })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { password, confirmPassword } = req.body

        if (!validatePassword(password)) return res.status(400).json({ message: "Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters" })

        if (!isMatch(password, confirmPassword)) return res.status(400).json({ message: "Password did not match." })

        const passwordHash = await bcrypt.hash(password, 12)

        await User.findOneAndUpdate({ _id: req.user.id }, {
            "personal_info.password": passwordHash
        })

        res.json({ message: "Password successfully changed. Please login." })
    } catch (error) {
        return res.status(500).json({ message: error })
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('refreshtoken', { path: 'api/user/refresh_token' })
        return res.json({ message: "Logged out.", isLoggedOut: true })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}


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
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}

function createAccessToken(payload) {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3m' })
}

function createActivationToken(payload) {
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, { expiresIn: '5m' })
}