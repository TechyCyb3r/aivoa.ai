from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app import models
from app.routers import hcp, interaction, chat

# Create tables (dev convenience; for prod use Alembic migrations)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AIVOA AI-First CRM - HCP Module")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(hcp.router)
app.include_router(interaction.router)
app.include_router(chat.router)


@app.get("/")
def root():
    return {"message": "AIVOA HCP CRM API is running. See /docs for endpoints."}


@app.get("/health")
def health():
    return {"status": "ok"}