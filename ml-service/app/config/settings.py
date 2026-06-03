from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    app_name: str = "AI Resume Analyzer ML Service"
    app_version: str = "1.0.0"
    debug: bool = True
    host: str = "0.0.0.0"
    port: int = 8000
    backend_url: str = "http://localhost:5000"
    spacy_model: str = "en_core_web_sm"
    similarity_threshold: float = 0.75

    class Config:
        env_file = ".env"         
        case_sensitive = False    
@lru_cache()
def get_settings() -> Settings:
    return Settings()