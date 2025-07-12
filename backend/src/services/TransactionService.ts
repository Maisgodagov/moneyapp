import { DatabaseService } from './DatabaseService';

export interface Transaction {
  id?: number;
  statementId?: string | null;
  userId: number;
  date: Date;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  bank?: string | null;
  account?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface TransactionFilters {
  page?: number;
  limit?: number;
  category?: string;
  type?: string;
  dateFrom?: string | null;
  dateTo?: string | null;
}

export interface TransactionStats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
  periodTransactionCount: number;
  topCategories: Array<{ category: string; amount: number }>;
}

export class TransactionService {
  private db: DatabaseService;

  constructor() {
    this.db = new DatabaseService();
  }

  private convertDateFormat(dateString: string): string | null {
    if (!dateString) return null;
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateString;
    }
    const parts = dateString.split('.');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    // If the format is not recognized, return null to skip the filter
    return null;
  }

  async getAllTransactions(userId: number, filters: TransactionFilters = {}): Promise<{ transactions: Transaction[]; total: number }> {
    const { page = 1, limit = 20, category, type, dateFrom, dateTo } = filters;
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 20;
    const offset = (pageNum - 1) * limitNum;

    let query = 'SELECT * FROM transactions WHERE user_id = ?';
    const params: any[] = [userId];

    let countQuery = 'SELECT COUNT(*) as total FROM transactions WHERE user_id = ?';
    const countParams: any[] = [userId];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
      countQuery += ' AND category = ?';
      countParams.push(category);
    }

    if (type) {
      query += ' AND type = ?';
      params.push(type);
      countQuery += ' AND type = ?';
      countParams.push(type);
    }

    if (dateFrom && dateFrom.trim() !== '') {
      const convertedDate = this.convertDateFormat(dateFrom);
      if (convertedDate) {
        query += ' AND date >= ?';
        params.push(convertedDate);
        countQuery += ' AND date >= ?';
        countParams.push(convertedDate);
      } else {
        console.warn('Invalid dateFrom format:', dateFrom);
      }
    }

    if (dateTo && dateTo.trim() !== '') {
      const convertedDate = this.convertDateFormat(dateTo);
      if (convertedDate) {
        query += ' AND date <= ?';
        params.push(convertedDate);
        countQuery += ' AND date <= ?';
        countParams.push(convertedDate);
      } else {
        console.warn('Invalid dateTo format:', dateTo);
      }
    }

    query += ` ORDER BY date DESC LIMIT ${Number(limitNum)} OFFSET ${Number(offset)}`;

    // Логирование для отладки
    console.log('SQL QUERY:', query);
    console.log('PARAMS:', params);
    console.log('COUNT QUERY:', countQuery);
    console.log('COUNT PARAMS:', countParams);

    const [transactions, totalResult] = await Promise.all([
      this.db.query(query, params),
      this.db.query(countQuery, countParams)
    ]);
    
    const total = totalResult[0]?.total || 0;

    return { transactions, total };
  }

  async getTransactionById(userId: number, id: number): Promise<Transaction | null> {
    const result = await this.db.query('SELECT * FROM transactions WHERE id = ? AND user_id = ?', [id, userId]);
    return result[0] || null;
  }

  async createTransaction(userId: number, transaction: Omit<Transaction, 'id' | 'userId' | 'created_at' | 'updated_at'>): Promise<Transaction> {
    const query = `
      INSERT INTO transactions (user_id, statement_id, date, description, amount, type, category, bank, account)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      userId,
      transaction.statementId || null,
      transaction.date,
      transaction.description,
      transaction.amount,
      transaction.type,
      transaction.category,
      transaction.bank || null,
      transaction.account || null,
    ];
    const result = await this.db.query(query, params);
    return (await this.getTransactionById(userId, result.insertId))!;
  }

  async updateTransaction(userId: number, id: number, updates: Partial<Omit<Transaction, 'id' | 'userId'>>): Promise<Transaction | null> {
    const existing = await this.getTransactionById(userId, id);
    if (!existing) {
      return null;
    }

    const merged = { ...existing, ...updates };

    const query = `
      UPDATE transactions
      SET date = ?, description = ?, amount = ?, type = ?, category = ?, bank = ?, account = ?, statement_id = ?
      WHERE id = ? AND user_id = ?
    `;
    const params = [
      merged.date,
      merged.description,
      merged.amount,
      merged.type,
      merged.category,
      merged.bank || null,
      merged.account || null,
      merged.statementId || null,
      id,
      userId,
    ];

    await this.db.query(query, params);
    return this.getTransactionById(userId, id);
  }

  async deleteTransaction(userId: number, id: number): Promise<boolean> {
    const result = await this.db.query('DELETE FROM transactions WHERE id = ? AND user_id = ?', [id, userId]);
    return result.affectedRows > 0;
  }

  async getTransactionStats(userId: number, filters: { dateFrom?: string, dateTo?: string } = {}): Promise<TransactionStats> {
    let dateFilter = '';
    const params: any[] = [userId];

    if (filters.dateFrom) {
      const convertedDate = this.convertDateFormat(filters.dateFrom);
      if (convertedDate) {
        dateFilter += ' AND date >= ?';
        params.push(convertedDate);
      }
    }
    if (filters.dateTo) {
      const convertedDate = this.convertDateFormat(filters.dateTo);
      if (convertedDate) {
        dateFilter += ' AND date <= ?';
        params.push(convertedDate);
      }
    }

    const totalCountQuery = 'SELECT COUNT(*) as total FROM transactions WHERE user_id = ?';
    const totalCountResult = await this.db.query(totalCountQuery, [userId]);
    const transactionCount = totalCountResult[0]?.total || 0;

    const statsQuery = `
      SELECT
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as totalIncome,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as totalExpense,
        COUNT(*) as periodTransactionCount
      FROM transactions
      WHERE user_id = ? ${dateFilter}
    `;
    const statsResult = await this.db.query(statsQuery, params);
    const { totalIncome = 0, totalExpense = 0, periodTransactionCount = 0 } = statsResult[0] || {};

    const categoryQuery = `
      SELECT category, SUM(amount) as amount
      FROM transactions
      WHERE type = 'expense' AND user_id = ? ${dateFilter}
      GROUP BY category
      ORDER BY amount DESC
      LIMIT 10
    `;
    const topCategories = await this.db.query(categoryQuery, params);

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      transactionCount,
      periodTransactionCount,
      topCategories,
    };
  }

  async createTransactionsBulk(userId: number, transactions: Omit<Transaction, 'id' | 'userId' | 'created_at' | 'updated_at'>[], statementId: string): Promise<void> {
    if (transactions.length === 0) {
      return;
    }
    const query = `
      INSERT INTO transactions (user_id, statement_id, date, description, amount, type, category, bank, account)
      VALUES ?
    `;
    const values = transactions.map(t => [
      userId,
      statementId,
      t.date,
      t.description,
      t.amount,
      t.type,
      t.category,
      t.bank || null,
      t.account || null,
    ]);
    await this.db.bulkInsert(query, values);
  }

  async updateTransactionCategory(userId: number, transactionId: number, newCategory: string): Promise<Transaction | null> {
    await this.db.query('UPDATE transactions SET category = ? WHERE id = ? AND user_id = ?', [newCategory, transactionId, userId]);
    return this.getTransactionById(userId, transactionId);
  }

  async getUniqueCategories(userId: number): Promise<string[]> {
    const result = await this.db.query('SELECT DISTINCT category FROM transactions WHERE user_id = ? ORDER BY category', [userId]);
    return result.map((row: any) => row.category);
  }
} 