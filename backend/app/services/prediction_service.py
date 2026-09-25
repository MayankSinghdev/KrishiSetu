from functools import lru_cache
from pathlib import Path

import joblib
import pandas as pd


MODEL_PATH = (
    Path(__file__).resolve().parents[3]
    / "ml"
    / "models"
    / "yield_model.joblib"
)


@lru_cache(maxsize=1)
def load_model():
    """Load the trained model once and reuse it."""

    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"Trained model not found at: {MODEL_PATH}"
        )

    return joblib.load(MODEL_PATH)


def predict_yield(
    crop: str,
    season: str,
    state: str,
    crop_year: int,
    area: float,
    annual_rainfall: float,
    fertilizer: float,
    pesticide: float,
) -> float:
    """Generate a crop-yield prediction using the trained model."""

    model = load_model()

    input_data = pd.DataFrame(
        [
            {
                "Crop": crop.strip(),
                "Season": season.strip(),
                "State": state.strip(),
                "Crop_Year": crop_year,
                "Area": area,
                "Annual_Rainfall": annual_rainfall,
                "Fertilizer": fertilizer,
                "Pesticide": pesticide,
            }
        ]
    )

    prediction = model.predict(input_data)[0]

    return float(prediction)