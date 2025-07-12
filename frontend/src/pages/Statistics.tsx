import React from 'react';
import styled from 'styled-components';
import { Card } from '../styles/Layout';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStats } from '../features/transactions/transactionsSlice';
import type { RootState, AppDispatch } from '../store';

const StatisticsContainer = styled.div`
  h1 {
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const Statistics: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { stats, statsLoading, statsError } = useSelector((state: RootState) => state.transactions);

  useEffect(() => {
    dispatch(fetchStats({}));
  }, [dispatch]);

  const formatCurrency = (value: number) => {
    return (value || 0).toLocaleString('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 2,
    });
  };

  return (
    <StatisticsContainer>
      <h1>Статистика</h1>
      <Card>
        {statsLoading ? (
          <div>Загрузка...</div>
        ) : statsError ? (
          <div style={{ color: 'red' }}>Ошибка: {statsError}</div>
        ) : stats ? (
          <div>
            <div style={{ marginBottom: 16 }}>
              <b>Доходы:</b> <span style={{ color: '#10b981' }}>{formatCurrency(stats.totalIncome)}</span><br />
              <b>Расходы:</b> <span style={{ color: '#ef4444' }}>{formatCurrency(stats.totalExpense)}</span><br />
              <b>Баланс:</b> <span style={{ color: stats.balance >= 0 ? '#10b981' : '#ef4444' }}>{formatCurrency(stats.balance)}</span><br />
              <b>Всего транзакций:</b> {stats.transactionCount}<br/>
              <b>Транзакций за период:</b> {stats.periodTransactionCount}
            </div>
            {stats.topCategories && stats.topCategories.length > 0 ? (
              <div>
                <b>Топ категорий расходов:</b>
                <ul>
                  {stats.topCategories.map((cat, idx) => (
                    <li key={idx}>{cat.category}: {formatCurrency(cat.amount)}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div>Нет данных по категориям расходов.</div>
            )}
          </div>
        ) : (
          <div>Нет данных для отображения.</div>
        )}
      </Card>
    </StatisticsContainer>
  );
};

export default Statistics; 