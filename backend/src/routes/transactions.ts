import express from 'express';
import { TransactionController } from '../controllers/TransactionController';

const router = express.Router();
const transactionController = new TransactionController();

// GET /api/transactions - получить все транзакции
router.get('/', transactionController.getAllTransactions);

// GET /api/transactions/categories - получить все доступные категории
router.get('/categories', transactionController.getCategories);

// PUT /api/transactions/category - обновить категорию для транзакций с определенным описанием
router.put('/category', transactionController.updateTransactionCategory);

// POST /api/transactions/category-rule - добавить новое правило категоризации
router.post('/category-rule', transactionController.addCategoryRule);

// GET /api/transactions/descriptions - получить все уникальные описания
router.get('/descriptions', transactionController.getUniqueDescriptions);

// GET /api/transactions/stats/summary - получить статистику
router.get('/stats/summary', transactionController.getTransactionStats);

// POST /api/transactions/statements - создать выписку с транзакциями
router.post('/statements', transactionController.createStatementWithTransactions);

// GET /api/transactions/:id - получить транзакцию по ID
router.get('/:id', transactionController.getTransactionById);

// POST /api/transactions - создать новую транзакцию
router.post('/', transactionController.createTransaction);

// PUT /api/transactions/:id - обновить транзакцию
router.put('/:id', transactionController.updateTransaction);

// DELETE /api/transactions/:id - удалить транзакцию
router.delete('/:id', transactionController.deleteTransaction);

export default router; 