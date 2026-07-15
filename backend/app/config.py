from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    groq_api_key: str = "your_groq_api_key_here"
    database_url: str = "postgresql://postgres:postgres@localhost:5432/aivoa_crm"
    app_name: str = "AIVOA AI-First CRM - HCP Module"

    class Config:
        env_file = ".env"


settings = Settings()