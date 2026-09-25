
from pydantic import BaseModel, Field


class RecommendationRequest(BaseModel):
    state: str = Field(..., min_length=2)
    season: str = Field(..., min_length=2)
    soil_type: str = Field(..., min_length=2)
    annual_rainfall: float = Field(..., ge=0)
    temperature: float = Field(...)
    irrigation: str = Field(..., min_length=2)


class RecommendedCrop(BaseModel):
    crop: str
    suitability_score: int
    reasons: list[str]


class RecommendationResponse(BaseModel):
    recommendations: list[RecommendedCrop]
    message: str
