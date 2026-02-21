from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, date
from ..models.models import UserRole, VehicleStatus, VehicleType, DriverStatus, TripStatus

class UserBase(BaseModel):
    email: EmailStr
    role: UserRole

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    id: Optional[int] = None


class VehicleBase(BaseModel):
    name: str
    plate: str
    vehicle_type: VehicleType
    capacity: float
    odometer: float = 0.0
    status: VehicleStatus = VehicleStatus.AVAILABLE
    acquisition_cost: float

class VehicleCreate(VehicleBase):
    pass

class VehicleUpdate(BaseModel):
    status: Optional[VehicleStatus] = None
    odometer: Optional[float] = None

class VehicleOut(VehicleBase):
    id: int
    class Config:
        from_attributes = True

class DriverBase(BaseModel):
    name: str
    license_number: str
    license_category: VehicleType
    license_expiry: date
    safety_score: float = 100.0
    status: DriverStatus = DriverStatus.OFF_DUTY

class DriverCreate(DriverBase):
    pass

class DriverOut(DriverBase):
    id: int
    class Config:
        from_attributes = True

class TripBase(BaseModel):
    vehicle_id: Optional[int] = None
    driver_id: Optional[int] = None
    cargo_weight: float
    origin: str
    destination: str

class TripCreate(TripBase):
    pass

class TripOut(TripBase):
    id: int
    status: TripStatus
    created_at: datetime
    completed_at: Optional[datetime] = None
    driver: Optional[DriverOut] = None
    vehicle: Optional[VehicleOut] = None
    class Config:
        from_attributes = True

class MaintenanceLogBase(BaseModel):
    vehicle_id: int
    service_type: str
    description: str
    cost: float
    service_date: date
    next_due_date: date

class MaintenanceLogCreate(MaintenanceLogBase):
    pass

class MaintenanceLogOut(MaintenanceLogBase):
    id: int
    class Config:
        from_attributes = True

class FuelLogBase(BaseModel):
    vehicle_id: int
    liters: float
    cost: float
    date: date
    odometer_reading: float

class FuelLogCreate(FuelLogBase):
    pass

class FuelLogOut(FuelLogBase):
    id: int
    class Config:
        from_attributes = True
