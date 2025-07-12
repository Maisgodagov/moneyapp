import React, { useState } from 'react';
import styled from 'styled-components';
import { Card } from '../styles/Layout';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions } from '../features/transactions/transactionsSlice';
import type { RootState, AppDispatch } from '../store';
import CategoryEditModal from '../components/CategoryEditModal';
import MonthSelector from '../components/MonthSelector';
import TransactionTypeFilter from '../components/TransactionTypeFilter';
import type { TransactionType } from '../components/TransactionTypeFilter';
import CategoryFilter from '../components/CategoryFilter';
import ResetFilters from '../components/ResetFilters';

const TransactionsContainer = styled.div`
  h1 {
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const FiltersRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.textSecondary};
  
  h3 {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.text};
  }
  
  p {
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
`;

const TransactionItem = styled.div<{ type: 'income' | 'expense' }>`
  background: #fff;
  border-radius: 8px;
  margin-bottom: 12px;
  padding: 16px;
  border-left: 4px solid ${props => props.type === 'income' ? '#10b981' : '#ef4444'};
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const TransactionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

const TransactionDate = styled.span`
  font-weight: 600;
  color: #333;
`;

const TransactionAmount = styled.span<{ type: 'income' | 'expense' }>`
  font-weight: 700;
  color: ${props => props.type === 'income' ? '#10b981' : '#ef4444'};
`;

const TransactionDescription = styled.div`
  color: #64748b;
  margin-bottom: 8px;
  line-height: 1.4;
`;

const TransactionFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CategoryBadge = styled.span`
  background: #2563eb;
  color: #fff;
  border-radius: 12px;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 500;
`;

const EditButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
  font-size: 14px;

  &:hover {
    background-color: #f3f4f6;
    color: #374151;
  }
`;

const Transactions: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { transactions, loading, error } = useSelector((state: RootState) => state.transactions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<{
    id?: number;
    description: string;
    category: string;
    amount: number;
    type: string;
    date: string;
  } | null>(null);
  
  // Состояние для текущего выбранного месяца
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  
  // Состояние для фильтра по типу транзакций
  const [selectedType, setSelectedType] = useState<TransactionType>('all');
  
  // Состояние для фильтра по категории
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Функция для получения первого и последнего дня месяца
  const getMonthRange = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Форматируем даты в формат DD.MM.YYYY
    const formatDate = (date: Date) => {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    };
    
    return {
      dateFrom: formatDate(firstDay),
      dateTo: formatDate(lastDay)
    };
  };

  // Функция для загрузки транзакций с фильтрами
  const loadTransactionsWithFilters = (date: Date, type: TransactionType, category: string) => {
    const { dateFrom, dateTo } = getMonthRange(date);
    const params: {
      limit: number;
      dateFrom: string;
      dateTo: string;
      type?: string;
      category?: string;
    } = { 
      limit: 1000,
      dateFrom,
      dateTo
    };
    
    // Добавляем фильтр по типу только если выбран не "все"
    if (type !== 'all') {
      params.type = type;
    }
    
    // Добавляем фильтр по категории только если выбрана
    if (category) {
      params.category = category;
    }
    
    dispatch(fetchTransactions(params));
  };

  useEffect(() => {
    loadTransactionsWithFilters(selectedMonth, selectedType, selectedCategory);
  }, [selectedMonth, selectedType, selectedCategory]);

  const handleMonthChange = (date: Date) => {
    setSelectedMonth(date);
  };

  const handleTypeChange = (type: TransactionType) => {
    setSelectedType(type);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleResetFilters = () => {
    setSelectedMonth(new Date());
    setSelectedType('all');
    setSelectedCategory('');
  };

  const handleEditCategory = (transaction: {
    id?: number;
    description: string;
    category: string;
    amount: number;
    type: string;
    date: string;
  }) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleCategoryUpdate = () => {
    // Перезагружаем транзакции для получения актуальных данных
    loadTransactionsWithFilters(selectedMonth, selectedType, selectedCategory);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  // Проверяем, есть ли активные фильтры
  const hasActiveFilters = selectedType !== 'all' || selectedCategory !== '';

  return (
    <TransactionsContainer>
      <h1>Транзакции</h1>
      
      <FiltersContainer>
        <MonthSelector 
          currentDate={selectedMonth}
          onMonthChange={handleMonthChange}
        />
        
        <FiltersRow>
          <TransactionTypeFilter 
            selectedType={selectedType}
            onTypeChange={handleTypeChange}
          />
          
          <CategoryFilter 
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            transactions={transactions}
          />
          
          <ResetFilters 
            onReset={handleResetFilters}
            disabled={!hasActiveFilters}
          />
        </FiltersRow>
      </FiltersContainer>
      
      <Card>
        {loading ? (
          <div>Загрузка...</div>
        ) : error ? (
          <div style={{ color: 'red' }}>Ошибка: {error}</div>
        ) : transactions.length === 0 ? (
          <EmptyState>
            <h3>📊 Нет транзакций за выбранный период</h3>
            <p>
              В выбранном месяце и с выбранными фильтрами не найдено транзакций. 
              Попробуйте изменить фильтры или выбрать другой месяц.
            </p>
          </EmptyState>
        ) : (
          <div>
            {transactions.map((t, idx) => (
              <TransactionItem key={t.id || idx} type={t.type}>
                <TransactionHeader>
                  <TransactionDate>
                    {new Date(t.date).toLocaleDateString('ru-RU')}
                  </TransactionDate>
                  <TransactionAmount type={t.type}>
                    {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString('ru-RU')} ₽
                  </TransactionAmount>
                </TransactionHeader>
                <TransactionDescription>{t.description}</TransactionDescription>
                <TransactionFooter>
                  {t.category && (
                    <CategoryBadge>
                      {t.category}
                    </CategoryBadge>
                  )}
                  <EditButton
                    onClick={() => handleEditCategory(t)}
                    title="Редактировать категорию"
                  >
                    ✏️
                  </EditButton>
                </TransactionFooter>
              </TransactionItem>
            ))}
          </div>
        )}
      </Card>

      <CategoryEditModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        transaction={selectedTransaction}
        onCategoryUpdate={handleCategoryUpdate}
      />
    </TransactionsContainer>
  );
};

export default Transactions; 