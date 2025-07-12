import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as User & { id: number };
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
}; 