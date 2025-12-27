import { Router } from 'express';
import { body } from 'express-validator';
import {
  getFriends,
  getAllUsers,
  searchUsers,
  sendFriendRequest,
  acceptFriendRequest,
  removeFriend,
  getPendingRequests,
} from '../controllers/friendController';
import { authenticate } from '../middleware/auth';

const router = Router();
/**
 * @swagger
 * /api/friends:
 *   get:
 *     summary: Get all friends
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Friends retrieved successfully
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
 *                   example: Friends retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     friends:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 507f1f77bcf86cd799439011
 *                           username:
 *                             type: string
 *                             example: jane_smith
 *                           email:
 *                             type: string
 *                             example: jane@example.com
 *                           avatar:
 *                             type: string
 *                             example: https://api.dicebear.com/7.x/avataaars/svg?seed=jane_smith
 *                           status:
 *                             type: string
 *                             enum: [online, offline, away]
 *                             example: online
 *                           lastSeen:
 *                             type: string
 *                             format: date-time
 *                             example: 2024-12-24T12:30:00.000Z
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to retrieve friends
 */

/**
 * @swagger
 * /api/friends/all:
 *   get:
 *     summary: Get all users (public endpoint)
 *     description: Retrieve a list of all users in the system. Limited to 20 users. This is a public endpoint that doesn't require authentication.
 *     tags: [Friends]
 *     responses:
 *       200:
 *         description: Users retrieved successfully
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
 *                   example: Users found
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 507f1f77bcf86cd799439011
 *                           username:
 *                             type: string
 *                             example: john_doe
 *                           email:
 *                             type: string
 *                             example: john@example.com
 *                           avatar:
 *                             type: string
 *                             example: https://api.dicebear.com/7.x/avataaars/svg?seed=john_doe
 *                           status:
 *                             type: string
 *                             enum: [online, offline, away]
 *                             example: offline
 *       500:
 *         description: Failed to retrieve users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Failed to retrieve users
 *                 error:
 *                   type: string
 *                   example: Database connection error
 */

/**
 * @swagger
 * /api/friends/search:
 *   get:
 *     summary: Search users by username or email
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *           example: john
 *         description: Search query for username or email
 *     responses:
 *       200:
 *         description: Users found
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
 *                   example: Users found
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 507f1f77bcf86cd799439011
 *                           username:
 *                             type: string
 *                             example: john_doe
 *                           email:
 *                             type: string
 *                             example: john@example.com
 *                           avatar:
 *                             type: string
 *                             example: https://api.dicebear.com/7.x/avataaars/svg?seed=john_doe
 *                           status:
 *                             type: string
 *                             example: online
 *       400:
 *         description: Search query required
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Search failed
 */

/**
 * @swagger
 * /api/friends/requests:
 *   get:
 *     summary: Get pending friend requests
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending requests retrieved
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
 *                   example: Pending requests retrieved
 *                 data:
 *                   type: object
 *                   properties:
 *                     requests:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 507f1f77bcf86cd799439012
 *                           requester:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 example: 507f1f77bcf86cd799439011
 *                               username:
 *                                 type: string
 *                                 example: john_doe
 *                               email:
 *                                 type: string
 *                                 example: john@example.com
 *                               avatar:
 *                                 type: string
 *                                 example: https://api.dicebear.com/7.x/avataaars/svg?seed=john_doe
 *                               status:
 *                                 type: string
 *                                 example: online
 *                           status:
 *                             type: string
 *                             example: pending
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: 2024-12-24T12:00:00.000Z
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to retrieve pending requests
 */

/**
 * @swagger
 * /api/friends/add:
 *   post:
 *     summary: Send friend request
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipientId
 *             properties:
 *               recipientId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *     responses:
 *       201:
 *         description: Friend request sent
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
 *                   example: Friend request sent
 *                 data:
 *                   type: object
 *                   properties:
 *                     friendship:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: 507f1f77bcf86cd799439012
 *                         requester:
 *                           type: string
 *                           example: 507f1f77bcf86cd799439010
 *                         recipient:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                               example: 507f1f77bcf86cd799439011
 *                             username:
 *                               type: string
 *                               example: jane_smith
 *                             email:
 *                               type: string
 *                               example: jane@example.com
 *                             avatar:
 *                               type: string
 *                               example: https://api.dicebear.com/7.x/avataaars/svg?seed=jane_smith
 *                         status:
 *                           type: string
 *                           example: pending
 *       400:
 *         description: Invalid request or already friends
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to send friend request
 */

/**
 * @swagger
 * /api/friends/accept/{requestId}:
 *   put:
 *     summary: Accept friend request
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *           example: 507f1f77bcf86cd799439012
 *         description: Friend request ID
 *     responses:
 *       200:
 *         description: Friend request accepted
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
 *                   example: Friend request accepted
 *                 data:
 *                   type: object
 *                   properties:
 *                     friendship:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: 507f1f77bcf86cd799439012
 *                         requester:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                               example: 507f1f77bcf86cd799439011
 *                             username:
 *                               type: string
 *                               example: john_doe
 *                             email:
 *                               type: string
 *                               example: john@example.com
 *                             avatar:
 *                               type: string
 *                               example: https://api.dicebear.com/7.x/avataaars/svg?seed=john_doe
 *                             status:
 *                               type: string
 *                               example: online
 *                         status:
 *                           type: string
 *                           example: accepted
 *       400:
 *         description: Invalid request ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Friend request not found
 *       500:
 *         description: Failed to accept friend request
 */

/**
 * @swagger
 * /api/friends/remove/{friendId}:
 *   delete:
 *     summary: Remove friend
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: friendId
 *         required: true
 *         schema:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         description: Friend user ID
 *     responses:
 *       200:
 *         description: Friend removed successfully
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
 *                   example: Friend removed successfully
 *       400:
 *         description: Invalid friend ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Friendship not found
 *       500:
 *         description: Failed to remove friend
 */

// ============================================
// ROUTES
// ============================================

router.get('/', authenticate, getFriends);
router.get('/all', getAllUsers);
router.get('/search', authenticate, searchUsers);
router.get('/requests', authenticate, getPendingRequests);
router.post(
  '/add',
  authenticate,
  [
    body('recipientId')
      .notEmpty()
      .withMessage('Recipient ID is required'),
  ],
  sendFriendRequest
);
router.put('/accept/:requestId', acceptFriendRequest);
router.delete('/remove/:friendId', removeFriend);

export default router;
