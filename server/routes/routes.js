import express from 'express';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'RecipeBook API is running' });
});

export default router; 