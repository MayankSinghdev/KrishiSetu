
from fastapi import APIRouter, HTTPException

from backend.app.schemas.prediction import (
    PredictionRequest,
    PredictionResponse,
)
from backend.app.services.prediction_service import predict_yield


router = APIRouter(
    prefix="/api",
    tags=["Prediction"],
)


@router.post(
    "/predict",
    response_model=PredictionResponse,
)
def predict(request: PredictionRequest):
    """Predict crop yield from agricultural input data."""

    try:
        predicted_yield = predict_yield(
            crop=request.crop,
            season=request.season,
            state=request.state,
            crop_year=request.crop_year,
            area=request.area,
            annual_rainfall=request.annual_rainfall,
            fertilizer=request.fertilizer,
            pesticide=request.pesticide,
        )

        return PredictionResponse(
            predicted_yield=round(predicted_yield, 4),
            unit="tonnes per hectare",
            message=(
                "Prediction generated successfully. "
                "This is an estimated ML prediction based on "
                "agricultural data and should not be treated as "
                "a guaranteed result."
            ),
        )

    except FileNotFoundError as error:
        raise HTTPException(
            status_code=500,
            detail=str(error),
        ) from error

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {error}",
        ) from error
