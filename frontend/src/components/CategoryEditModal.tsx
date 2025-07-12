import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../api';

interface CategoryEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: {
    id?: number;
    description: string;
    category: string;
    amount: number;
    type: string;
    date: string;
  } | null;
  onCategoryUpdate: (description: string, newCategory: string) => void;
}

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  padding: 24px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e0e0e0;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const TransactionInfo = styled.div`
  margin-bottom: 20px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 6px;
  border-left: 4px solid #007bff;
`;

const TransactionDescription = styled.div`
  font-weight: 500;
  margin-bottom: 8px;
  color: #333;
`;

const TransactionDetails = styled.div`
  display: flex;
  gap: 16px;
  font-size: 0.9rem;
  color: #666;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  background-color: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  ${props => props.variant === 'primary' ? `
    background-color: #007bff;
    color: white;

    &:hover {
      background-color: #0056b3;
    }

    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  ` : `
    background-color: #6c757d;
    color: white;

    &:hover {
      background-color: #545b62;
    }
  `}
`;

const AddCategorySection = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
`;

const AddCategoryTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 1.1rem;
  color: #333;
`;

const CategoryEditModal: React.FC<CategoryEditModalProps> = ({
  isOpen,
  onClose,
  transaction,
  onCategoryUpdate
}) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('');
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      if (transaction) {
        setSelectedCategory(transaction.category);
      }
    }
  }, [isOpen, transaction]);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/transactions/categories');
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setCategories([]);
    }
  };

  const handleSave = async () => {
    if (!transaction || !selectedCategory) return;

    setIsLoading(true);
    try {
      await api.put('/transactions/category', {
        description: transaction.description,
        newCategory: selectedCategory
      });
      onCategoryUpdate(transaction.description, selectedCategory);
      onClose();
    } catch (error: unknown) {
      console.error('Failed to update category:', error instanceof Error ? error.message : error);
      alert('Failed to update category');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNewCategory = async () => {
    if (!newCategory.trim()) return;

    setIsLoading(true);
    try {
      await api.post('/transactions/category-rule', {
        keywords: [transaction?.description || ''],
        category: newCategory,
        priority: 200
      });
      await fetchCategories();
      setSelectedCategory(newCategory);
      setNewCategory('');
      setIsAddingNewCategory(false);
    } catch (error: unknown) {
      console.error('Failed to add new category:', error instanceof Error ? error.message : error);
      alert('Failed to add new category');
    } finally {
      setIsLoading(false);
    }
  };

  if (!transaction) return null;

  return (
    <ModalOverlay $isOpen={isOpen}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Редактировать категорию</ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>

        <TransactionInfo>
          <TransactionDescription>
            {transaction.description}
          </TransactionDescription>
          <TransactionDetails>
            <span>Сумма: {transaction.amount} ₽</span>
            <span>Тип: {transaction.type === 'expense' ? 'Расход' : 'Доход'}</span>
            <span>Дата: {new Date(transaction.date).toLocaleDateString()}</span>
          </TransactionDetails>
        </TransactionInfo>

        <FormGroup>
          <Label>Выберите категорию:</Label>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Выберите категорию...</option>
            {categories?.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
        </FormGroup>

        <AddCategorySection>
          <AddCategoryTitle>Добавить новую категорию</AddCategoryTitle>
          {!isAddingNewCategory ? (
            <Button
              variant="secondary"
              onClick={() => setIsAddingNewCategory(true)}
            >
              + Добавить категорию
            </Button>
          ) : (
            <div>
              <FormGroup>
                <Label>Название новой категории:</Label>
                <Input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Введите название категории"
                />
              </FormGroup>
              <ButtonGroup>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setIsAddingNewCategory(false);
                    setNewCategory('');
                  }}
                >
                  Отмена
                </Button>
                <Button
                  variant="primary"
                  onClick={handleAddNewCategory}
                  disabled={!newCategory.trim() || isLoading}
                >
                  {isLoading ? 'Добавление...' : 'Добавить'}
                </Button>
              </ButtonGroup>
            </div>
          )}
        </AddCategorySection>

        <ButtonGroup>
          <Button variant="secondary" onClick={onClose}>
            Отмена
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!selectedCategory || isLoading}
          >
            {isLoading ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
};

export default CategoryEditModal; 