from typing import Any


# These are demonstration locations matching the frontend options.
# They are not a verified directory of official mandi locations.
MARKET_LOCATIONS: dict[str, dict[str, list[str]]] = {
    "Uttar Pradesh": {
        "Gorakhpur": ["Gorakhpur Mandi"],
        "Lucknow": ["Lucknow Mandi"],
        "Varanasi": ["Varanasi Mandi"],
    },
    "Punjab": {
        "Ludhiana": ["Ludhiana Mandi"],
        "Amritsar": ["Amritsar Mandi"],
        "Patiala": ["Patiala Mandi"],
    },
    "Haryana": {
        "Karnal": ["Karnal Mandi"],
        "Hisar": ["Hisar Mandi"],
        "Rohtak": ["Rohtak Mandi"],
    },
    "Madhya Pradesh": {
        "Indore": ["Indore Mandi"],
        "Bhopal": ["Bhopal Mandi"],
        "Ujjain": ["Ujjain Mandi"],
    },
    "Maharashtra": {
        "Pune": ["Pune Mandi"],
        "Nashik": ["Lasalgaon Mandi"],
        "Nagpur": ["Nagpur Mandi"],
    },
}


# Fictional sample modal prices in rupees per quintal.
# These values are for UI demonstration only.
CROP_BASE_PRICES: dict[str, float] = {
    "Rice": 2200,
    "Wheat": 2450,
    "Maize": 1900,
    "Bajra": 2100,
    "Cotton": 6800,
    "Sugarcane": 350,
    "Soybean": 4300,
    "Groundnut": 5600,
    "Potato": 1400,
    "Tomato": 1800,
}


def _normalise(value: str | None) -> str:
    return (value or "").strip().casefold()


def get_market_prices(
    state: str,
    commodity: str,
    district: str | None = None,
    market: str | None = None,
) -> dict[str, Any]:
    """Return fictional demo mandi prices without external API calls."""

    selected_state = state.strip().title()
    selected_commodity = commodity.strip().title()
    selected_district = (district or "").strip()
    selected_market = (market or "").strip()

    records: list[dict[str, Any]] = []

    base_price = CROP_BASE_PRICES.get(selected_commodity)

    if base_price is not None:
        for state_index, (state_name, districts) in enumerate(
            MARKET_LOCATIONS.items()
        ):
            if _normalise(state_name) != _normalise(selected_state):
                continue

            for district_index, (district_name, markets) in enumerate(
                districts.items()
            ):
                if (
                    selected_district
                    and _normalise(district_name)
                    != _normalise(selected_district)
                ):
                    continue

                for market_index, market_name in enumerate(markets):
                    if (
                        selected_market
                        and _normalise(market_name)
                        != _normalise(selected_market)
                    ):
                        continue

                    # Small deterministic variations make the sample
                    # results differ by location. These are NOT real
                    # market observations.
                    variation = (
                        state_index * 37
                        + district_index * 23
                        + market_index * 11
                    )

                    modal_price = float(base_price + variation)
                    min_price = round(modal_price * 0.94, 2)
                    max_price = round(modal_price * 1.06, 2)

                    records.append(
                        {
                            "state": state_name,
                            "district": district_name,
                            "market": market_name,
                            "commodity": selected_commodity,
                            "variety": "Demo Variety",
                            "grade": "Demo Grade",
                            "arrival_date": "Demo data — not a real date",
                            "min_price": min_price,
                            "max_price": max_price,
                            "modal_price": modal_price,
                        }
                    )

    if records:
        message = (
            "DEMO DATA ONLY — These are fictional sample prices "
            "generated for the KrishiSetu project demonstration. "
            "They are not actual mandi prices and are not retrieved "
            "from government sources."
        )
    else:
        message = (
            "No demo data is configured for this selection. "
            "Please choose a supported state, district, mandi "
            "and commodity."
        )

    return {
        "records": records,
        "total": len(records),
        "message": message,
    }