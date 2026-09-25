from fastapi import APIRouter, Query

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
    """Return live mandi prices or clearly labelled demo data."""

    data = get_market_prices(
        state=state,
        commodity=commodity,
        district=district,
        market=market,
    )

    return MarketResponse(
        records=data.get("records", []),
        total=int(data.get("total", 0)),
        message=data.get(
            "message",
            "Market data is currently unavailable.",
        ),
    )