from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.ats_service import ATSService
from app.utils.logger import logger

router = APIRouter()

class ATSRequest(BaseModel):
    resume_text: str
    resume_id:   int

class ATSResponse(BaseModel):
    success: bool
    ats_score: float
    keyword_score: float
    section_score: float
    content_score: float
    format_score: float
    found_keywords: list
    word_count: int
    message: str = ''


@router.post('/ats/score', response_model=ATSResponse)
async def score_resume(request: ATSRequest):
    logger.info(f"Scoring resume {request.resume_id}")

    if not request.resume_text or len(request.resume_text.strip()) < 50:
        raise HTTPException(
            status_code=400,
            detail='Resume text is too short to analyze'
        )

    try:
        result = ATSService.score(request.resume_text)
        logger.info(
            f"Resume {request.resume_id} scored: {result['ats_score']}"
        )

        return ATSResponse(
            success=True,
            message='Scoring complete',
            **result,
        )
    except Exception as e:
        logger.error(f"Scoring error: {e}")
        raise HTTPException(status_code=500, detail=str(e))