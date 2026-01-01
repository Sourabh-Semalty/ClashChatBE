import { Router } from 'express';
import { body } from 'express-validator';
import {
  getFriends,
  getAllUsers,
  searchUsers,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  getPendingRequests,
  getSentRequests,
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
 *     summary: Get all users with friendship status
 *     description: Retrieve a paginated list of all users in the system with their friendship status relative to the authenticated user. Shows if users are friends, have pending requests, or no relationship. Supports offset-based pagination.
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Number of users per page
 *         example: 20
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
 *                     data:
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
 *                           friendshipStatus:
 *                             type: string
 *                             enum: [self, friends, request_sent, request_received, rejected, none]
 *                             description: |
 *                               - self: The user themselves
 *                               - friends: Already friends
 *                               - request_sent: Current user sent a friend request
 *                               - request_received: Current user received a friend request
 *                               - rejected: Friend request was rejected
 *                               - none: No relationship
 *                             example: none
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                           description: Current page number
 *                           example: 1
 *                         limit:
 *                           type: integer
 *                           description: Number of items per page
 *                           example: 20
 *                         offset:
 *                           type: integer
 *                           description: Number of items skipped
 *                           example: 0
 *                         total:
 *                           type: integer
 *                           description: Total number of users available
 *                           example: 150
 *                         totalPages:
 *                           type: integer
 *                           description: Total number of pages
 *                           example: 8
 *                         hasNextPage:
 *                           type: boolean
 *                           description: Whether there is a next page
 *                           example: true
 *                         hasPrevPage:
 *                           type: boolean
 *                           description: Whether there is a previous page
 *                           example: false
 *       401:
 *         description: Unauthorized - Authentication required
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
 * /api/friends/requests/pending:
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
 * /api/friends/requests/sent:
 *   get:
 *     summary: Get sent friend requests
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sent requests retrieved
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
 *                   example: Sent requests retrieved
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
 *                           recipient:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 example: 507f1f77bcf86cd799439011
 *                               username:
 *                                 type: string
 *                                 example: jane_smith
 *                               email:
 *                                 type: string
 *                                 example: jane@example.com
 *                               avatar:
 *                                 type: string
 *                                 example: https://api.dicebear.com/7.x/avataaars/svg?seed=jane_smith
 *                               status:
 *                                 type: string
 *                                 example: online
 *                           status:
 *                             type: string
 *                             example: pending
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to retrieve sent requests
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
 * /api/friends/reject/{requestId}:
 *   delete:
 *     summary: Reject friend request
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
 *         description: Friend request rejected
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
 *                   example: Friend request rejected
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
 *                           example: rejected
 *       400:
 *         description: Invalid request ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Friend request not found
 *       500:
 *         description: Failed to reject friend request
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
router.get('/all', authenticate, getAllUsers);
router.get('/search', authenticate, searchUsers);
router.get('/requests/pending', authenticate, getPendingRequests);
router.get('/requests/sent', authenticate, getSentRequests);
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
router.put('/accept/:requestId', authenticate, acceptFriendRequest);
router.delete('/reject/:requestId', authenticate, rejectFriendRequest);
router.delete('/remove/:friendId', authenticate, removeFriend);

export default router;
