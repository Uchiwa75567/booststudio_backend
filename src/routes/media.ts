import express from 'express';
import { getAllMedia } from '../controllers/mediaController';

const router = express.Router();

// Public route to get visible media
router.get('/', getAllMedia);

export default router;