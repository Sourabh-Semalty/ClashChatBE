import { Request, Response } from 'express';
import { User } from '../models/User';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { sendSuccess, sendError } from '../utils/response';
import { validationResult } from 'express-validator';

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendError(res, 'Validation failed', errors.array()[0].msg, 400);
      return;
    }

    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      sendError(res, 'User already exists', 'Email or username already registered', 409);
      return;
    }

    const user = await User.create({
      username,
      email,
      password,
    });

    const accessToken = generateAccessToken({ userId: user._id.toString(), email: user.email });
    const refreshToken = generateRefreshToken({ userId: user._id.toString(), email: user.email });

    user.refreshToken = refreshToken;
    await user.save();

    sendSuccess(
      res,
      'User registered successfully',
      {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          status: user.status,
        },
        accessToken,
        refreshToken,
      },
      201
    );
  } catch (error) {
    console.error('Signup error:', error);
    sendError(res, 'Registration failed', error instanceof Error ? error.message : 'Unknown error', 500);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendError(res, 'Validation failed', errors.array()[0].msg, 400);
      return;
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      sendError(res, 'Login failed', 'Invalid credentials', 401);
      return;
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      sendError(res, 'Login failed', 'Invalid credentials', 401);
      return;
    }

    const accessToken = generateAccessToken({ userId: user._id.toString(), email: user.email });
    const refreshToken = generateRefreshToken({ userId: user._id.toString(), email: user.email });

    user.refreshToken = refreshToken;
    await user.save();

    sendSuccess(res, 'Login successful', {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        status: user.status,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Login error:', error);
    sendError(res, 'Login failed', error instanceof Error ? error.message : 'Unknown error', 500);
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      sendError(res, 'Refresh token required', 'No refresh token provided', 400);
      return;
    }

    const decoded = verifyRefreshToken(refreshToken);

    const user = await User.findById(decoded.userId).select('+refreshToken');
    if (!user || user.refreshToken !== refreshToken) {
      sendError(res, 'Invalid refresh token', 'Token mismatch or user not found', 401);
      return;
    }

    const newAccessToken = generateAccessToken({ userId: user._id.toString(), email: user.email });
    const newRefreshToken = generateRefreshToken({ userId: user._id.toString(), email: user.email });

    user.refreshToken = newRefreshToken;
    await user.save();

    sendSuccess(res, 'Token refreshed successfully', {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
      sendError(res, 'Invalid refresh token', error.message, 401);
      return;
    }
    sendError(res, 'Token refresh failed', error instanceof Error ? error.message : 'Unknown error', 500);
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);
    if (user) {
      user.refreshToken = undefined;
      await user.save();
    }

    sendSuccess(res, 'Logout successful');
  } catch (error) {
    console.error('Logout error:', error);
    sendError(res, 'Logout failed', error instanceof Error ? error.message : 'Unknown error', 500);
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      sendError(res, 'User not found', 'User profile not found', 404);
      return;
    }

    sendSuccess(res, 'Profile retrieved successfully', {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        status: user.status,
        lastSeen: user.lastSeen,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    sendError(res, 'Failed to retrieve profile', error instanceof Error ? error.message : 'Unknown error', 500);
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      sendError(res, 'Validation failed', errors.array()[0].msg, 400);
      return;
    }

    const userId = req.userId;
    const { username, avatar, status } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      sendError(res, 'User not found', 'User profile not found', 404);
      return;
    }

    // Check if username is being changed and if it's already taken
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username, _id: { $ne: userId } });
      if (existingUser) {
        sendError(res, 'Username already taken', 'This username is already registered by another user', 409);
        return;
      }
      user.username = username;
    }

    if (avatar !== undefined) {
      user.avatar = avatar;
    }

    if (status && ['online', 'offline', 'away'].includes(status)) {
      user.status = status;
    }

    await user.save();

    sendSuccess(res, 'Profile updated successfully', {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        status: user.status,
        lastSeen: user.lastSeen,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    sendError(res, 'Failed to update profile', error instanceof Error ? error.message : 'Unknown error', 500);
  }
};
