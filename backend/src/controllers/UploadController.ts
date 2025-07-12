import { Request, Response } from 'express';
import { PDFParserService } from '../services/PDFParserService';

export class UploadController {
  private pdfParserService: PDFParserService;

  constructor() {
    this.pdfParserService = new PDFParserService();
  }

  parsePDF = async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No PDF file uploaded' });
      }

      const fileBuffer = req.file.buffer;
      const fileName = req.file.originalname;

      console.log('Received file:', fileName, 'Size:', fileBuffer.length);

      // Парсим PDF и извлекаем транзакции
      const transactions = await this.pdfParserService.parsePDF(fileBuffer, fileName);

      console.log('Parsed transactions count:', transactions.length);

      res.json({
        message: 'PDF parsed successfully',
        transactionsCount: transactions.length,
        transactions: transactions
      });
    } catch (error) {
      console.error('PDF parsing error:', error);
      res.status(500).json({ 
        error: 'Failed to parse PDF file',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  getParsingStatus = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const status = await this.pdfParserService.getParsingStatus(id);
      
      if (!status) {
        return res.status(404).json({ error: 'Parsing job not found' });
      }

      res.json(status);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get parsing status' });
    }
  };
} 