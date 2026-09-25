const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

export interface PredictionRequest {
  crop: string;
  season: string;
  state: string;
  crop_year: number;
  area: number;
  annual_rainfall: number;
  fertilizer: number;
  pesticide: number;
}

export interface PredictionResponse {
  predicted_yield: number;
  unit: string;
  message: string;
}

export async function predictYield(
  data: PredictionRequest,
): Promise<PredictionResponse> {
  const response = await fetch(`${API_BASE_URL}/api/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = "Unable to generate prediction.";

    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } catch {
      // Keep the default error message.
    }

    throw new Error(errorMessage);
  }

  return response.json();
}


/* -------------------------------------------------------------------------- */
/* Crop Recommendation                                                        */
/* -------------------------------------------------------------------------- */

export interface RecommendationRequest {
  state: string;
  season: string;
  soil_type: string;
  annual_rainfall: number;
  temperature: number;
  irrigation: string;
}

export interface RecommendedCrop {
  crop: string;
  suitability_score: number;
  reasons: string[];
}

export interface RecommendationResponse {
  recommendations: RecommendedCrop[];
  message: string;
}

export async function recommendCrops(
  data: RecommendationRequest,
): Promise<RecommendationResponse> {
  const response = await fetch(`${API_BASE_URL}/api/recommend`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = "Unable to generate crop recommendations.";

    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } catch {
      // Keep the default error message.
    }

    throw new Error(errorMessage);
  }

  return response.json();
}
export interface MarketPrice {
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  grade: string;
  arrival_date: string;
  min_price: number;
  max_price: number;
  modal_price: number;
}

export interface MarketResponse {
  records: MarketPrice[];
  total: number;
  message: string;
}

export interface MarketRequest {
  state: string;
  commodity: string;
  district?: string;
  market?: string;
}

export async function getMarketPrices(
  data: MarketRequest,
): Promise<MarketResponse> {
  const params = new URLSearchParams({
    state: data.state,
    commodity: data.commodity,
  });

  if (data.district?.trim()) {
    params.set("district", data.district.trim());
  }

  if (data.market?.trim()) {
    params.set("market", data.market.trim());
  }

  const response = await fetch(
    `${API_BASE_URL}/api/market?${params.toString()}`,
  );

  if (!response.ok) {
    let errorMessage = "Unable to retrieve market prices.";

    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } catch {
      // Keep the default error message.
    }

    throw new Error(errorMessage);
  }

  return response.json();
}
