import express from 'express';
import { activateEmail, forgotPassword, getAccessToken, logout, resetPassword, signIn, signUp } from '../controllers/users.js';
import { auth } from '../middleware/auth.js';

const router = express.Router()

router.post("/signup", signUp)
router.post("/activation", activateEmail)
router.post("/signin", signIn)
router.post("/refresh_token", getAccessToken)
router.post("/forgot", forgotPassword)
router.post("/reset", auth, resetPassword)

router.get("/logout", logout)

export default router