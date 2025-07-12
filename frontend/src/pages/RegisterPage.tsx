import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../features/auth/authSlice';
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

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { status, error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    try {
      await dispatch(register({ email, password })).unwrap();
      navigate('/');
    } catch (err) {
      console.error('Failed to register:', err);
    }
  };

  return (
    <AuthContainer>
      <AuthForm onSubmit={handleSubmit}>
        <Title>Create Your Account</Title>
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
        <InputGroup>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
            required
            placeholder="********"
          />
        </InputGroup>
        <Button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Registering...' : 'Register'}
        </Button>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <RedirectLink>
          Already have an account? <Link to="/login">Login</Link>
        </RedirectLink>
      </AuthForm>
    </AuthContainer>
  );
};

export default RegisterPage; 