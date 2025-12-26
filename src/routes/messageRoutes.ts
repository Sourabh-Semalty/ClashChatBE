import { Router } from 'express';
import { body } from 'express-validator';
import { getMessages, sendMessage } from '../controllers/messageController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/messages/{friendId}:
 *   get:
 *     summary: Get messages with a friend
 *     tags: [Messages]
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
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *           example: 50
 *         description: Number of messages to retrieve
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *           example: 0
 *         description: Number of messages to skip (for pagination)
 *     responses:
 *       200:
 *         description: Messages retrieved successfully
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
 *                   example: Messages retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     messages:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 507f1f77bcf86cd799439013
 *                           sender:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 example: 507f1f77bcf86cd799439010
 *                               username:
 *                                 type: string
 *                                 example: john_doe
 *                               avatar:
 *                                 type: string
 *                                 example: https://api.dicebear.com/7.x/avataaars/svg?seed=john_doe
 *                           receiver:
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
 *                           content:
 *                             type: string
 *                             example: Hello! How are you?
 *                           messageType:
 *                             type: string
 *                             enum: [text, image, file]
 *                             example: text
 *                           status:
 *                             type: string
 *                             enum: [sent, delivered, read]
 *                             example: read
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: 2024-12-24T12:30:00.000Z
 *                     unreadCount:
 *                       type: integer
 *                       example: 3
 *       400:
 *         description: Invalid friend ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not friends
 *       500:
 *         description: Failed to retrieve messages
 */

/**
 * @swagger
 * /api/messages/send:
 *   post:
 *     summary: Send a message to a friend
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - receiverId
 *               - content
 *             properties:
 *               receiverId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               content:
 *                 type: string
 *                 example: Hello! How are you doing?
 *               messageType:
 *                 type: string
 *                 enum: [text, image, file]
 *                 default: text
 *                 example: text
 *     responses:
 *       201:
 *         description: Message sent successfully
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
 *                   example: Message sent successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: 507f1f77bcf86cd799439013
 *                         sender:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                               example: 507f1f77bcf86cd799439010
 *                             username:
 *                               type: string
 *                               example: john_doe
 *                             avatar:
 *                               type: string
 *                               example: https://api.dicebear.com/7.x/avataaars/svg?seed=john_doe
 *                         receiver:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                               example: 507f1f77bcf86cd799439011
 *                             username:
 *                               type: string
 *                               example: jane_smith
 *                             avatar:
 *                               type: string
 *                               example: https://api.dicebear.com/7.x/avataaars/svg?seed=jane_smith
 *                         content:
 *                           type: string
 *                           example: Hello! How are you doing?
 *                         messageType:
 *                           type: string
 *                           example: text
 *                         status:
 *                           type: string
 *                           example: sent
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: 2024-12-24T12:30:00.000Z
 *       400:
 *         description: Missing required fields or invalid receiver ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not friends
 *       500:
 *         description: Failed to send message
 */

// ============================================
// ROUTES
// ============================================

router.get('/:friendId', getMessages);

router.post(
  '/send',
  [
    body('receiverId')
      .notEmpty()
      .withMessage('Receiver ID is required'),
    body('content')
      .trim()
      .notEmpty()
      .withMessage('Message content is required'),
    body('messageType')
      .optional()
      .isIn(['text', 'image', 'file'])
      .withMessage('Invalid message type'),
  ],
  sendMessage
);

export default router;
