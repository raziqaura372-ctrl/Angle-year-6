import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    APP_NAME: str = "VeriDraft Plagiarism Detection System"
    ENV: str = "development"
    DEBUG: bool = True
    USE_SQLITE_FALLBACK: bool = True

    # Database settings
    DATABASE_URL: str = "sqlite+aiosqlite:///./plagiarism.db"
    SYNC_DATABASE_URL: str = "sqlite:///./plagiarism.db"

    # Redis & Celery
    REDIS_URL: str = "redis://localhost:6379/0"
    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/0"

    # Auth & JWT
    SECRET_KEY: str = "super-secret-key-change-in-production-1234567890"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 120
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Storage & Uploads
    UPLOAD_DIR: str = "./storage/uploads"
    REPORTS_DIR: str = "./storage/reports"
    MAX_FILE_SIZE_MB: int = 25

    # External APIs
    GOOGLE_SEARCH_API_KEY: str | None = None
    GOOGLE_CSE_ID: str | None = None
    BING_SEARCH_API_KEY: str | None = None

    ENABLE_CROSSREF: bool = True
    ENABLE_ARXIV: bool = True
    ENABLE_WIKIPEDIA: bool = True

    # Security & Antivirus
    ENABLE_CLAMAV: bool = False
    CLAMAV_HOST: str = "localhost"
    CLAMAV_PORT: int = 3310

    # Plagiarism Defaults
    DEFAULT_GREEN_THRESHOLD: float = 15.0
    DEFAULT_AMBER_THRESHOLD: float = 40.0
    DEFAULT_MIN_MATCH_WORDS: int = 5
    DEFAULT_DATA_RETENTION_DAYS: int = 365

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()

# Ensure storage directories exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.REPORTS_DIR, exist_ok=True)
