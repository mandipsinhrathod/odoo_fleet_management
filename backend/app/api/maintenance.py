from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import date
from ..db.session import get_db
from ..models import models
from ..schemas import schemas
from .deps import get_current_user, check_role

router = APIRouter(prefix="/maintenance", tags=["maintenance"])

@router.get("/", response_model=List[schemas.MaintenanceLogOut])
def get_maintenance_logs(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return db.query(models.MaintenanceLog).all()

@router.post("/", response_model=schemas.MaintenanceLogOut)
def create_maintenance_log(
    log: schemas.MaintenanceLogCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(check_role([models.UserRole.ADMIN, models.UserRole.MANAGER]))
):
    # 1. Validate Vehicle
    vehicle = db.query(models.Vehicle).filter(models.Vehicle.id == log.vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    
    # 2. Update Vehicle Status
    vehicle.status = models.VehicleStatus.IN_SHOP
    
    # 3. Create Log
    new_log = models.MaintenanceLog(**log.dict())
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return new_log

@router.patch("/{log_id}/complete", response_model=schemas.MaintenanceLogOut)
def complete_maintenance_log(
    log_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(check_role([models.UserRole.ADMIN, models.UserRole.MANAGER]))
):
    log = db.query(models.MaintenanceLog).filter(models.MaintenanceLog.id == log_id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Maintenance log not found")
    
    # Update Vehicle Status
    vehicle = db.query(models.Vehicle).filter(models.Vehicle.id == log.vehicle_id).first()
    if vehicle:
        vehicle.status = models.VehicleStatus.AVAILABLE
    
    db.commit()
    db.refresh(log)
    return log

@router.delete("/{log_id}")
def delete_maintenance_log(
    log_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(check_role([models.UserRole.ADMIN, models.UserRole.MANAGER]))
):
    log = db.query(models.MaintenanceLog).filter(models.MaintenanceLog.id == log_id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Maintenance log not found")
    
    vehicle = db.query(models.Vehicle).filter(models.Vehicle.id == log.vehicle_id).first()
    if vehicle and vehicle.status == models.VehicleStatus.IN_SHOP:
        vehicle.status = models.VehicleStatus.AVAILABLE
        
    db.delete(log)
    db.commit()
    return {"detail": "Maintenance log deleted successfully"}

