import json
import os
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import urlopen

from dotenv import load_dotenv


ENV_FILE = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(ENV_FILE, override=True)

DATA_GOV_RESOURCE_URL = (
    "https://api.data.gov.in/resource/"
    "9ef84268-d588-465a-a308-a864a43d0070"
)

# These are invented demonstration values, NOT live mandi prices.
def _demo_response(state: str, commodity: str) -> dict[str, Any]:
    record = {
        "state": state.strip().title(),
        "district": "Demo District",
        "market": "Demo Mandi",
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
            "DEMO DATA — These sample values are fictional and are "
            "NOT live government mandi prices. Live OGD data is "
            "temporarily unavailable."
        ),
    }


def get_market_prices(
    state: str,
    commodity: str,
    district: str | None = None,
    market: str | None = None,
) -> dict[str, Any]:
    """Fetch live mandi prices, falling back to clearly labelled demo data."""

    api_key = os.getenv("DATA_GOV_API_KEY")

    if not api_key:
        return _demo_response(state, commodity)

    params = {
        "api-key": api_key,
        "format": "json",
        "limit": "100",
        "filters[state]": state,
        "filters[commodity]": commodity,
    }

    if district:
        params["filters[district]"] = district

    if market:
        params["filters[market]"] = market

    request_url = f"{DATA_GOV_RESOURCE_URL}?{urlencode(params)}"

    try:
        with urlopen(request_url, timeout=12) as response:
            response_text = response.read().decode("utf-8")

        data = json.loads(response_text)

        requested_state = state.strip().casefold()
        requested_commodity = commodity.strip().casefold()

        records = [
            record
            for record in data.get("records", [])
            if str(record.get("state", "")).strip().casefold()
            == requested_state
            and str(record.get("commodity", "")).strip().casefold()
            == requested_commodity
        ]

        return {
            "records": records,
            "total": len(records),
            "message": (
                "Live mandi prices retrieved from the Government "
                "Open Government Data (OGD) API."
                if records
                else
                "The live API responded, but no matching records "
                "were found for the selected state and commodity."
            ),
        }

    except HTTPError as error:
        print(f"OGD API returned HTTP {error.code}; using demo data.")
    except (URLError, TimeoutError, json.JSONDecodeError) as error:
        print(f"OGD API unavailable ({type(error).__name__}); using demo data.")
    except Exception as error:
        print(f"Unexpected market API error ({type(error).__name__}); using demo data.")

    return _demo_response(state, commodity)