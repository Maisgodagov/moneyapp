import styled from 'styled-components';

export const AuthContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const AuthForm = styled.form`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const Label = styled.label`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary + '33'};
  }
`;

export const Button = styled.button`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.primary};
  color: #fff;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1d4ed8; // Darker primary
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.secondary};
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.danger};
  text-align: center;
  font-size: 0.9rem;
`;

export const RedirectLink = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.md};
  & a {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
  }
`; 