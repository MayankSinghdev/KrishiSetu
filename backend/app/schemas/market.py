from pydantic import BaseModel


class MarketPrice(BaseModel):
    state: str
    district: str
    market: str
    commodity: str
    variety: str
    grade: str
    arrival_date: str
    min_price: float
    max_price: float
    modal_price: float


class MarketResponse(BaseModel):
    records: list[MarketPrice]
    total: int
    message: str