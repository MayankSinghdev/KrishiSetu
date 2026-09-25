
from typing import Any


CROP_RULES: dict[str, dict[str, Any]] = {
    "Rice": {
        "seasons": ["Kharif", "Autumn", "Whole Year"],
        "soils": ["Alluvial", "Clay", "Loamy"],
        "rainfall": (1000, 2500),
        "temperature": (20, 35),
        "irrigation": ["Available", "Good"],
    },
    "Wheat": {
        "seasons": ["Rabi", "Winter"],
        "soils": ["Alluvial", "Loamy", "Clay"],
        "rainfall": (300, 1000),
        "temperature": (10, 25),
        "irrigation": ["Available", "Good"],
    },
    "Maize": {
        "seasons": ["Kharif", "Summer", "Autumn"],
        "soils": ["Alluvial", "Loamy", "Sandy"],
        "rainfall": (500, 1200),
        "temperature": (18, 32),
        "irrigation": ["Available", "Good", "Limited"],
    },
    "Bajra": {
        "seasons": ["Kharif", "Summer"],
        "soils": ["Sandy", "Loamy"],
        "rainfall": (250, 750),
        "temperature": (25, 35),
        "irrigation": ["Limited", "Available"],
    },
    "Cotton": {
        "seasons": ["Kharif"],
        "soils": ["Black", "Loamy", "Alluvial"],
        "rainfall": (500, 1000),
        "temperature": (21, 35),
        "irrigation": ["Available", "Limited"],
    },
    "Soybean": {
        "seasons": ["Kharif"],
        "soils": ["Black", "Loamy"],
        "rainfall": (600, 1000),
        "temperature": (20, 30),
        "irrigation": ["Limited", "Available"],
    },
    "Groundnut": {
        "seasons": ["Kharif", "Summer"],
        "soils": ["Sandy", "Loamy"],
        "rainfall": (500, 1000),
        "temperature": (20, 30),
        "irrigation": ["Limited", "Available"],
    },
    "Potato": {
        "seasons": ["Rabi", "Winter"],
        "soils": ["Loamy", "Sandy"],
        "rainfall": (300, 800),
        "temperature": (10, 25),
        "irrigation": ["Available", "Good"],
    },
    "Sugarcane": {
        "seasons": ["Whole Year", "Kharif"],
        "soils": ["Alluvial", "Loamy", "Black"],
        "rainfall": (1000, 2500),
        "temperature": (20, 35),
        "irrigation": ["Available", "Good"],
    },
    "Mustard": {
        "seasons": ["Rabi", "Winter"],
        "soils": ["Loamy", "Alluvial"],
        "rainfall": (300, 600),
        "temperature": (10, 25),
        "irrigation": ["Limited", "Available"],
    },
}


def _normalise(value: str) -> str:
    """Normalise user input for rule matching."""
    return value.strip().lower()


def _matches(value: str, allowed_values: list[str]) -> bool:
    """Check whether a value matches one of the configured options."""
    normalised_value = _normalise(value)

    return any(
        normalised_value == _normalise(allowed)
        for allowed in allowed_values
    )


def _score_crop(
    crop: str,
    rules: dict[str, Any],
    season: str,
    soil_type: str,
    annual_rainfall: float,
    temperature: float,
    irrigation: str,
) -> tuple[int, list[str]]:
    """Calculate a simple explainable suitability score."""

    score = 0
    reasons: list[str] = []

    if _matches(season, rules["seasons"]):
        score += 30
        reasons.append("Suitable for the selected season.")

    rainfall_min, rainfall_max = rules["rainfall"]

    if rainfall_min <= annual_rainfall <= rainfall_max:
        score += 25
        reasons.append("Rainfall is within the configured suitable range.")
    else:
        reasons.append("Rainfall is outside the preferred range.")

    temperature_min, temperature_max = rules["temperature"]

    if temperature_min <= temperature <= temperature_max:
        score += 20
        reasons.append("Temperature is within the configured suitable range.")
    else:
        reasons.append("Temperature is outside the preferred range.")

    if _matches(soil_type, rules["soils"]):
        score += 15
        reasons.append("Soil type is suitable for this crop.")

    if _matches(irrigation, rules["irrigation"]):
        score += 10
        reasons.append("Irrigation availability matches the crop.")

    return score, reasons


def recommend_crops(
    state: str,
    season: str,
    soil_type: str,
    annual_rainfall: float,
    temperature: float,
    irrigation: str,
) -> list[dict[str, Any]]:
    """
    Recommend crops using transparent project-level suitability rules.

    State is accepted as an input so the API is ready for future
    region-specific rules. The current rule set primarily evaluates
    season, rainfall, temperature, soil and irrigation.
    """

    del state

    scored_crops: list[dict[str, Any]] = []

    for crop, rules in CROP_RULES.items():
        score, reasons = _score_crop(
            crop=crop,
            rules=rules,
            season=season,
            soil_type=soil_type,
            annual_rainfall=annual_rainfall,
            temperature=temperature,
            irrigation=irrigation,
        )

        scored_crops.append(
            {
                "crop": crop,
                "suitability_score": score,
                "reasons": reasons,
            }
        )

    scored_crops.sort(
        key=lambda item: item["suitability_score"],
        reverse=True,
    )

    return scored_crops[:3]
