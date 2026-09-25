
from fastapi import APIRouter, HTTPException

from backend.app.schemas.recommendation import (
    RecommendationRequest,
    RecommendationResponse,
)
from backend.app.services.recommendation_service import recommend_crops


router = APIRouter(
    prefix="/api",
    tags=["Crop Recommendation"],
)


@router.post(
    "/recommend",
    response_model=RecommendationResponse,
)
def recommend(request: RecommendationRequest):
    """Recommend suitable crops from farmer conditions."""

    try:
        recommendations = recommend_crops(
            state=request.state,
            season=request.season,
            soil_type=request.soil_type,
            annual_rainfall=request.annual_rainfall,
            temperature=request.temperature,
            irrigation=request.irrigation,
        )

        return RecommendationResponse(
            recommendations=recommendations,
            message=(
                "Recommendations generated using transparent "
                "agricultural suitability rules. "
                "They are intended for planning support and "
                "should not replace local agricultural advice."
            ),
        )

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Recommendation failed: {error}",
        ) from error
