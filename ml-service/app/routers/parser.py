from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.parser_service import ParserService
from app.utils.logger import logger

router = APIRouter()

class ParseRequest(BaseModel):
    file_data: str   
    file_type: str  
    resume_id: int

class ParseResponse(BaseModel):
    success: bool
    text: str = ''
    word_count: int = 0
    message: str = ''

@router.post('/parse', response_model=ParseResponse)
async def parse_resume(request: ParseRequest):
    """Extract text from uploaded resume file."""

    logger.info(f"Parsing resume {request.resume_id} ({request.file_type})")

    if request.file_type not in ['pdf', 'docx']:
        raise HTTPException(status_code=400, detail='Invalid file type')

    try:
        text = ParserService.extract_text(request.file_data, request.file_type)
        word_count = len(text.split())
        logger.info(f"Resume {request.resume_id} parsed: {word_count} words")

        return ParseResponse(
            success=True,
            text=text,
            word_count=word_count,
            message='Parsed successfully',
        )
    except Exception as e:
        logger.error(f"Parse error: {e}")
        raise HTTPException(status_code=500, detail=str(e))