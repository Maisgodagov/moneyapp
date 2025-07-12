import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Card } from '../styles/Layout';
import { uploadPDF, clearUploadState, saveStatement } from '../features/upload/uploadSlice';
import type { RootState, AppDispatch } from '../store';

const UploadContainer = styled.div`
  h1 {
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const UploadArea = styled.div<{ $isDragOver: boolean; $isUploading: boolean }>`
  border: 2px dashed ${({ theme, $isDragOver, $isUploading }) => 
    $isUploading ? theme.colors.primary : 
    $isDragOver ? theme.colors.secondary : theme.colors.border};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  background-color: ${({ theme, $isDragOver }) => 
    $isDragOver ? theme.colors.surface : theme.colors.background};
  transition: all 0.3s ease;
  cursor: ${({ $isUploading }) => $isUploading ? 'not-allowed' : 'pointer'};
  opacity: ${({ $isUploading }) => $isUploading ? 0.6 : 1};

  &:hover {
    border-color: ${({ theme, $isUploading }) => 
      $isUploading ? theme.colors.primary : theme.colors.secondary};
  }
`;

const FileInput = styled.input`
  display: none;
`;

const UploadText = styled.div`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const UploadSubtext = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: ${({ theme }) => theme.spacing.md};

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.border};
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.danger};
  background-color: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: 4px;
  margin-top: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.danger};
`;

const SuccessMessage = styled.div`
  color: ${({ theme }) => theme.colors.success};
  background-color: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: 4px;
  margin-top: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.success};
`;

const ResultsContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const TransactionItem = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: 4px;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
`;

const TransactionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const TransactionDate = styled.span`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
`;

const TransactionAmount = styled.span<{ type: 'income' | 'expense' }>`
  font-weight: bold;
  color: ${({ theme, type }) => 
    type === 'income' ? theme.colors.success : theme.colors.danger};
`;

const TransactionDescription = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const TransactionCategory = styled.span`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid ${({ theme }) => theme.colors.border};
  border-radius: 50%;
  border-top-color: ${({ theme }) => theme.colors.primary};
  animation: spin 1s ease-in-out infinite;
  margin-right: ${({ theme }) => theme.spacing.sm};

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const Upload: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { uploading, error, success, parsedTransactions, saving, saveSuccess, statementId } = useSelector(
    (state: RootState) => state.upload
  );
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const [filename, setFilename] = useState<string>('');

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragCounter(prev => prev + 1);
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragCounter(prev => prev - 1);
    if (dragCounter === 0) {
      setIsDragOver(false);
    }
  }, [dragCounter]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setDragCounter(0);

    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === 'application/pdf');
    
    if (pdfFile) {
      handleFileUpload(pdfFile);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      handleFileUpload(file);
    }
  }, []);

  const handleFileUpload = useCallback((file: File) => {
    setFilename(file.name);
    dispatch(clearUploadState());
    dispatch(uploadPDF(file));
  }, [dispatch]);

  const handleSaveStatement = useCallback(() => {
    if (!filename || !parsedTransactions.length) return;
    dispatch(saveStatement({ filename, transactions: parsedTransactions }));
  }, [dispatch, filename, parsedTransactions]);

  const handleClick = useCallback(() => {
    if (!uploading) {
      document.getElementById('file-input')?.click();
    }
  }, [uploading]);

  return (
    <UploadContainer>
      <h1>Загрузка PDF выписки</h1>
      
      <Card>
        <UploadArea
          $isDragOver={isDragOver}
          $isUploading={uploading}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <FileInput
            id="file-input"
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            disabled={uploading}
          />
          
          {uploading ? (
            <>
              <LoadingSpinner />
              <UploadText>Обработка PDF файла...</UploadText>
              <UploadSubtext>Пожалуйста, подождите</UploadSubtext>
            </>
          ) : (
            <>
              <UploadText>
                Перетащите PDF файл сюда или нажмите для выбора
              </UploadText>
              <UploadSubtext>
                Поддерживаются только PDF файлы с банковскими выписками
              </UploadSubtext>
              <Button disabled={uploading}>
                Выбрать файл
              </Button>
            </>
          )}
        </UploadArea>

        {error && (
          <ErrorMessage>
            Ошибка: {error}
          </ErrorMessage>
        )}

        {success && (
          <SuccessMessage>
            PDF успешно обработан! Найдено транзакций: {parsedTransactions.length}
          </SuccessMessage>
        )}

        {success && parsedTransactions.length > 0 && !saveSuccess && (
          <Button onClick={handleSaveStatement} disabled={saving}>
            {saving ? 'Сохраняем...' : 'Сохранить выписку'}
          </Button>
        )}
        {saveSuccess && statementId && (
          <SuccessMessage>
            Выписка успешно сохранена!<br />ID выписки: <b>{statementId}</b>
          </SuccessMessage>
        )}

        {parsedTransactions.length > 0 && (
          <ResultsContainer>
            <h3>Найденные транзакции:</h3>
            {parsedTransactions.map((transaction, index) => (
              <TransactionItem key={index}>
                <TransactionHeader>
                  <TransactionDate>
                    {new Date(transaction.date).toLocaleDateString('ru-RU')}
                  </TransactionDate>
                  <TransactionAmount type={transaction.type}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {transaction.amount.toLocaleString('ru-RU')} ₽
                  </TransactionAmount>
                </TransactionHeader>
                <TransactionDescription>
                  {transaction.description}
                </TransactionDescription>
                <TransactionCategory>
                  {transaction.category}
                </TransactionCategory>
              </TransactionItem>
            ))}
          </ResultsContainer>
        )}
      </Card>
    </UploadContainer>
  );
};

export default Upload; 