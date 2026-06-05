import base64
import tempfile
import os
import pdfplumber
from docx  import Document
from app.utils.logger import logger


class ParserService:

    @staticmethod
    def extract_text(file_data: str, file_type: str) -> str:
        file_bytes = base64.b64decode(file_data)

        suffix = '.pdf' if file_type == 'pdf' else '.docx'
        with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
            tmp.write(file_bytes)
            tmp_path = tmp.name

        try:
            if file_type == 'pdf':
                text = ParserService._extract_from_pdf(tmp_path)
            else:
                text = ParserService._extract_from_docx(tmp_path)

            return ParserService._clean_text(text)

        finally:
            os.unlink(tmp_path)

    @staticmethod
    def _extract_from_pdf(file_path: str) -> str:
        text_parts = []
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text_parts.append(page_text)
        return '\n'.join(text_parts)

    @staticmethod
    def _extract_from_docx(file_path: str) -> str:
        doc   = Document(file_path)
        lines = [para.text for para in doc.paragraphs if para.text.strip()]
        return '\n'.join(lines)

    @staticmethod
    def _clean_text(text: str) -> str:
        lines   = text.split('\n')
        cleaned = [line.strip() for line in lines if line.strip()]
        return '\n'.join(cleaned)