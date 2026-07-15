from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class HCP(Base):
    __tablename__ = "hcps"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    specialty = Column(String(255), nullable=True)
    designation = Column(String(255), nullable=True)  # e.g. Dr, Prof
    hospital = Column(String(255), nullable=True)
    city = Column(String(255), nullable=True)
    email = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    interactions = relationship("Interaction", back_populates="hcp")


class Interaction(Base):
    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, index=True)
    hcp_id = Column(Integer, ForeignKey("hcps.id"), nullable=False)
    channel = Column(String(50), nullable=True)  # Email, Call, Visit, Webinar
    summary = Column(Text, nullable=True)
    sentiment = Column(String(50), nullable=True)  # Positive, Neutral, Negative
    topics = Column(Text, nullable=True)  # comma separated
    next_best_action = Column(Text, nullable=True)
    products_discussed = Column(Text, nullable=True)
    raw_transcript = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    hcp = relationship("HCP", back_populates="interactions")