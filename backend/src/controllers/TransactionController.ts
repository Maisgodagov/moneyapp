/// <reference path="../types/express.d.ts" />
import { Request, Response } from 'express';
import { TransactionService } from '../services/TransactionService';
import { CategoryService } from '../services/CategoryService';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService } from '../services/DatabaseService';
import { Statement } from '../models/Statement';

export class TransactionController {
  private transactionService: TransactionService;

  constructor() {
    this.transactionService = new TransactionService();
  }

  getAllTransactions = async (req: Request, res: Response) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Not authorized' });
      }
      const userId = req.user.id;

      let page = Number(req.query.page);
      let limit = Number(req.query.limit);

      if (!Number.isFinite(page) || page < 1) page = 1;
      if (!Number.isFinite(limit) || limit < 1) limit = 1000;

      const { category, type, dateFrom, dateTo } = req.query;

      const result = await this.transactionService.getAllTransactions(userId, {
        page,
        limit,
        category: category as string,
        type: type as string,
        dateFrom: dateFrom as string,
        dateTo: dateTo as string
      });

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch transactions', details: error instanceof Error ? error.message : error });
    }
  };

  getTransactionById = async (req: Request, res: Response) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Not authorized' });
      }
      const userId = req.user.id;
      const { id } = req.params;
      const transaction = await this.transactionService.getTransactionById(userId, Number(id));
      
      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      res.json(transaction);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch transaction' });
    }
  };

  createTransaction = async (req: Request, res: Response) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Not authorized' });
      }
      const userId = req.user.id;
      const transaction = await this.transactionService.createTransaction(userId, req.body);
      res.status(201).json(transaction);
    } catch (error) {
      res.status(400).json({ error: 'Failed to create transaction' });
    }
  };

  updateTransaction = async (req: Request, res: Response) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Not authorized' });
      }
      const userId = req.user.id;
      const { id } = req.params;
      const transaction = await this.transactionService.updateTransaction(userId, Number(id), req.body);
      
      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      res.json(transaction);
    } catch (error) {
      res.status(400).json({ error: 'Failed to update transaction' });
    }
  };

  deleteTransaction = async (req: Request, res: Response) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Not authorized' });
      }
      const userId = req.user.id;
      const { id } = req.params;
      const success = await this.transactionService.deleteTransaction(userId, Number(id));
      
      if (!success) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      res.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete transaction' });
    }
  };

  getTransactionStats = async (req: Request, res: Response) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Not authorized' });
      }
      const userId = req.user.id;
      const { dateFrom, dateTo } = req.query;
      const stats = await this.transactionService.getTransactionStats(userId, { 
        dateFrom: dateFrom as string, 
        dateTo: dateTo as string 
      });
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch transaction statistics' });
    }
  };

  getCategories = async (req: Request, res: Response) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Not authorized' });
      }
      // TODO: Make CategoryService user-aware
      const categories = CategoryService.getAllCategories();
      res.json({ categories });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  };

  updateTransactionCategory = async (req: Request, res: Response) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Not authorized' });
      }
      const userId = req.user.id;

      const { description, newCategory } = req.body;
      
      if (!description || !newCategory) {
        return res.status(400).json({ error: 'description and newCategory are required' });
      }

      // TODO: Make CategoryService user-aware
      // Обновляем правило категоризации
      CategoryService.updateCategoryForDescription(description, newCategory);
      
      // Обновляем все транзакции с таким описанием в базе данных
      const db = new DatabaseService();
      const updatedCount = await CategoryService.updateCategoriesForDescription(db, description, newCategory, userId);
      
      res.json({ 
        message: 'Category updated successfully', 
        updatedCount,
        description,
        newCategory 
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update category', details: error instanceof Error ? error.message : error });
    }
  };

  addCategoryRule = async (req: Request, res: Response) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Not authorized' });
      }
      // TODO: Make CategoryService user-aware
      const { keywords, category, priority = 50 } = req.body;
      
      if (!keywords || !Array.isArray(keywords) || !category) {
        return res.status(400).json({ error: 'keywords (array) and category are required' });
      }

      CategoryService.addCategoryRule(keywords, category, priority);
      
      res.json({ 
        message: 'Category rule added successfully',
        keywords,
        category,
        priority
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to add category rule', details: error instanceof Error ? error.message : error });
    }
  };

  getUniqueDescriptions = async (req: Request, res: Response) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Not authorized' });
      }
      const userId = req.user.id;
      const db = new DatabaseService();
      // TODO: Make CategoryService user-aware
      const descriptions = await CategoryService.getUniqueDescriptions(db, userId);
      res.json({ descriptions });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch unique descriptions', details: error instanceof Error ? error.message : error });
    }
  };

  createStatementWithTransactions = async (req: Request, res: Response) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Not authorized' });
      }
      const userId = req.user.id;

      const { filename, transactions } = req.body;
      if (!filename || !Array.isArray(transactions) || !transactions.length) {
        return res.status(400).json({ error: 'filename and transactions are required' });
      }
      const statementId = uuidv4();
      const db = new DatabaseService();
      await db.createStatement(statementId, filename, userId);
      const service = new TransactionService();
      await service.createTransactionsBulk(userId, transactions, statementId);
      res.status(201).json({ statementId });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save statement and transactions', details: error instanceof Error ? error.message : error });
    }
  };
} 