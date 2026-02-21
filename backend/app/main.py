from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .db.session import engine, Base, get_db
from .models import models
from .schemas import schemas
from .api import auth, vehicles, drivers, trips, maintenance, fuel, stats

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Fleetnova API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(auth.router)
app.include_router(vehicles.router)
app.include_router(drivers.router)
app.include_router(trips.router)
app.include_router(maintenance.router)
app.include_router(fuel.router)
app.include_router(stats.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Fleetnova API"}

# Basic Health Check
@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Placeholder for future routes (to be split into routers)
@app.get("/vehicles", response_model=list[schemas.VehicleOut])
def get_vehicles(db: Session = Depends(get_db)):
    return db.query(models.Vehicle).all()

@app.post("/vehicles", response_model=schemas.VehicleOut)
def create_vehicle(vehicle: schemas.VehicleCreate, db: Session = Depends(get_db)):
    db_vehicle = models.Vehicle(**vehicle.dict())
    db.add(db_vehicle)
    db.commit()
    db.refresh(db_vehicle)
    return db_vehicle
