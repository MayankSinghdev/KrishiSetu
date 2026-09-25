from fastapi import APIRouter, HTTPException, Query

from backend.app.schemas.market import MarketResponse
from backend.app.services.market_service import get_market_prices


router = APIRouter(
    prefix="/api",
    tags=["Market"],
)


@router.get(
    "/market",
    response_model=MarketResponse,
)
def market_prices(
    state: str = Query(..., min_length=1),
    commodity: str = Query(..., min_length=1),
    district: str | None = Query(default=None),
    market: str | None = Query(default=None),
):
    """Get mandi prices from the Government OGD API."""

    try:
        data = get_market_prices(
            state=state,
            commodity=commodity,
            district=district,
            market=market,
        )

        records = data.get("records", [])

        return MarketResponse(
            records=records,
            total=int(data.get("total", len(records))),
            message=(
                "Mandi prices retrieved from the Government "
                "Open Government Data (OGD) API."
            ),
        )

    except Exception as error:
        raise HTTPException(
            status_code=502,
            detail=f"Unable to retrieve market prices: {error}",
        ) from error