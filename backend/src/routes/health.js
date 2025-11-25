import express from 'express';
import { getHealthStatus } from '../services/shippingRates.js';

const router = express.Router();

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  const health = getHealthStatus();
  res.json(health);
});

export default router;

