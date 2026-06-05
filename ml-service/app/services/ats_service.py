import re
import spacy
from app.utils.logger import logger

try:
    nlp = spacy.load("en_core_web_sm")
    logger.info("spaCy model loaded")
except Exception as e:
    logger.error(f"spaCy load failed: {e}")
    nlp = None


class ATSService:
    TECH_KEYWORDS = {
        'programming': [
            'python', 'java', 'javascript', 'typescript', 'c++', 'c#',
            'ruby', 'go', 'rust', 'kotlin', 'swift', 'php', 'scala',
        ],
        'web': [
            'react', 'angular', 'vue', 'nodejs', 'node.js', 'express',
            'django', 'flask', 'fastapi', 'html', 'css', 'rest', 'graphql',
        ],
        'database': [
            'mysql', 'postgresql', 'mongodb', 'redis', 'sqlite',
            'oracle', 'sql', 'nosql', 'elasticsearch',
        ],
        'cloud': [
            'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'ci/cd',
            'jenkins', 'github actions', 'terraform',
        ],
        'data': [
            'machine learning', 'deep learning', 'tensorflow', 'pytorch',
            'pandas', 'numpy', 'scikit-learn', 'data analysis', 'nlp',
        ],
        'soft_skills': [
            'leadership', 'communication', 'teamwork', 'problem solving',
            'agile', 'scrum', 'collaboration', 'analytical',
        ],
    }

    IMPORTANT_SECTIONS = [
        'education', 'experience', 'work experience', 'skills',
        'projects', 'certifications', 'summary', 'objective',
        'achievements', 'awards', 'publications', 'internship',
    ]

    ACTION_VERBS = [
        'developed', 'built', 'designed', 'implemented', 'created',
        'led', 'managed', 'improved', 'increased', 'reduced',
        'architected', 'optimized', 'deployed', 'launched', 'delivered',
        'collaborated', 'mentored', 'automated', 'integrated', 'resolved',
    ]

    @staticmethod
    def score(resume_text: str) -> dict:
        text_lower = resume_text.lower()

        keyword_score = ATSService._score_keywords(text_lower)
        section_score = ATSService._score_sections(text_lower)
        content_score = ATSService._score_content(resume_text, text_lower)
        format_score = ATSService._score_format(resume_text, text_lower)

        final_score = (
            keyword_score * 0.35 +
            section_score * 0.25 +
            content_score * 0.25 +
            format_score * 0.15
        )

        found_keywords = ATSService._extract_found_keywords(text_lower)

        return {
            'ats_score': round(final_score, 2),
            'keyword_score': round(keyword_score, 2),
            'section_score': round(section_score, 2),
            'content_score': round(content_score, 2),
            'format_score': round(format_score, 2),
            'found_keywords': found_keywords,
            'word_count': len(resume_text.split()),
        }

    @staticmethod
    def _score_keywords(text_lower: str) -> float:
        total_keywords = sum(len(v) for v in ATSService.TECH_KEYWORDS.values())
        found = 0

        for category, keywords in ATSService.TECH_KEYWORDS.items():
            for keyword in keywords:
                if keyword in text_lower:
                    found += 1

        raw_score = (found / total_keywords) * 100
        return min(raw_score * 2.5, 100)

    @staticmethod
    def _score_sections(text_lower: str) -> float:
        found_sections = 0
        for section in ATSService.IMPORTANT_SECTIONS:
            if section in text_lower:
                found_sections += 1

        score = (found_sections / 6) * 100
        return min(score, 100)

    @staticmethod
    def _score_content(resume_text: str, text_lower: str) -> float:
        score = 0

        word_count = len(resume_text.split())
        if word_count >= 300:
            score += 30
        elif word_count >= 150:
            score += 15

        action_verb_count = sum(
            1 for verb in ATSService.ACTION_VERBS
            if verb in text_lower
        )
        score += min(action_verb_count * 5, 35)

        numbers = re.findall(r'\d+%|\$\d+|\d+ (years|months|users|projects|team)', text_lower)
        score += min(len(numbers) * 7, 35)

        return min(score, 100)

    @staticmethod
    def _score_format(resume_text: str, text_lower: str) -> float:
        score = 0

        if re.search(r'[\w.-]+@[\w.-]+\.\w+', resume_text):
            score += 25

        if re.search(r'[\+]?[\d\s\-\(\)]{10,}', resume_text):
            score += 20

        if 'linkedin' in text_lower or 'github' in text_lower:
            score += 20

        lines = [l for l in resume_text.split('\n') if l.strip()]
        if 20 <= len(lines) <= 80:
            score += 35
        elif len(lines) > 10:
            score += 15

        return min(score, 100)

    @staticmethod
    def _extract_found_keywords(text_lower: str) -> list:
        found = []
        for category, keywords in ATSService.TECH_KEYWORDS.items():
            for keyword in keywords:
                if keyword in text_lower:
                    found.append(keyword)
        return found