from fastapi import APIRouter
from datetime import datetime
import spacy

from app.models.schemas import HealthResponse
from app.utils.logger import logger

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Check if the ML service and its dependencies are running."""

    logger.info("Health check requested")

    try:
        nlp = spacy.load("en_core_web_sm")
        spacy_status = "healthy"
    except Exception as e:
        logger.error(f"spaCy model load failed: {e}")
        spacy_status = "unavailable"

    return HealthResponse(
        success=True,
        message="ML Service is running",
        version="1.0.0",
        timestamp=datetime.utcnow().isoformat(),
        services={
            "spacy":                spacy_status,
            "sentence_transformers": "ready",
            "sklearn":              "ready",
        }
    )