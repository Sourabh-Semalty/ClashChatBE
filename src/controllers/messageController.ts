import { Request, Response } from 'express';
import { Message } from '../models/Message';
import { Friendship } from '../models/Friendship';
import { sendSuccess, sendError } from '../utils/response';
import mongoose from 'mongoose';

export const getMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { friendId } = req.params;
    const userId = req.userId;
    const { limit = 50, skip = 0 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(friendId)) {
      sendError(res, 'Invalid friend ID', 'Please provide a valid friend ID', 400);
      return;
    }

    const friendship = await Friendship.findOne({
      $or: [
        { requester: userId, recipient: friendId },
        { requester: friendId, recipient: userId },
      ],
      status: 'accepted',
    });

    if (!friendship) {
      sendError(res, 'Not friends', 'You can only view messages with friends', 403);
      return;
    }

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: friendId },
        { sender: friendId, receiver: userId },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(skip))
      .populate('sender receiver', 'username avatar');

    const unreadMessages = await Message.updateMany(
      {
        sender: friendId,
        receiver: userId,
        status: { $ne: 'read' },
      },
      { status: 'read' }
    );

    sendSuccess(res, 'Messages retrieved successfully', {
      messages: messages.reverse(),
      unreadCount: unreadMessages.modifiedCount,
    });
  } catch (error) {
    console.error('Get messages error:', error);
    sendError(res, 'Failed to retrieve messages', error instanceof Error ? error.message : 'Unknown error', 500);
  }
};

export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { receiverId, content, messageType = 'text' } = req.body;
    const senderId = req.userId;

    if (!receiverId || !content) {
      sendError(res, 'Missing required fields', 'Receiver ID and content are required', 400);
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      sendError(res, 'Invalid receiver ID', 'Please provide a valid receiver ID', 400);
      return;
    }

    const friendship = await Friendship.findOne({
      $or: [
        { requester: senderId, recipient: receiverId },
        { requester: receiverId, recipient: senderId },
      ],
      status: 'accepted',
    });

    if (!friendship) {
      sendError(res, 'Not friends', 'You can only send messages to friends', 403);
      return;
    }

    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      content,
      messageType,
      status: 'sent',
    });

    await message.populate('sender receiver', 'username avatar');

    sendSuccess(res, 'Message sent successfully', { message }, 201);
  } catch (error) {
    console.error('Send message error:', error);
    sendError(res, 'Failed to send message', error instanceof Error ? error.message : 'Unknown error', 500);
  }
};
