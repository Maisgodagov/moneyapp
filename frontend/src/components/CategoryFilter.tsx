import React, { useState, useEffect } from 'react';
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
  white-space: nowrap;
`;

const CategorySelect = styled.select`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: #fff;
  color: #374151;
  cursor: pointer;
  min-width: 200px;
  transition: border-color 0.2s;

  &:hover {
    border-color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`;

const ClearButton = styled.button`
  background: #f3f4f6;
  color: #6b7280;
  border: 1px solid #d1d5db;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #e5e7eb;
    color: #374151;
    border-color: #9ca3af;
  }
`;

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  transactions: Array<{ category: string }>;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  selectedCategory, 
  onCategoryChange,
  transactions 
}) => {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    // Извлекаем уникальные категории из транзакций
    const uniqueCategories = Array.from(
      new Set(
        transactions
          .map(t => t.category)
          .filter(category => category && category.trim() !== '')
      )
    ).sort();
    
    setCategories(uniqueCategories);
  }, [transactions]);

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onCategoryChange(event.target.value);
  };

  const handleClearFilter = () => {
    onCategoryChange('');
  };

  return (
    <FilterContainer>
      <FilterLabel>Категория:</FilterLabel>
      
      <CategorySelect 
        value={selectedCategory} 
        onChange={handleCategoryChange}
      >
        <option value="">Все категории</option>
        {categories.map(category => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </CategorySelect>
      
      {selectedCategory && (
        <ClearButton onClick={handleClearFilter}>
          Очистить
        </ClearButton>
      )}
    </FilterContainer>
  );
};

export default CategoryFilter; 