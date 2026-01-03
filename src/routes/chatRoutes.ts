import { Router } from 'express';
import { getChats } from '../controllers/messageController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/chats:
 *   get:
 *     summary: Get all chat conversations for the authenticated user
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           example: 20
 *         description: Number of chats to retrieve
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *           example: 0
 *         description: Number of chats to skip (for pagination)
 *     responses:
 *       200:
 *         description: Chats retrieved successfully
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
 *                   example: Chats retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     chats:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           friendId:
 *                             type: string
 *                             example: 507f1f77bcf86cd799439011
 *                           friend:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 example: 507f1f77bcf86cd799439011
 *                               username:
 *                                 type: string
 *                                 example: jane_smith
 *                               avatar:
 *                                 type: string
 *                                 example: https://api.dicebear.com/7.x/avataaars/svg?seed=jane_smith
 *                           lastMessage:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 example: 507f1f77bcf86cd799439013
 *                               content:
 *                                 type: string
 *                                 example: Hey! How are you doing?
 *                               messageType:
 *                                 type: string
 *                                 enum: [text, image, file]
 *                                 example: text
 *                               status:
 *                                 type: string
 *                                 enum: [sent, delivered, read]
 *                                 example: read
 *                               createdAt:
 *                                 type: string
 *                                 format: date-time
 *                                 example: 2024-12-24T12:30:00.000Z
 *                               sender:
 *                                 type: object
 *                                 properties:
 *                                   _id:
 *                                     type: string
 *                                     example: 507f1f77bcf86cd799439010
 *                                   username:
 *                                     type: string
 *                                     example: john_doe
 *                           unreadCount:
 *                             type: integer
 *                             example: 3
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: 2024-12-24T12:30:00.000Z
 *                     total:
 *                       type: integer
 *                       example: 15
 *                     hasMore:
 *                       type: boolean
 *                       example: false
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to retrieve chats
 */

// ============================================
// ROUTES
// ============================================

router.get('/', getChats);

export default router;
