import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { User } from '../models/User';

const authService = new AuthService();

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existingUser = await authService.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const newUser: User = { email, password };
    const createdUser = await authService.createUser(newUser);

    const token = authService.generateToken(createdUser);

    res.status(201).json({ token, userId: createdUser.id, email: createdUser.email });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration', error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await authService.findUserByEmail(email);
    if (!user || !user.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await authService.comparePasswords(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = authService.generateToken(user);

    res.status(200).json({ token, userId: user.id, email: user.email });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login', error });
  }
}; 