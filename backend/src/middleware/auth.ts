import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: 'CUSTOMER' | 'ADMIN';
  };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (
    !authHeader ||
    !authHeader.startsWith('Bearer ')
  ) {
    return res.status(401).json({
      error: 'Access Denied',
    });
  }

  const token = authHeader.substring(7);

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({
      error: 'JWT_SECRET is not configured',
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      secret
    ) as {
      id: string;
      role: 'CUSTOMER' | 'ADMIN';
    };

    req.user = decoded;

    next();
  } catch {
    return res.status(401).json({
      error: 'Invalid or expired token',
    });
  }
};

export const authorizeAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Authentication required',
    });
  }

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({
      error: 'Admin access required',
    });
  }

  next();
};