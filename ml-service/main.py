from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.settings import get_settings
from app.routers import health, parser, ats
from app.utils.logger import logger

settings = get_settings()

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Starting {settings.app_name} v{settings.app_version}")
    logger.info(f"Debug mode: {settings.debug}")
    logger.info(f"API Docs available at: http://localhost:{settings.port}/docs")
    yield
    logger.info("ML Service shutting down...")

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="ML service for resume parsing, ATS scoring, and semantic matching",
    docs_url="/docs",       
    redoc_url="/redoc",     
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.backend_url, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api", tags=["Health"])
app.include_router(parser.router,  prefix="/api", tags=["Parser"])
app.include_router(ats.router, prefix="/api", tags=["ATS"])


@app.get("/")
async def root():
    return {
        "service": settings.app_name,
        "version": settings.app_version,
        "docs": "/docs",
        "health": "/api/health",
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,  
    )