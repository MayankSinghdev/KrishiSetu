from pydantic import BaseModel, Field


class PredictionRequest(BaseModel):
    crop: str = Field(..., min_length=1)
    season: str = Field(..., min_length=1)
    state: str = Field(..., min_length=1)
    crop_year: int = Field(..., ge=1997, le=2100)
    area: float = Field(..., gt=0)
    annual_rainfall: float = Field(..., ge=0)
    fertilizer: float = Field(..., ge=0)
    pesticide: float = Field(..., ge=0)


class PredictionResponse(BaseModel):
    predicted_yield: float
    unit: str
    message: str