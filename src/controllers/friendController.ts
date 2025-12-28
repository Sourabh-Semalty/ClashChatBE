import { Request, Response } from 'express';
import { User } from '../models/User';
import { Friendship } from '../models/Friendship';
import { sendSuccess, sendError } from '../utils/response';
import mongoose from 'mongoose';

export const getFriends = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    const friendships = await Friendship.find({
      $or: [{ requester: userId }, { recipient: userId }],
      status: 'accepted',
    }).populate('requester recipient', 'username email avatar status lastSeen');

    const friends = friendships.map((friendship) => {
      const friend = friendship.requester._id.toString() === userId
        ? friendship.recipient
        : friendship.requester;
      return friend;
    });

    sendSuccess(res, 'Friends retrieved successfully', { friends });
  } catch (error) {
    console.error('Get friends error:', error);
    sendError(res, 'Failed to retrieve friends', error instanceof Error ? error.message : 'Unknown error', 500);
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    const users = await User.find()
      .select('username email avatar status')
      .limit(20)
      .sort({ createdAt: -1 });

    if (userId) {
      const friendships = await Friendship.find({
        $or: [
          { requester: userId },
          { recipient: userId }
        ]
      });

      const usersWithStatus = users.map(user => {
        const userObj = user.toObject();
        
        if (user._id.toString() === userId) {
          return { ...userObj, friendshipStatus: 'self' };
        }

        const friendship = friendships.find(f => 
          f.requester.toString() === user._id.toString() || 
          f.recipient.toString() === user._id.toString()
        );

        if (friendship) {
          if (friendship.status === 'accepted') {
            return { ...userObj, friendshipStatus: 'friends' };
          } else if (friendship.status === 'pending') {
            if (friendship.requester.toString() === userId) {
              return { ...userObj, friendshipStatus: 'request_sent' };
            } else {
              return { ...userObj, friendshipStatus: 'request_received' };
            }
          } else if (friendship.status === 'rejected') {
            return { ...userObj, friendshipStatus: 'rejected' };
          }
        }

        return { ...userObj, friendshipStatus: 'none' };
      });

      sendSuccess(res, 'Users found', { users: usersWithStatus, count: usersWithStatus.length });
    } else {
      const usersWithStatus = users.map(user => ({
        ...user.toObject(),
        friendshipStatus: 'none'
      }));
      sendSuccess(res, 'Users found', { users: usersWithStatus, count: usersWithStatus.length });
    }
  } catch (error) {
    console.error('Get all users error:', error);
    sendError(res, 'Failed to retrieve users', error instanceof Error ? error.message : 'Unknown error', 500);
  }
};

export const searchUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.query;
    const userId = req.userId;

    if (!query || typeof query !== 'string') {
      sendError(res, 'Search query required', 'Please provide a search query', 400);
      return;
    }

    const users = await User.find({
      _id: { $ne: userId },
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
      ],
    })
      .select('username email avatar status')
      .limit(20);

    sendSuccess(res, 'Users found', { users });
  } catch (error) {
    console.error('Search users error:', error);
    sendError(res, 'Search failed', error instanceof Error ? error.message : 'Unknown error', 500);
  }
};

export const sendFriendRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { recipientId } = req.body;
    const requesterId = req.userId;

    if (!recipientId) {
      sendError(res, 'Recipient ID required', 'Please provide recipient ID', 400);
      return;
    }

    if (recipientId === requesterId) {
      sendError(res, 'Invalid request', 'Cannot send friend request to yourself', 400);
      return;
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      sendError(res, 'User not found', 'Recipient does not exist', 404);
      return;
    }

    const existingFriendship = await Friendship.findOne({
      $or: [
        { requester: requesterId, recipient: recipientId },
        { requester: recipientId, recipient: requesterId },
      ],
    });

    if (existingFriendship) {
      if (existingFriendship.status === 'accepted') {
        sendError(res, 'Already friends', 'You are already friends with this user', 400);
        return;
      }
      if (existingFriendship.status === 'pending') {
        sendError(res, 'Request pending', 'Friend request already sent', 400);
        return;
      }
    }

    const friendship = await Friendship.create({
      requester: requesterId,
      recipient: recipientId,
      status: 'pending',
    });

    await friendship.populate('recipient', 'username email avatar');

    sendSuccess(res, 'Friend request sent', { friendship }, 201);
  } catch (error) {
    console.error('Send friend request error:', error);
    sendError(res, 'Failed to send friend request', error instanceof Error ? error.message : 'Unknown error', 500);
  }
};

export const acceptFriendRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { requestId } = req.params;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      sendError(res, 'Invalid request ID', 'Please provide a valid request ID', 400);
      return;
    }

    const friendship = await Friendship.findOne({
      _id: requestId,
      recipient: userId,
      status: 'pending',
    });

    if (!friendship) {
      sendError(res, 'Friend request not found', 'Request does not exist or already processed', 404);
      return;
    }

    friendship.status = 'accepted';
    await friendship.save();

    await friendship.populate('requester', 'username email avatar status');

    sendSuccess(res, 'Friend request accepted', { friendship });
  } catch (error) {
    console.error('Accept friend request error:', error);
    sendError(res, 'Failed to accept friend request', error instanceof Error ? error.message : 'Unknown error', 500);
  }
};

export const rejectFriendRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { requestId } = req.params;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      sendError(res, 'Invalid request ID', 'Please provide a valid request ID', 400);
      return;
    }

    const friendship = await Friendship.findOne({
      _id: requestId,
      recipient: userId,
      status: 'pending',
    });

    if (!friendship) {
      sendError(res, 'Friend request not found', 'Request does not exist or already processed', 404);
      return;
    }

    friendship.status = 'rejected';
    await friendship.save();

    await friendship.populate('requester', 'username email avatar status');

    sendSuccess(res, 'Friend request rejected', { friendship });
  } catch (error) {
    console.error('Reject friend request error:', error);
    sendError(res, 'Failed to reject friend request', error instanceof Error ? error.message : 'Unknown error', 500);
  }
};

export const removeFriend = async (req: Request, res: Response): Promise<void> => {
  try {
    const { friendId } = req.params;
    const userId = req.userId;

    if (!mongoose.Types.ObjectId.isValid(friendId)) {
      sendError(res, 'Invalid friend ID', 'Please provide a valid friend ID', 400);
      return;
    }

    const friendship = await Friendship.findOneAndDelete({
      $or: [
        { requester: userId, recipient: friendId },
        { requester: friendId, recipient: userId },
      ],
      status: 'accepted',
    });

    if (!friendship) {
      sendError(res, 'Friendship not found', 'You are not friends with this user', 404);
      return;
    }

    sendSuccess(res, 'Friend removed successfully');
  } catch (error) {
    console.error('Remove friend error:', error);
    sendError(res, 'Failed to remove friend', error instanceof Error ? error.message : 'Unknown error', 500);
  }
};

export const getPendingRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    const pendingRequests = await Friendship.find({
      recipient: userId,
      status: 'pending',
    }).populate('requester', 'username email avatar status');

    sendSuccess(res, 'Pending requests retrieved', { requests: pendingRequests });
  } catch (error) {
    console.error('Get pending requests error:', error);
    sendError(res, 'Failed to retrieve pending requests', error instanceof Error ? error.message : 'Unknown error', 500);
  }
};
