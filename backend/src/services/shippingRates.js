/**
 * Mock shipping rate service
 * Generates realistic shipping rates without external API dependencies
 */

// Carrier configurations
const CARRIERS = {
  'DHL Express': {
    basePrice: 85,
    internationalMultiplier: 1.2,
    weightMultiplier: 0.5,
    transitDays: { domestic: 1, international: 3 }
  },
  'FedEx': {
    basePrice: 75,
    internationalMultiplier: 1.3,
    weightMultiplier: 0.6,
    transitDays: { domestic: 2, international: 4 }
  },
  'UPS': {
    basePrice: 80,
    internationalMultiplier: 1.25,
    weightMultiplier: 0.55,
    transitDays: { domestic: 2, international: 5 }
  },
  'Royal Mail': {
    basePrice: 12,
    internationalMultiplier: 1.5,
    weightMultiplier: 0.3,
    transitDays: { domestic: 1, international: 7 }
  },
  'DPD': {
    basePrice: 15,
    internationalMultiplier: 1.4,
    weightMultiplier: 0.4,
    transitDays: { domestic: 1, international: 5 }
  },
  'ParcelForce': {
    basePrice: 20,
    internationalMultiplier: 1.35,
    weightMultiplier: 0.45,
    transitDays: { domestic: 1, international: 6 }
  }
};

/**
 * Calculate shipping rates based on route and weight
 */
export function calculateShippingRates(collectionCountry, deliveryCountry, weight) {
  const isInternational = collectionCountry !== deliveryCountry;
  const rates = [];

  // Generate rates for each carrier
  Object.entries(CARRIERS).forEach(([carrierName, config]) => {
    let price = config.basePrice;

    // Adjust for international shipping
    if (isInternational) {
      price *= config.internationalMultiplier;
    }

    // Adjust for weight (per kg after first 5kg)
    if (weight > 5) {
      price += (weight - 5) * config.weightMultiplier;
    }

    // Add some randomness for realism (±10%)
    const variation = 0.9 + Math.random() * 0.2;
    price = Math.round(price * variation * 100) / 100;

    // Determine service type
    const serviceType = isInternational 
      ? 'International Express'
      : 'Domestic Express';

    // Determine transit time
    const transitDays = isInternational 
      ? config.transitDays.international 
      : config.transitDays.domestic;
    
    const transitTime = isInternational
      ? `${transitDays}-${transitDays + 2} business days`
      : `${transitDays} business day${transitDays > 1 ? 's' : ''}`;

    rates.push({
      carrier: carrierName,
      service: serviceType,
      price: price,
      transit: transitTime,
      estimatedDays: transitDays
    });
  });

  // Sort by price (lowest first)
  return rates.sort((a, b) => a.price - b.price);
}

/**
 * Get health check data
 */
export function getHealthStatus() {
  return {
    status: 'ok',
    service: 'Logistics Dashboard API',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    features: {
      rateCalculation: 'enabled',
      mockData: true
    }
  };
}

