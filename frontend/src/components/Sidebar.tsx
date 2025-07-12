import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import type { AppDispatch } from '../store';

const SidebarContainer = styled.aside`
  width: 220px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-height: 100vh;
  padding: 0;
`;

const LogoBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.lg};
`;

const Logo = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
`;

const StatusIndicator = styled.div<{ $connected: boolean }>`
  display: flex;
  align-items: center;
  font-size: 0.95rem;
  color: ${({ theme, $connected }) => $connected ? theme.colors.success : theme.colors.danger};
  margin-left: 2px;
  margin-bottom: 0.5rem;
  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${({ theme, $connected }) => $connected ? theme.colors.success : theme.colors.danger};
    margin-right: ${({ theme }) => theme.spacing.xs};
  }
`;

const NavBlock = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const NavItem = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  color: ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.textSecondary};
  background-color: ${({ theme, $active }) => $active ? theme.colors.primary + '10' : 'transparent'};
  border-right: 4px solid ${({ theme, $active }) => $active ? theme.colors.primary : 'transparent'};
  font-weight: ${({ $active }) => $active ? 600 : 400};
  transition: all 0.2s ease;
  text-decoration: none;
  font-size: 1.08rem;
  margin-right: 0;

  &:hover {
    background-color: ${({ theme, $active }) => $active ? theme.colors.primary + '10' : theme.colors.background};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  background-color: transparent;
  border: none;
  width: 100%;
  text-align: left;
  font-size: 1.08rem;
  cursor: pointer;
  margin-top: auto;
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const NavIcon = styled.span`
  margin-right: ${({ theme }) => theme.spacing.sm};
  font-size: 1.2rem;
`;

const Sidebar: React.FC = () => {
  const location = useLocation();
  const isApiConnected = true;
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Главная', icon: '🏠' },
    { path: '/transactions', label: 'Транзакции', icon: '💳' },
    { path: '/upload', label: 'Загрузить PDF', icon: '📁' },
    { path: '/statistics', label: 'Статистика', icon: '📈' }
  ];

  return (
    <SidebarContainer>
      <LogoBlock>
        <Logo>💰 Money Tracker</Logo>
        <StatusIndicator $connected={isApiConnected}>
          {isApiConnected ? 'API подключен' : 'API отключен'}
        </StatusIndicator>
      </LogoBlock>
      <NavBlock>
        {navItems.map((item) => (
          <NavItem
            key={item.path}
            to={item.path}
            $active={location.pathname === item.path}
          >
            <NavIcon>{item.icon}</NavIcon>
            {item.label}
          </NavItem>
        ))}
      </NavBlock>
      <LogoutButton onClick={handleLogout}>
        <NavIcon>🚪</NavIcon>
        Выход
      </LogoutButton>
    </SidebarContainer>
  );
};

export default Sidebar; 