import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background-color: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.5rem;
  font-weight: 700;
`;

const StatusIndicator = styled.div<{ $connected: boolean }>`
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: ${({ theme, $connected }) => $connected ? theme.colors.success : theme.colors.danger};
  
  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${({ theme, $connected }) => $connected ? theme.colors.success : theme.colors.danger};
    margin-right: ${({ theme }) => theme.spacing.xs};
  }
`;

const Header: React.FC = () => {
  // В реальном приложении здесь можно добавить проверку подключения к API
  const isApiConnected = true;

  return (
    <HeaderContainer>
      <Logo>💰 Money Tracker</Logo>
      <StatusIndicator $connected={isApiConnected}>
        {isApiConnected ? 'API подключен' : 'API отключен'}
      </StatusIndicator>
    </HeaderContainer>
  );
};

export default Header; 