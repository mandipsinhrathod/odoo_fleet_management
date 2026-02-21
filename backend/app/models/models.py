from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum, Date
from sqlalchemy.orm import relationship
import enum
from datetime import datetime
from ..db.session import Base

class UserRole(str, enum.Enum):
    ADMIN = "Admin"
    MANAGER = "Manager"
    DISPATCHER = "Dispatcher"
    DRIVER = "Driver"
    ANALYST = "Analyst"

class VehicleStatus(str, enum.Enum):
    AVAILABLE = "Available"
    ON_TRIP = "On Trip"
    IN_SHOP = "In Shop"
    RETIRED = "Retired"

class VehicleType(str, enum.Enum):
    TRUCK = "Truck"
    VAN = "Van"
    BIKE = "Bike"

class DriverStatus(str, enum.Enum):
    ON_DUTY = "On Duty"
    OFF_DUTY = "Off Duty"
    ON_TRIP = "On Trip"
    SUSPENDED = "Suspended"

class TripStatus(str, enum.Enum):
    DRAFT = "Draft"
    DISPATCHED = "Dispatched"
    COMPLETED = "Completed"
    CANCELLED = "Cancelled"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(Enum(UserRole), default=UserRole.DRIVER)

class Vehicle(Base):
    __tablename__ = "vehicles"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    plate = Column(String, unique=True, index=True)
    vehicle_type = Column(Enum(VehicleType))
    capacity = Column(Float)
    odometer = Column(Float, default=0.0)
    status = Column(Enum(VehicleStatus), default=VehicleStatus.AVAILABLE)
    acquisition_cost = Column(Float)
    
    trips = relationship("Trip", back_populates="vehicle")
    maintenance_logs = relationship("MaintenanceLog", back_populates="vehicle")
    fuel_logs = relationship("FuelLog", back_populates="vehicle")

class Driver(Base):
    __tablename__ = "drivers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    license_number = Column(String, unique=True, index=True)
    license_category = Column(Enum(VehicleType))
    license_expiry = Column(Date)
    safety_score = Column(Float, default=100.0)
    status = Column(Enum(DriverStatus), default=DriverStatus.OFF_DUTY)
    
    trips = relationship("Trip", back_populates="driver")

class Trip(Base):
    __tablename__ = "trips"
    id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"))
    driver_id = Column(Integer, ForeignKey("drivers.id"))
    cargo_weight = Column(Float)
    origin = Column(String)
    destination = Column(String)
    status = Column(Enum(TripStatus), default=TripStatus.DRAFT)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    
    vehicle = relationship("Vehicle", back_populates="trips")
    driver = relationship("Driver", back_populates="trips")

class MaintenanceLog(Base):
    __tablename__ = "maintenance_logs"
    id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"))
    service_type = Column(String)
    description = Column(String)
    cost = Column(Float)
    service_date = Column(Date)
    next_due_date = Column(Date)
    
    vehicle = relationship("Vehicle", back_populates="maintenance_logs")

class FuelLog(Base):
    __tablename__ = "fuel_logs"
    id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"))
    liters = Column(Float)
    cost = Column(Float)
    date = Column(Date)
    odometer_reading = Column(Float)
    
    vehicle = relationship("Vehicle", back_populates="fuel_logs")
