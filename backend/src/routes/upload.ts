import express from 'express';
import multer from 'multer';
import { UploadController } from '../controllers/UploadController';

const router = express.Router();
const uploadController = new UploadController();

// Настройка multer для загрузки файлов
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// POST /api/upload/parse - загрузить и распарсить PDF
router.post('/parse', upload.single('pdf'), uploadController.parsePDF);

// GET /api/upload/status/:id - получить статус парсинга
router.get('/status/:id', uploadController.getParsingStatus);

export default router; 