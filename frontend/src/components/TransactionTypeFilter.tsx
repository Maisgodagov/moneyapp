import React from 'react';
import styled from 'styled-components';

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FilterLabel = styled.span`
  font-weight: 500;
  color: #374151;
  font-size: 14px;
`;

const FilterButton = styled.button<{ $active: boolean }>`
  background: ${props => props.$active ? '#2563eb' : 'transparent'};
  color: ${props => props.$active ? '#fff' : '#6b7280'};
  border: 1px solid ${props => props.$active ? '#2563eb' : '#d1d5db'};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$active ? '#1d4ed8' : '#f3f4f6'};
    border-color: ${props => props.$active ? '#1d4ed8' : '#9ca3af'};
  }
`;

type TransactionType = 'all' | 'income' | 'expense';

interface TransactionTypeFilterProps {
  selectedType: TransactionType;
  onTypeChange: (type: TransactionType) => void;
}

const TransactionTypeFilter: React.FC<TransactionTypeFilterProps> = ({ 
  selectedType, 
  onTypeChange 
}) => {
  return (
    <FilterContainer>
      <FilterLabel>Тип транзакций:</FilterLabel>
      
      <FilterButton 
        $active={selectedType === 'all'}
        onClick={() => onTypeChange('all')}
      >
        Все
      </FilterButton>
      
      <FilterButton 
        $active={selectedType === 'income'}
        onClick={() => onTypeChange('income')}
      >
        Доходы
      </FilterButton>
      
      <FilterButton 
        $active={selectedType === 'expense'}
        onClick={() => onTypeChange('expense')}
      >
        Расходы
      </FilterButton>
    </FilterContainer>
  );
};

export default TransactionTypeFilter;
export type { TransactionType }; 