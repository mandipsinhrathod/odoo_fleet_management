# Fleetnova: Modular Fleet & Logistics Management System

Fleetnova is a centralized, rule-based digital hub for optimizing fleet lifecycles, monitoring driver safety, and tracking financial performance.

## ⚙️ Tech Stack & Tools

### Frontend
- **Framework:** React.js 18 (Vite JS bundler)
- **Styling:** Tailwind CSS (utility-first corporate SaaS design system)
- **Animations:** Framer Motion (smooth page transitions and modular hover effects)
- **Icons:** Lucide React (clean, consistent enterprise iconography)
- **Visualizations:** Recharts (composable charting for Analytics)
- **Integrations:** Google Maps JavaScript API (Native routing intelligence)

### Backend
- **Framework:** FastAPI (High-performance Python 3 web framework)
- **Database:** SQLite (Relational Data persistence)
- **ORM:** SQLAlchemy (Object Relational Mapping)
- **Authentication:** JWT (JSON Web Tokens) with Passlib bcrypt hashing
- **Mock Data Generation:** Faker (Database seeding script)

## Getting Started

### Backend Setup
1. Navigate to the `backend` directory.
2. Create clinical virtual environment: `python -m venv venv`
3. Activate environment:
   - Windows: `venv\Scripts\activate`
4. Install dependencies: `pip install fastapi uvicorn sqlalchemy passlib[bcrypt] python-jose[cryptography] python-multipart`
5. Initialize the database: `python init_db.py`
6. Start the server: `uvicorn app.main:app --reload`

### Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install` (once Node is configured)
3. Start the dev server: `npm run dev`

## Project Structure
```
c:/Odoo/
├── backend/            # FastAPI Project
│   ├── app/
│   │   ├── api/        # API Routes
│   │   ├── db/         # Database connection
│   │   ├── models/     # SQLAlchemy models
│   │   ├── schemas/    # Pydantic schemas
│   │   └── main.py     # Entry point
│   └── fleetflow.db    # Local SQLite DB
└── frontend/           # React + Vite Project
    ├── src/
    │   ├── pages/      # Application Pages
    │   ├── components/ # Shared Components
    │   ├── App.jsx     # Main Routing
    │   └── main.jsx    # React Mount point
    ├── index.html
    └── tailwind.config.js
```

## Features
- **Vehicle Registry**: Complete asset management.
- **Trip Dispatcher**: Intelligent load validation.
- **Driver Performance**: Compliance tracking.
- **Maintenance Logs**: Automatic asset status management.
- **Financial Analytics**: ROI and fuel tracking.
