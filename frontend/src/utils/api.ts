const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface ShippingRate {
  carrier: string;
  service: string;
  price: number;
  transit: string;
  estimatedDays: number;
}

export interface RateRequest {
  collection_country: string;
  delivery_country: string;
  weight: number;
  collection_postcode?: string;
  delivery_postcode?: string;
}

export interface RateResponse {
  success: boolean;
  rates: ShippingRate[];
  route: string;
  weight: number;
  timestamp?: string;
  error?: string;
}

/**
 * Fetch shipping rates from backend
 */
export async function getShippingRates(request: RateRequest): Promise<RateResponse> {
  try {
    const response = await fetch(`${API_URL}/api/shipping-rates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching shipping rates:', error);
    return {
      success: false,
      rates: [],
      route: `${request.collection_country} → ${request.delivery_country}`,
      weight: request.weight,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check backend health
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/api/health`);
    const data = await response.json();
    return data.status === 'ok';
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
}

