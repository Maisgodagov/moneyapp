import React from 'react';
import styled from 'styled-components';

const MonthSelectorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const MonthButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background-color: #f3f4f6;
    color: #374151;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CurrentMonth = styled.div`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  background: #2563eb;
  color: #fff;
  border-radius: 6px;
  font-weight: 600;
  font-size: 16px;
  min-width: 120px;
  text-align: center;
`;

interface MonthSelectorProps {
  currentDate: Date;
  onMonthChange: (date: Date) => void;
}

const MonthSelector: React.FC<MonthSelectorProps> = ({ currentDate, onMonthChange }) => {
  const formatMonth = (date: Date): string => {
    return date.toLocaleDateString('ru-RU', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getPreviousMonth = (date: Date): Date => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() - 1);
    return newDate;
  };

  const getNextMonth = (date: Date): Date => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + 1);
    return newDate;
  };

  const handlePreviousMonth = () => {
    const prevMonth = getPreviousMonth(currentDate);
    onMonthChange(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = getNextMonth(currentDate);
    onMonthChange(nextMonth);
  };

  return (
    <MonthSelectorContainer>
      <MonthButton onClick={handlePreviousMonth}>
        ← {formatMonth(getPreviousMonth(currentDate))}
      </MonthButton>
      
      <CurrentMonth>
        {formatMonth(currentDate)}
      </CurrentMonth>
      
      <MonthButton onClick={handleNextMonth}>
        {formatMonth(getNextMonth(currentDate))} →
      </MonthButton>
    </MonthSelectorContainer>
  );
};

export default MonthSelector; 