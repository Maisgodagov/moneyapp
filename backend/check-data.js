const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkData() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'money_tracker',
    port: parseInt(process.env.DB_PORT || '3306'),
  });

  try {
    // Проверяем общее количество транзакций
    const [totalRows] = await pool.execute('SELECT COUNT(*) as total FROM transactions');
    console.log('Общее количество транзакций:', totalRows[0].total);

    // Проверяем транзакции по типам
    const [typeRows] = await pool.execute(`
      SELECT type, COUNT(*) as count, SUM(amount) as total_amount 
      FROM transactions 
      GROUP BY type
    `);
    console.log('Транзакции по типам:', typeRows);

    // Проверяем диапазон дат
    const [dateRows] = await pool.execute(`
      SELECT MIN(date) as min_date, MAX(date) as max_date 
      FROM transactions 
      WHERE date IS NOT NULL
    `);
    console.log('Диапазон дат:', dateRows[0]);

    // Проверяем транзакции за последний месяц
    const [monthRows] = await pool.execute(`
      SELECT COUNT(*) as count, SUM(amount) as total_amount 
      FROM transactions 
      WHERE date >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
    `);
    console.log('Транзакции за последний месяц:', monthRows[0]);

    // Проверяем несколько последних транзакций
    const [recentRows] = await pool.execute(`
      SELECT id, date, description, amount, type, category 
      FROM transactions 
      ORDER BY date DESC 
      LIMIT 5
    `);
    console.log('Последние 5 транзакций:', recentRows);

  } catch (error) {
    console.error('Ошибка при проверке данных:', error);
  } finally {
    await pool.end();
  }
}

checkData(); 