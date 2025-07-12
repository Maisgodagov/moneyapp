import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export class DatabaseService {
  private pool: mysql.Pool;

  constructor() {
    this.pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'money_tracker',
      port: parseInt(process.env.DB_PORT || '3306'),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }

  async query(sql: string, params: any[] = []): Promise<any> {
    try {
      const [rows] = await this.pool.execute(sql, params);
      return rows;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  async bulkInsert(sql: string, values: any[][]): Promise<any> {
    try {
      const [result] = await this.pool.query(sql, [values]);
      return result;
    } catch (error) {
      console.error('Bulk insert error:', error);
      throw error;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.pool.getConnection();
      console.log('Database connection successful');
      return true;
    } catch (error) {
      console.error('Database connection failed:', error);
      return false;
    }
  }

  async createTables(): Promise<void> {
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;

    const createStatementsTable = `
      CREATE TABLE IF NOT EXISTS statements (
        id VARCHAR(36) PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        user_id INT NOT NULL,
        upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        KEY idx_user_id (user_id),
        CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;

    const createTransactionsTable = `
      CREATE TABLE IF NOT EXISTS transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        statement_id VARCHAR(36),
        user_id INT NOT NULL,
        date DATE NOT NULL,
        description VARCHAR(500) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        type ENUM('income', 'expense') NOT NULL,
        category VARCHAR(100) NOT NULL,
        bank VARCHAR(100),
        account VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_date (date),
        INDEX idx_type (type),
        INDEX idx_category (category),
        INDEX idx_user_id_trans (user_id),
        CONSTRAINT fk_statement_id FOREIGN KEY (statement_id) REFERENCES statements(id) ON DELETE CASCADE,
        CONSTRAINT fk_user_id_trans FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;

    const createParsingJobsTable = `
      CREATE TABLE IF NOT EXISTS parsing_jobs (
        id VARCHAR(36) PRIMARY KEY,
        status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
        file_name VARCHAR(255) NOT NULL,
        user_id INT NOT NULL,
        transactions_count INT DEFAULT 0,
        error_message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP NULL,
        CONSTRAINT fk_user_id_jobs FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;

    try {
      await this.query(createUsersTable);
      await this.query(createStatementsTable);
      await this.query(createTransactionsTable);
      await this.query(createParsingJobsTable);
      console.log('Database tables created successfully');
    } catch (error) {
      console.error('Error creating tables:', error);
      throw error;
    }
  }

  async createStatement(id: string, filename: string, userId: number): Promise<void> {
    const query = 'INSERT INTO statements (id, filename, user_id) VALUES (?, ?, ?)';
    await this.query(query, [id, filename, userId]);
  }

  async getStatementById(id: string): Promise<any> {
    const query = 'SELECT * FROM statements WHERE id = ?';
    const rows = await this.query(query, [id]);
    return rows[0] || null;
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
} 