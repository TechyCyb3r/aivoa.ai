from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# ---------- HCP ----------
class HCPCreate(BaseModel):
    name: str
    specialty: Optional[str] = None
    designation: Optional[str] = None
    hospital: Optional[str] = None
    city: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None


class HCPOut(HCPCreate):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ---------- Interaction ----------
class InteractionCreate(BaseModel):
    hcp_id: int
    channel: Optional[str] = None
    summary: Optional[str] = None
    sentiment: Optional[str] = None
    topics: Optional[str] = None
    next_best_action: Optional[str] = None
    products_discussed: Optional[str] = None
    raw_transcript: Optional[str] = None


class InteractionUpdate(BaseModel):
    channel: Optional[str] = None
    summary: Optional[str] = None
    sentiment: Optional[str] = None
    topics: Optional[str] = None
    next_best_action: Optional[str] = None
    products_discussed: Optional[str] = None
    raw_transcript: Optional[str] = None


class InteractionOut(InteractionCreate):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ---------- Chat / Agent ----------
class ChatRequest(BaseModel):
    hcp_id: int
    message: str
    history: Optional[List[dict]] = []


class ChatResponse(BaseModel):
    reply: str
    tool_used: Optional[str] = None
    data: Optional[dict] = None