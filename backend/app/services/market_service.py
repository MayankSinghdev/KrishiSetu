import json
import os
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import urlopen

from dotenv import load_dotenv


ENV_FILE = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(ENV_FILE)

DATA_GOV_API_KEY = os.getenv("DATA_GOV_API_KEY")

DATA_GOV_RESOURCE_URL = (
    "https://api.data.gov.in/resource/"
    "9ef84268-d588-465a-a308-a864a43d0070"
)


def get_market_prices(
    state: str,
    commodity: str,
    district: str | None = None,
    market: str | None = None,
) -> dict[str, Any]:
    """Fetch mandi prices from the Government OGD API."""

    if not DATA_GOV_API_KEY:
        raise RuntimeError(
            "DATA_GOV_API_KEY is not configured in backend/.env"
        )

    params = {
        "api-key": DATA_GOV_API_KEY,
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
        with urlopen(request_url, timeout=30) as response:
            response_text = response.read().decode("utf-8")

    except HTTPError as error:
        raise RuntimeError(
            f"Government OGD API returned HTTP {error.code}."
        ) from error

    except URLError as error:
        raise RuntimeError(
            f"Unable to reach the Government OGD API: {error.reason}"
        ) from error

    except TimeoutError as error:
        raise RuntimeError(
            "Government OGD API request timed out."
        ) from error

    try:
        data = json.loads(response_text)
    except json.JSONDecodeError as error:
        raise RuntimeError(
            "Government OGD API returned an invalid JSON response."
        ) from error

    requested_state = state.strip().casefold()
    requested_commodity = commodity.strip().casefold()

    filtered_records = []

    for record in data.get("records", []):
        record_state = str(
            record.get("state", "")
        ).strip().casefold()

        record_commodity = str(
            record.get("commodity", "")
        ).strip().casefold()

        if (
            record_state == requested_state
            and record_commodity == requested_commodity
        ):
            filtered_records.append(record)

    data["records"] = filtered_records
    data["total"] = len(filtered_records)

    return data