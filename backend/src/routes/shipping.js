import express from 'express';
import { calculateShippingRates } from '../services/shippingRates.js';

const router = express.Router();

/**
 * POST /api/shipping-rates
 * Calculate shipping rates for a given route
 */
router.post('/shipping-rates', async (req, res) => {
  try {
    const { 
      collection_country, 
      delivery_country, 
      weight,
      collection_postcode,
      delivery_postcode
    } = req.body;

    // Validation
    if (!collection_country || !delivery_country) {
      return res.status(400).json({
        success: false,
        error: 'Collection and delivery countries are required'
      });
    }

    const weightValue = parseFloat(weight) || 1;
    
    if (weightValue <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Weight must be greater than 0'
      });
    }

    console.log('Rate request:', {
      from: `${collection_country} (${collection_postcode || 'N/A'})`,
      to: `${delivery_country} (${delivery_postcode || 'N/A'})`,
      weight: `${weightValue}kg`
    });

    // Calculate rates
    const rates = calculateShippingRates(
      collection_country,
      delivery_country,
      weightValue
    );

    res.json({
      success: true,
      rates: rates,
      route: `${collection_country} → ${delivery_country}`,
      weight: weightValue,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error calculating rates:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to calculate shipping rates',
      message: error.message
    });
  }
});

export default router;

