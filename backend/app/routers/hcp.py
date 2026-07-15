from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/hcps", tags=["HCPs"])


@router.post("", response_model=schemas.HCPOut)
def create_hcp(payload: schemas.HCPCreate, db: Session = Depends(get_db)):
    hcp = models.HCP(**payload.model_dump())
    db.add(hcp)
    db.commit()
    db.refresh(hcp)
    return hcp


@router.get("", response_model=list[schemas.HCPOut])
def list_hcps(db: Session = Depends(get_db)):
    return db.query(models.HCP).order_by(models.HCP.id.desc()).all()


@router.get("/{hcp_id}", response_model=schemas.HCPOut)
def get_hcp(hcp_id: int, db: Session = Depends(get_db)):
    hcp = db.query(models.HCP).filter(models.HCP.id == hcp_id).first()
    if not hcp:
        raise HTTPException(404, "HCP not found")
    return hcp


@router.delete("/{hcp_id}")
def delete_hcp(hcp_id: int, db: Session = Depends(get_db)):
    hcp = db.query(models.HCP).filter(models.HCP.id == hcp_id).first()
    if not hcp:
        raise HTTPException(404, "HCP not found")
    # Cascade delete interactions
    db.query(models.Interaction).filter(models.Interaction.hcp_id == hcp_id).delete()
    db.delete(hcp)
    db.commit()
    return {"ok": True}


@router.post("/clear-all")
def clear_all(db: Session = Depends(get_db)):
    """Delete all HCPs and interactions, reset IDs to start from 1."""
    db.execute("TRUNCATE TABLE interactions, hcps RESTART IDENTITY CASCADE")
    db.commit()
    return {"ok": True}
