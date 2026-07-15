from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/interactions", tags=["Interactions"])


@router.post("", response_model=schemas.InteractionOut)
def create_interaction(payload: schemas.InteractionCreate, db: Session = Depends(get_db)):
    hcp = db.query(models.HCP).filter(models.HCP.id == payload.hcp_id).first()
    if not hcp:
        raise HTTPException(404, "HCP not found")
    inter = models.Interaction(**payload.model_dump())
    db.add(inter)
    db.commit()
    db.refresh(inter)
    return inter


@router.get("/hcp/{hcp_id}", response_model=list[schemas.InteractionOut])
def list_interactions(hcp_id: int, db: Session = Depends(get_db)):
    return db.query(models.Interaction).filter(
        models.Interaction.hcp_id == hcp_id
    ).order_by(models.Interaction.created_at.desc()).all()


@router.get("/{interaction_id}", response_model=schemas.InteractionOut)
def get_interaction(interaction_id: int, db: Session = Depends(get_db)):
    inter = db.query(models.Interaction).filter(
        models.Interaction.id == interaction_id
    ).first()
    if not inter:
        raise HTTPException(404, "Interaction not found")
    return inter


@router.patch("/{interaction_id}", response_model=schemas.InteractionOut)
def update_interaction(
    interaction_id: int,
    payload: schemas.InteractionUpdate,
    db: Session = Depends(get_db),
):
    inter = db.query(models.Interaction).filter(
        models.Interaction.id == interaction_id
    ).first()
    if not inter:
        raise HTTPException(404, "Interaction not found")
    for k, v in payload.model_dump(exclude_unset=True).items():
        setattr(inter, k, v)
    db.commit()
    db.refresh(inter)
    return inter