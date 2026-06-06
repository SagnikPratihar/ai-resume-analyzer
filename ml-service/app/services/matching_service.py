import re
import spacy
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from app.utils.logger import logger

try:
    nlp = spacy.load("en_core_web_sm")
    logger.info("spaCy loaded for matching")
except Exception as e:
    logger.error(f"spaCy load failed: {e}")
    nlp = None

try:
    embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
    logger.info("Sentence Transformer loaded")
except Exception as e:
    logger.error(f"Sentence Transformer load failed: {e}")
    embedding_model = None

TECH_SKILLS = [
    'python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'ruby',
    'go', 'rust', 'kotlin', 'swift', 'php', 'scala', 'r',
    'react', 'angular', 'vue', 'nodejs', 'node.js', 'express', 'django',
    'flask', 'fastapi', 'spring', 'html', 'css', 'tailwind', 'bootstrap',
    'mysql', 'postgresql', 'mongodb', 'redis', 'sqlite', 'oracle', 'sql',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins',
    'git', 'github', 'gitlab', 'ci/cd', 'linux', 'bash',
    'machine learning', 'deep learning', 'nlp', 'computer vision',
    'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy',
    'rest api', 'graphql', 'microservices', 'agile', 'scrum',
    'data structures', 'algorithms', 'system design', 'oop',
    'problem solving', 'communication', 'leadership', 'teamwork',
]


class MatchingService:

    @staticmethod
    def match(resume_text: str, jd_text: str) -> dict:
        similarity_score = MatchingService._semantic_similarity(
            resume_text, jd_text
        )

        jd_skills = MatchingService._extract_skills(jd_text)

        resume_skills = MatchingService._extract_skills(resume_text)

        matched_skills = [s for s in jd_skills if s in resume_skills]
        missing_skills = [s for s in jd_skills if s not in resume_skills]

        skill_match_pct = (
            len(matched_skills) / len(jd_skills) * 100
            if jd_skills else 0
        )

        final_score = (similarity_score * 0.6) + (skill_match_pct * 0.4)

        return {
            'match_percentage':  round(final_score, 2),
            'similarity_score':  round(similarity_score, 2),
            'skill_match_pct':   round(skill_match_pct, 2),
            'matched_skills':    matched_skills,
            'missing_skills':    missing_skills,
            'jd_skills':         jd_skills,
            'resume_skills':     resume_skills,
        }

    @staticmethod
    def _semantic_similarity(text1: str, text2: str) -> float:
        if not embedding_model:
            return 0.0

        try:
            t1 = ' '.join(text1.split()[:512])
            t2 = ' '.join(text2.split()[:512])
            embeddings = embedding_model.encode([t1, t2])

            score = cosine_similarity(
                embeddings[0].reshape(1, -1),
                embeddings[1].reshape(1, -1)
            )[0][0]

            return float(max(0, score) * 100)

        except Exception as e:
            logger.error(f"Embedding error: {e}")
            return 0.0

    @staticmethod
    def _extract_skills(text: str) -> list:
        text_lower = text.lower()
        found = []

        for skill in TECH_SKILLS:
            pattern = r'\b' + re.escape(skill) + r'\b'
            if re.search(pattern, text_lower):
                found.append(skill)

        return found