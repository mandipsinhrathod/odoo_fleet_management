from sqlalchemy.orm import Session
from app.db.session import SessionLocal, engine
from app.models import models
from datetime import datetime, timedelta
import random

def seed_db():
    db = SessionLocal()
    
    # 1. Clear existing data (except admin user)
    db.query(models.FuelLog).delete()
    db.query(models.MaintenanceLog).delete()
    db.query(models.Trip).delete()
    db.query(models.Driver).delete()
    db.query(models.Vehicle).delete()
    # Keep the user table intact to preserve the admin login

    # 2. Seed Vehicles (15 total)
    vehicle_types = [(models.VehicleType.TRUCK, 15000), (models.VehicleType.VAN, 3500), (models.VehicleType.BIKE, 150)]
    vehicle_names = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Echo', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omni']
    vehicles = []
    
    for i in range(15):
        v_type, cap = random.choice(vehicle_types)
        v = models.Vehicle(
            name=f"Unit {vehicle_names[i]}",
            plate=f"FLT-{1000+i}",
            vehicle_type=v_type,
            capacity=cap + random.randint(-50, 500),
            odometer=random.randint(100, 50000),
            status=random.choice([models.VehicleStatus.AVAILABLE, models.VehicleStatus.AVAILABLE, models.VehicleStatus.AVAILABLE, models.VehicleStatus.ON_TRIP, models.VehicleStatus.IN_SHOP]),
            acquisition_cost=random.randint(2000, 150000)
        )
        db.add(v)
        vehicles.append(v)
    db.commit()

    # 3. Seed Drivers (15 total)
    first_names = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph']
    last_names = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson']
    drivers = []
    
    for i in range(15):
        d = models.Driver(
            name=f"{first_names[i]} {last_names[i]}",
            license_number=f"DL-{900000+i}",
            license_category=random.choice([models.VehicleType.TRUCK, models.VehicleType.VAN, models.VehicleType.BIKE]),
            license_expiry=datetime.now() + timedelta(days=random.randint(100, 1000)),
            safety_score=random.uniform(75.0, 100.0),
            status=random.choice([models.DriverStatus.ON_DUTY, models.DriverStatus.ON_DUTY, models.DriverStatus.OFF_DUTY, models.DriverStatus.ON_TRIP])
        )
        db.add(d)
        drivers.append(d)
    db.commit()

    # 4. Seed Trips (20 total)
    cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose']
    
    # Reload vehicles and drivers to get IDs
    vehicles = db.query(models.Vehicle).all()
    drivers = db.query(models.Driver).all()

    for i in range(20):
        v = random.choice(vehicles)
        d = random.choice(drivers)
        origin = random.choice(cities)
        dest = random.choice([c for c in cities if c != origin])
        
        trip = models.Trip(
            vehicle_id=v.id,
            driver_id=d.id,
            cargo_weight=random.uniform(10.0, v.capacity),
            origin=origin,
            destination=dest,
            status=random.choice([models.TripStatus.DRAFT, models.TripStatus.DISPATCHED, models.TripStatus.COMPLETED]),
            created_at=datetime.now() - timedelta(days=random.randint(0, 30))
        )
        db.add(trip)
    db.commit()

    # 5. Seed Maintenance Logs (15 total)
    service_types = ['Oil Change', 'Tire Rotation', 'Brake Inspection', 'Engine Tune-up', 'Transmission Flush']
    
    for i in range(15):
        v = random.choice(vehicles)
        m = models.MaintenanceLog(
            vehicle_id=v.id,
            service_type=random.choice(service_types),
            description=f"Standard {random.choice(['preventative', 'scheduled', 'emergency'])} service",
            cost=random.uniform(50.0, 1500.0),
            service_date=datetime.now() - timedelta(days=random.randint(1, 100)),
            next_due_date=datetime.now() + timedelta(days=random.randint(30, 180))
        )
        db.add(m)
    db.commit()

    # 6. Seed Fuel Logs (30 total)
    for i in range(30):
        v = random.choice(vehicles)
        liters = random.uniform(20.0, 200.0)
        f = models.FuelLog(
            vehicle_id=v.id,
            liters=liters,
            cost=liters * random.uniform(1.2, 1.8),
            date=datetime.now() - timedelta(days=random.randint(1, 60)),
            odometer_reading=v.odometer - random.randint(100, 5000)
        )
        db.add(f)
    db.commit()

    print("Database seeded successfully with minimum 10 entries per entity!")
    db.close()

if __name__ == "__main__":
    seed_db()
