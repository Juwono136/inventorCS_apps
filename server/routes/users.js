import express from 'express';
import { activateEmail, deleteUser, forgotPassword, getAccessToken, getAllUsersInfor, getUserInfor, logout, resetPassword, signIn, signUp, updateUser, updateUserRole } from '../controllers/users.js';
import { auth } from '../middleware/auth.js';
import { authAdmin } from '../middleware/authAdmin.js';

const router = express.Router()

/**
 * @openapi
 * tags:
 *   - name: Users
 *     description: User related operations
 */

/**
 * @openapi
 * /signup:
 *   post:
 *     tags:
 *       - Users
 *     summary: Sign up a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               binusian_id:
 *                 type: string
 *                 example: "123456"
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               program:
 *                 type: string
 *                 example: "Computer Science"
 *               password:
 *                 type: string
 *                 example: "Password123"
 *               confirmPassword:
 *                 type: string
 *                 example: "Password123"
 *     responses:
 *       '200':
 *         description: Registration successful
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
router.post("/signup", signUp)

/**
 * @openapi
 * /activation:
 *   post:
 *     tags:
 *       - Users
 *     summary: Activate user email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 example: "your_activation_token"
 *     responses:
 *       '200':
 *         description: Activation successful
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
router.post("/activation", activateEmail)

/**
 * @openapi
 * /signin:
 *   post:
 *     tags:
 *       - Users
 *     summary: Sign in a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 example: "Password123"
 *     responses:
 *       '200':
 *         description: Sign in successful
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
router.post("/signin", signIn)

/**
 * @openapi
 * /refresh_token:
 *   post:
 *     tags:
 *       - Users
 *     summary: Refresh access token
 *     responses:
 *       '200':
 *         description: Token refreshed
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
router.post("/refresh_token", getAccessToken)

/**
 * @openapi
 * /forgot:
 *   post:
 *     tags:
 *       - Users
 *     summary: Request password reset
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *     responses:
 *       '200':
 *         description: Password reset email sent
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
router.post("/forgot", forgotPassword)

/**
 * @openapi
 * /reset:
 *   post:
 *     tags:
 *       - Users
 *     summary: Reset user password
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         required: true
 *         description: Bearer token for authentication
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 example: "NewPassword123"
 *               confirmPassword:
 *                 type: string
 *                 example: "NewPassword123"
 *     responses:
 *       '200':
 *         description: Password reset successful
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
router.post("/reset", auth, resetPassword)

/**
 * @openapi
 * /user_infor:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user information
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         required: true
 *         description: Bearer token for authentication
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: User information retrieved
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
router.get("/user_infor", auth, getUserInfor)

/**
 * @openapi
 * /all_infor:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users information
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         required: true
 *         description: Bearer token for authentication
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: All users information retrieved
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
router.get("/all_infor", auth, authAdmin, getAllUsersInfor)

/**
 * @openapi
 * /logout:
 *   get:
 *     tags:
 *       - Users
 *     summary: Logout user
 *     responses:
 *       '200':
 *         description: User logged out
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
router.get("/logout", logout)

/**
 * @openapi
 * /update_user:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Update user information
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         required: true
 *         description: Bearer token for authentication
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               program:
 *                 type: string
 *                 example: "Computer Science"
 *               address:
 *                 type: string
 *                 example: "Senayan Campus"
 *               phone:
 *                 type: string
 *                 example: "089123456789"
 *               bio:
 *                 type: string
 *                 example: "Your bio"
 *               avatar:
 *                 type: string
 *                 example: "URL link for user's image"
 *               password:
 *                 type: string
 *                 example: "NewPassword123"
 *               confirm_password:
 *                 type: string
 *                 example: "NewPassword123"
 *               youtube:
 *                 type: string
 *               instagram:
 *                 type: string
 *               facebook:
 *                 type: string
 *               twitter:
 *                 type: string
 *               github:
 *                 type: string
 *               website:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User information updated
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
router.patch("/update_user", auth, updateUser)

/**
 * @openapi
 * /update_role/{id}:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Update user role
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         required: true
 *         description: Bearer token for authentication
 *         schema:
 *           type: string
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: User role updated
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
router.patch("/update_role/:id", auth, authAdmin, updateUserRole)

/**
 * @openapi
 * /delete/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete a user
 *     parameters:
 *       - name: Authorization
 *         in: header
 *         required: true
 *         description: Bearer token for authentication
 *         schema:
 *           type: string
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: User deleted
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
router.delete("/delete/:id", auth, authAdmin, deleteUser)

export default router