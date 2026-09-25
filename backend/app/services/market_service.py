from typing import Any


def get_market_prices(
    state: str,
    commodity: str,
    district: str | None = None,
    market: str | None = None,
) -> dict[str, Any]:
    """Return fictional demo mandi prices. No external API is called."""

    record = {
        "state": state.strip().title(),
        "district": district.strip().title() if district else "Demo District",
        "market": market.strip().title() if market else "Demo Mandi",
        "commodity": commodity.strip().title(),
        "variety": "Demo Variety",
        "grade": "Demo Grade",
        "arrival_date": "Demo data — not a real arrival date",
        "min_price": 2000.0,
        "max_price": 2400.0,
        "modal_price": 2200.0,
    }

    return {
        "records": [record],
        "total": 1,
        "message": (
            "DEMO DATA ONLY — All prices shown are fictional sample "
            "values for project demonstration. They are NOT actual "
            "mandi prices and are NOT retrieved from the Government OGD API."
        ),
    }