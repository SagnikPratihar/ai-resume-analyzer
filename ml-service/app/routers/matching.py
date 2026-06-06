from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.matching_service import MatchingService
from app.utils.logger import logger

router = APIRouter()

class MatchRequest(BaseModel):
    resume_text: str
    jd_text:     str
    resume_id:   int

class MatchResponse(BaseModel):
    success: bool
    match_percentage: float
    similarity_score: float
    skill_match_pct: float
    matched_skills: list
    missing_skills: list
    jd_skills: list
    resume_skills: list
    message: str = ''

@router.post('/match', response_model=MatchResponse)
async def match_resume(request: MatchRequest):
    """Match resume against a job description."""

    logger.info(f"Matching resume {request.resume_id} against JD")

    if not request.resume_text or not request.jd_text:
        raise HTTPException(
            status_code=400,
            detail='Both resume text and job description are required'
        )

    try:
        result = MatchingService.match(
            request.resume_text,
            request.jd_text
        )
        logger.info(
            f"Match complete: {result['match_percentage']}%"
        )

        return MatchResponse(
            success=True,
            message='Matching complete',
            **result,
        )

    except Exception as e:
        logger.error(f"Matching error: {e}")
        raise HTTPException(status_code=500, detail=str(e))