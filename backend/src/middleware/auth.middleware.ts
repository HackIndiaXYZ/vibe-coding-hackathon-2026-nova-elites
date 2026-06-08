import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { getUserById } from '../services/user.service';
import { createErrorResponse } from '../utils/response';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(createErrorResponse('Missing or invalid authentication token', 'UNAUTHORIZED'));
    }

    const token = authHeader.split(' ')[1];
    
    let decoded: any;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json(createErrorResponse('Invalid or expired token', 'TOKEN_EXPIRED'));
    }

    if (!decoded || !decoded.userId) {
      return res.status(401).json(createErrorResponse('Invalid token payload', 'UNAUTHORIZED'));
    }

    const user = await getUserById(decoded.userId);
    if (!user) {
      return res.status(401).json(createErrorResponse('User not found', 'UNAUTHORIZED'));
    }

    // Attach user from DB as per requirements
    req.user = {
      id: user.id,
      email: user.email
    };

    next();
  } catch (err) {
    next(err);
  }
};
