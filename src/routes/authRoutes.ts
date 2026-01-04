import { Router } from 'express';
import { body } from 'express-validator';
import {
  signup,
  login,
  refreshToken,
  logout,
  getProfile,
  updateProfile,
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 30
 *                 example: john_doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: 507f1f77bcf86cd799439011
 *                         username:
 *                           type: string
 *                           example: john_doe
 *                         email:
 *                           type: string
 *                           example: john@example.com
 *                         avatar:
 *                           type: string
 *                           example: https://api.dicebear.com/7.x/avataaars/svg?seed=john_doe
 *                         status:
 *                           type: string
 *                           example: offline
 *                     accessToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     refreshToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Validation failed
 *       409:
 *         description: User already exists
 *       500:
 *         description: Registration failed
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: 507f1f77bcf86cd799439011
 *                         username:
 *                           type: string
 *                           example: john_doe
 *                         email:
 *                           type: string
 *                           example: john@example.com
 *                         avatar:
 *                           type: string
 *                           example: https://api.dicebear.com/7.x/avataaars/svg?seed=john_doe
 *                         status:
 *                           type: string
 *                           example: online
 *                     accessToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     refreshToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Login failed
 */

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Token refreshed successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     refreshToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Refresh token required
 *       401:
 *         description: Invalid refresh token
 *       500:
 *         description: Token refresh failed
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Logout successful
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Logout failed
 */

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Profile retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: 507f1f77bcf86cd799439011
 *                         username:
 *                           type: string
 *                           example: john_doe
 *                         email:
 *                           type: string
 *                           example: john@example.com
 *                         avatar:
 *                           type: string
 *                           example: https://api.dicebear.com/7.x/avataaars/svg?seed=john_doe
 *                         status:
 *                           type: string
 *                           example: online
 *                         lastSeen:
 *                           type: string
 *                           format: date-time
 *                           example: 2024-01-01T12:00:00.000Z
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: 2024-01-01T10:00:00.000Z
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to retrieve profile
 *   put:
 *     summary: Update user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 30
 *                 example: john_doe_updated
 *               avatar:
 *                 type: string
 *                 format: uri
 *                 example: https://api.dicebear.com/7.x/avataaars/svg?seed=john_doe_updated
 *               status:
 *                 type: string
 *                 enum: [online, offline, away]
 *                 example: online
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Profile updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: 507f1f77bcf86cd799439011
 *                         username:
 *                           type: string
 *                           example: john_doe_updated
 *                         email:
 *                           type: string
 *                           example: john@example.com
 *                         avatar:
 *                           type: string
 *                           example: https://api.dicebear.com/7.x/avataaars/svg?seed=john_doe_updated
 *                         status:
 *                           type: string
 *                           example: online
 *                         lastSeen:
 *                           type: string
 *                           format: date-time
 *                           example: 2024-01-01T12:00:00.000Z
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       409:
 *         description: Username already taken
 *       500:
 *         description: Failed to update profile
 */

router.post(
  '/signup',
  [
    body('username')
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage('Username must be between 3 and 30 characters'),
    body('email')
      .trim()
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  signup
);

router.post(
  '/login',
  [
    body('email')
      .trim()
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ],
  login
);

router.post('/refresh', refreshToken);

router.post('/logout', authenticate, logout);

router.get('/profile', authenticate, getProfile);

router.put(
  '/profile',
  authenticate,
  [
    body('username')
      .optional()
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage('Username must be between 3 and 30 characters'),
    body('avatar')
      .optional()
      .isURL()
      .withMessage('Avatar must be a valid URL'),
    body('status')
      .optional()
      .isIn(['online', 'offline', 'away'])
      .withMessage('Status must be online, offline, or away'),
  ],
  updateProfile
);

export default router;
