import jwt, { SignOptions } from 'jsonwebtoken';

export interface TokenPayload {
  userId: string;
  email: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(
    payload,
    process.env.JWT_ACCESS_SECRET || 'access-secret',
    { expiresIn: process.env.JWT_ACCESS_EXPIRY || '1d' } as SignOptions
  );
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET || 'refresh-secret',
    { expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d' } as SignOptions
  );
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(
    token,
    process.env.JWT_ACCESS_SECRET || 'access-secret'
  ) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET || 'refresh-secret'
  ) as TokenPayload;
};
