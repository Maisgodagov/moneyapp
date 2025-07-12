import React from 'react';
import styled from 'styled-components';

const ResetButton = styled.button`
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #f59e0b;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: #fde68a;
    color: #78350f;
    border-color: #d97706;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

interface ResetFiltersProps {
  onReset: () => void;
  disabled?: boolean;
}

const ResetFilters: React.FC<ResetFiltersProps> = ({ onReset, disabled = false }) => {
  return (
    <ResetButton onClick={onReset} disabled={disabled}>
      🔄 Сбросить фильтры
    </ResetButton>
  );
};

export default ResetFilters; 