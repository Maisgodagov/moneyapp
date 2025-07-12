import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../features/auth/authSlice';
import type { AppDispatch, RootState } from '../store';
import {
  AuthContainer,
  AuthForm,
  Title,
  InputGroup,
  Label,
  Input,
  Button,
  ErrorMessage,
  RedirectLink,
} from '../styles/Auth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { status, error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(login({ email, password })).unwrap();
      navigate('/');
    } catch (err) {
      console.error('Failed to login:', err);
    }
  };

  return (
    <AuthContainer>
      <AuthForm onSubmit={handleSubmit}>
        <Title>Login to Your Account</Title>
        <InputGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            required
            placeholder="email@example.com"
          />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            required
            placeholder="********"
          />
        </InputGroup>
        <Button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Logging in...' : 'Login'}
        </Button>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <RedirectLink>
          Don't have an account? <Link to="/register">Register</Link>
        </RedirectLink>
      </AuthForm>
    </AuthContainer>
  );
};

export default LoginPage; 