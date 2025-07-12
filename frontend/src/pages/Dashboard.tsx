import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Card, Grid } from '../styles/Layout';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStats } from '../features/transactions/transactionsSlice';
import type { RootState, AppDispatch } from '../store';

const DashboardContainer = styled.div`
  h1 {
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const StatCard = styled(Card)`
  text-align: center;
  
  h3 {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }
  
  .amount {
    font-size: 2rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.text};
  }
  
  .positive {
    color: ${({ theme }) => theme.colors.success};
  }
  
  .negative {
    color: ${({ theme }) => theme.colors.danger};
  }
`;

const QuickActionCard = styled(Card)`
  text-align: center;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.secondary} 100%);
  color: white;
  
  h3 {
    color: white;
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
  
  p {
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
`;

const ActionButton = styled(Link)`
  display: inline-block;
  background-color: white;
  color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.9);
    transform: translateY(-2px);
  }
`;

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { stats, statsLoading } = useSelector((state: RootState) => state.transactions);

  useEffect(() => {
    dispatch(fetchStats());
  }, [dispatch]);

  return (
    <DashboardContainer>
      <h1>Добро пожаловать в Money Tracker! 💰</h1>
      
      <Grid>
        <StatCard>
          <h3>Общий доход</h3>
          <div className="amount positive">
            {statsLoading ? '...' : `₽${stats?.totalIncome?.toLocaleString('ru-RU') || '0'}`}
          </div>
        </StatCard>
        
        <StatCard>
          <h3>Общие расходы</h3>
          <div className="amount negative">
            {statsLoading ? '...' : `₽${stats?.totalExpense?.toLocaleString('ru-RU') || '0'}`}
          </div>
        </StatCard>
        
        <StatCard>
          <h3>Баланс</h3>
          <div className="amount positive">
            {statsLoading ? '...' : `₽${stats?.balance?.toLocaleString('ru-RU') || '0'}`}
          </div>
        </StatCard>
        
        <StatCard>
          <h3>Транзакции</h3>
          <div className="amount">
            {statsLoading ? '...' : stats?.transactionCount || 0}
          </div>
        </StatCard>
      </Grid>

      <QuickActionCard>
        <h3>📁 Загрузить банковскую выписку</h3>
        <p>
          Загрузите PDF файл с банковской выпиской, и мы автоматически извлечем все транзакции
        </p>
        <ActionButton to="/upload">
          Загрузить PDF
        </ActionButton>
      </QuickActionCard>
    </DashboardContainer>
  );
};

export default Dashboard; 