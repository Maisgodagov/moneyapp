import React from 'react';
import styled from 'styled-components';

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const StatCard = styled.div`
  background: #fff;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const StatValue = styled.div<{ type?: 'income' | 'expense' | 'balance' }>`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
  color: ${props => {
    if (props.type === 'income') return '#10b981';
    if (props.type === 'expense') return '#ef4444';
    if (props.type === 'balance') return '#2563eb';
    return '#374151';
  }};
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
`;

interface TransactionStatsProps {
  transactions: Array<{
    amount: number;
    type: 'income' | 'expense';
  }>;
}

const TransactionStats: React.FC<TransactionStatsProps> = ({ transactions }) => {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const balance = totalIncome - totalExpense;
  const transactionCount = transactions.length;

  return (
    <StatsContainer>
      <StatCard>
        <StatValue type="income">
          +{totalIncome.toLocaleString('ru-RU')} ₽
        </StatValue>
        <StatLabel>Доходы</StatLabel>
      </StatCard>
      
      <StatCard>
        <StatValue type="expense">
          -{totalExpense.toLocaleString('ru-RU')} ₽
        </StatValue>
        <StatLabel>Расходы</StatLabel>
      </StatCard>
      
      <StatCard>
        <StatValue type="balance">
          {balance >= 0 ? '+' : ''}{balance.toLocaleString('ru-RU')} ₽
        </StatValue>
        <StatLabel>Баланс</StatLabel>
      </StatCard>
      
      <StatCard>
        <StatValue>
          {transactionCount}
        </StatValue>
        <StatLabel>Транзакций</StatLabel>
      </StatCard>
    </StatsContainer>
  );
};

export default TransactionStats; 