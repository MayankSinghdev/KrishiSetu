import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.api.prediction import router as prediction_router
from backend.app.api.recommendation import router as recommendation_router
from backend.app.api.market import router as market_router


app = FastAPI(
    title="KrishiSetu Smart Agriculture API",
    description=(
        "Backend API for the KrishiSetu Smart Agriculture Platform"
    ),
    version="1.0.0",
)


frontend_url = os.getenv("FRONTEND_URL", "").strip().rstrip("/")

allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://krishisetu-1-7a9f.onrender.com",
]

if frontend_url:
    allowed_origins.append(frontend_url)


app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(prediction_router)
app.include_router(recommendation_router)
app.include_router(market_router)


@app.get("/")
def root():
    return {
        "message": "KrishiSetu Smart Agriculture API is running",
        "status": "success",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "KrishiSetu Backend",
    }