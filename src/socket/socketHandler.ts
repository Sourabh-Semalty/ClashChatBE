import { Server, Socket } from 'socket.io';
import { verifyAccessToken } from '../utils/jwt';
import { User } from '../models/User';
import { Message } from '../models/Message';
import { Friendship } from '../models/Friendship';

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

const onlineUsers = new Map<string, string>();

export const setupSocketHandlers = (io: Server): void => {
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        console.error('Socket authentication failed: No token provided');
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = verifyAccessToken(token);
      socket.userId = decoded.userId;
      console.log(`Socket authentication successful for user: ${decoded.userId}`);

      next();
    } catch (error) {
      console.error('Socket authentication failed:', error instanceof Error ? error.message : error);
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', async (socket: AuthenticatedSocket) => {
    
    const userId = socket.userId;
    console.log(`Socket connection established for user: ${userId}`);

    if (!userId) {
      socket.disconnect();
      return;
    }

    console.log(`User connected: ${userId}`);

    onlineUsers.set(userId, socket.id);

    await User.findByIdAndUpdate(userId, { status: 'online' });

    const friendships = await Friendship.find({
      $or: [{ requester: userId }, { recipient: userId }],
      status: 'accepted',
    });

    const friendIds = friendships.map((f) => {
      const friendId = f.requester.toString() === userId ? f.recipient.toString() : f.requester.toString();
      return friendId;
    });

    friendIds.forEach((friendId) => {
      const friendSocketId = onlineUsers.get(friendId);
      if (friendSocketId) {
        io.to(friendSocketId).emit('user_online', { userId });
      }
    });

    socket.on('send_message', async (data: {
      receiverId: string;
      content: string;
      messageType?: 'text' | 'image' | 'file';
    }) => {
      console.log('------send_message--------', data)
      console.log('-------userId-------', userId)
      try {
        const { receiverId, content, messageType = 'text' } = data;

        const friendship = await Friendship.findOne({
          $or: [
            { requester: userId, recipient: receiverId },
            { requester: receiverId, recipient: userId },
          ],
          status: 'accepted',
        });

        if (!friendship) {
          socket.emit('error', { message: 'Not friends with this user' });
          return;
        }

        const message = await Message.create({
          sender: userId,
          receiver: receiverId,
          content,
          messageType,
          status: 'sent',
        });

        await message.populate('sender receiver', 'username avatar');

        const receiverSocketId = onlineUsers.get(receiverId);
        if (receiverSocketId) {
          message.status = 'delivered';
          await message.save();
          io.to(receiverSocketId).emit('receive_message', message);
        }

        socket.emit('message_sent', message);
      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('typing', (data: { receiverId: string }) => {
      console.log('------typing--------', data)
      const receiverSocketId = onlineUsers.get(data.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('typing', { userId });
      }
    });

    socket.on('stop_typing', (data: { receiverId: string }) => {
      console.log('------stop_typing--------', data)
      const receiverSocketId = onlineUsers.get(data.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('stop_typing', { userId });
      }
    });

    socket.on('message_read', async (data: { messageId: string }) => {
      console.log('------message_read--------', data)
        try {
        const message = await Message.findById(data.messageId);
        if (message && message.receiver.toString() === userId) {
          message.status = 'read';
          await message.save();

          const senderSocketId = onlineUsers.get(message.sender.toString());
          if (senderSocketId) {
            io.to(senderSocketId).emit('message_read', { messageId: data.messageId });
          }
        }
      } catch (error) {
        console.error('Message read error:', error);
      }
    });

    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${userId}`);

      onlineUsers.delete(userId);

      await User.findByIdAndUpdate(userId, {
        status: 'offline',
        lastSeen: new Date(),
      });

      friendIds.forEach((friendId) => {
        const friendSocketId = onlineUsers.get(friendId);
        if (friendSocketId) {
          io.to(friendSocketId).emit('user_offline', { userId });
        }
      });
    });
  });
};
