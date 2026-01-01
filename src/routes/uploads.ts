import express from 'express';
import multer from 'multer';
import { uploadImage, uploadVideo } from '../controllers/mediaController';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/image', upload.single('file'), uploadImage);
router.post('/video', upload.single('file'), uploadVideo);

export default router;