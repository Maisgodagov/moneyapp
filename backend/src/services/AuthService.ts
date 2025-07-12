import { DatabaseService } from './DatabaseService';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class AuthService {
  private db: DatabaseService;

  constructor() {
    this.db = new DatabaseService();
  }

  async createUser(user: User): Promise<User> {
    const { email, password } = user;
    if (!password) {
      throw new Error('Password is required');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await this.db.query(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hashedPassword]
    );
    return { id: result.insertId, email };
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const users = await this.db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return null;
    }
    return users[0];
  }

  async comparePasswords(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  generateToken(user: User): string {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }
    if (!user.id) {
        throw new Error('User ID is required to generate a token');
    }
    return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
  }
} 