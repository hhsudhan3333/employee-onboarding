import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { fail } from '../utils/response';
import Admin from '../models/Admin';
import Employee from '../models/Employee';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export interface AuthRequest extends Request {
  user?: any;
  role?: 'admin'|'employee';
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header) return fail(res, 'Authorization header missing', null, 401);
  const token = header.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    req.user = payload;
    req.role = payload.role;
    next();
  } catch (err) {
    return fail(res, 'Invalid or expired token', null, 401);
  }
};

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.role !== 'admin') return fail(res, 'Admin only', null, 403);
  next();
};
