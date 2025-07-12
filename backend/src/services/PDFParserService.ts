import pdf from 'pdf-parse';
import { TransactionService, Transaction } from './TransactionService';
import { DatabaseService } from './DatabaseService';
import { CategoryService } from './CategoryService';
import { v4 as uuidv4 } from 'uuid';

export interface ParsedTransaction {
  date: Date;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  bank?: string;
  account?: string;
  balance?: number;
  currency?: string;
}

export class PDFParserService {
  private transactionService: TransactionService;
  private db: DatabaseService;

  constructor() {
    this.transactionService = new TransactionService();
    this.db = new DatabaseService();
  }

  async parsePDF(fileBuffer: Buffer, fileName: string): Promise<ParsedTransaction[]> {
    const jobId = uuidv4();
    
    try {
      // Парсим PDF
      const data = await pdf(fileBuffer);
      const text = data.text;

      console.log('PDF Text Content:', text.substring(0, 1000)); // Для отладки

      // Извлекаем транзакции из текста
      const transactions = this.extractTransactions(text, fileName);

      console.log('Parsed transactions:', transactions);

      return transactions;
    } catch (error) {
      console.error('PDF parsing error:', error);
      throw error;
    }
  }

  private extractTransactions(text: string, fileName: string): ParsedTransaction[] {
    const transactions: ParsedTransaction[] = [];
    const lines = text.split('\n').filter(line => line.trim());
    const bank = this.detectBank(fileName);

    // Регулярка для строки транзакции
    const pattern = /(\d{2}\.\d{2}\.\d{2}(?: \d{2}:\d{2})?)(\d{2}\.\d{2}\.\d{2})([+−-]?\s*\d{1,3}(?: \d{3})*(?:[.,]\d{2})?\s*[i₽])([+−-]?\s*\d{1,3}(?: \d{3})*(?:[.,]\d{2})?\s*[i₽])(.*)/u;

    let lastTransaction: ParsedTransaction | null = null;

    for (const line of lines) {
      const match = line.match(pattern);
      if (match) {
        const dateStr = match[1].trim();
        const amountStr = match[3].replace(/[i₽]/, '').replace('−', '-').replace(/\s+/g, '');
        const desc = match[5].trim();
        let type: 'income' | 'expense' = amountStr.startsWith('+') ? 'income' : 'expense';
        let amount = parseFloat(amountStr.replace('+', '').replace('-', '').replace(',', '.'));
        const category = CategoryService.categorizeTransaction(desc);

        lastTransaction = {
          date: this.parseDateCustom(dateStr),
          description: desc,
          amount,
          type,
          category,
          bank
        };
        transactions.push(lastTransaction);
      } else if (lastTransaction) {
        // Если строка не транзакция, а продолжение описания — добавляем к предыдущей
        lastTransaction.description += ' ' + line.trim();
      }
    }
    return transactions;
  }

  private parseDateCustom(dateStr: string): Date {
    // dateStr: '17.05.25' или '19.05.25 17:32'
    const [datePart, timePart] = dateStr.split(' ');
    const [day, month, year] = datePart.split('.');
    let fullYear = parseInt(year, 10) + 2000;
    if (timePart) {
      const [hours, minutes] = timePart.split(':');
      return new Date(fullYear, parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes));
    } else {
      return new Date(fullYear, parseInt(month) - 1, parseInt(day));
    }
  }

  private parseAmountCustom(amountStr: string): number {
    // Пример: '7 765.00' или '3 600,00'
    return parseFloat(amountStr.replace(/ /g, '').replace(',', '.'));
  }

  private categorizeTransactionCustom(description: string): string {
    const desc = description.toLowerCase();
    if (desc.includes('оплата')) return 'Покупка';
    if (desc.includes('перевод')) return 'Перевод';
    if (desc.includes('пополнение')) return 'Пополнение';
    if (desc.includes('снятие')) return 'Снятие';
    if (desc.includes('зачисление')) return 'Зачисление';
    // Можно добавить ещё ключевых слов
    return 'Прочее';
  }

  private detectBank(fileName: string): string {
    const fileNameLower = fileName.toLowerCase();
    
    if (fileNameLower.includes('sberbank') || fileNameLower.includes('сбербанк')) {
      return 'Sberbank';
    } else if (fileNameLower.includes('tinkoff') || fileNameLower.includes('тинкофф')) {
      return 'Tinkoff';
    } else if (fileNameLower.includes('alfabank') || fileNameLower.includes('альфа')) {
      return 'Alfa Bank';
    } else if (fileNameLower.includes('vtb') || fileNameLower.includes('втб')) {
      return 'VTB';
    } else if (fileNameLower.includes('выписка')) {
      return 'Bank Statement';
    } else {
      return 'Unknown';
    }
  }



  async getParsingStatus(jobId: string): Promise<any> {
    const result = await this.db.query('SELECT * FROM parsing_jobs WHERE id = ?', [jobId]);
    return result[0] || null;
  }
} 