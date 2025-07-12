export interface UserCredentials {
  email: string;
  password?: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  email: string;
}

export interface AuthError {
  message: string;
} 