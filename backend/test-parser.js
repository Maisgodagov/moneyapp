const fs = require('fs');
const path = require('path');
const { PDFParserService } = require('./src/services/PDFParserService');

async function testParser() {
  try {
    const pdfPath = path.join(__dirname, '../frontend/public/Выписка.pdf');
    
    if (!fs.existsSync(pdfPath)) {
      console.error('PDF файл не найден:', pdfPath);
      return;
    }

    console.log('Начинаем парсинг PDF файла...');
    
    const fileBuffer = fs.readFileSync(pdfPath);
    const parser = new PDFParserService();
    
    const transactions = await parser.parsePDF(fileBuffer, 'Выписка.pdf');
    
    console.log('\nРезультаты парсинга:');
    console.log('Найдено транзакций:', transactions.length);
    
    if (transactions.length > 0) {
      console.log('\nПервые 5 транзакций:');
      transactions.slice(0, 5).forEach((transaction, index) => {
        console.log(`${index + 1}. ${transaction.date.toLocaleDateString('ru-RU')} - ${transaction.description} - ${transaction.amount} ₽ (${transaction.type})`);
      });
    } else {
      console.log('Транзакции не найдены. Возможно, формат PDF не поддерживается.');
    }
    
  } catch (error) {
    console.error('Ошибка при парсинге:', error);
  }
}

testParser(); 