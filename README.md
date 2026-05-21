# Property Management ERP System

A comprehensive enterprise resource planning system for property management with support for multiple allocation modes: Lottery, Auction, FCFS (First Come First Serve), and Direct Allotment.

## Stack
- **Frontend**: React 18 + Vite + Tailwind CSS + React Router
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT + Bcrypt

## Project Structure
```
MY_ERP/
├── frontend/                 # React Vite application
│   ├── src/
│   │   ├── components/      # Reusable components by module
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API service calls
│   │   ├── store/           # State management (Redux/Zustand)
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Utility functions
│   │   └── styles/          # Tailwind & global styles
│   ├── public/              # Static assets
│   └── package.json
│
├── backend/                 # Express server
│   ├── src/
│   │   ├── models/          # Database models (Sequelize)
│   │   ├── controllers/     # Route handlers
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth, RBAC, error handling
│   │   ├── services/        # Business logic
│   │   ├── database/        # Migrations, seeds, triggers
│   │   ├── config/          # Database & app config
│   │   ├── types/           # TypeScript interfaces
│   │   └── validators/      # Input validation
│   ├── tests/               # Jest tests
│   └── package.json
│
├── docs/                    # Documentation
│   ├── DATABASE_SCHEMA.md   # Database design & ERD
│   ├── API_DOCUMENTATION.md # API endpoints reference
│   ├── RBAC_SETUP.md        # Role & permission guide
│   └── SETUP_INSTRUCTIONS.md # Development setup
│
├── docker-compose.yml       # PostgreSQL container
└── .gitignore
```

## Quick Start

### 1. Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### 2. Database Setup
```bash
# Create PostgreSQL database
createdb property_erp_db

# Start PostgreSQL (using docker-compose)
docker-compose up -d
```

### 3. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run migrate  # Run migrations
npm run seed    # Seed initial data
npm run dev     # Start server (http://localhost:5000)
```

### 4. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev     # Start dev server (http://localhost:5173)
```

## Module Features

### 1. Lottery Management
- Admin creates lottery schemes
- Applicants apply for properties
- Automated lottery draw with transaction support
- Fair allocation based on draw results

### 2. Auction Management
- Properties listed with base price
- Real-time bidding interface
- Auto-close at end time with highest bidder selection
- Transaction-safe bid management

### 3. FCFS (First Come First Serve)
- Real-time property booking
- Instant lock on payment/submission
- Available property inventory
- Booking confirmation

### 4. Direct Allotment
- Simple property to allottee assignment
- Manual allocation by admin
- Basic property and allottee management

## RBAC Features
- 5 default roles: Super Admin, Admin, Employee (Lottery), Employee (Auction), Employee (FCFS)
- Fine-grained permissions: read, write, edit, delete per module
- Role-based sidebar navigation in React
- Protected API routes with permission verification

## Key Technical Features
- **6-Digit PropertyID**: Auto-generated with DB constraint
- **Transaction Safety**: All critical operations wrapped in DB transactions
- **Advanced Search**: Filter by scheme, property, category, allottee
- **Audit Trail**: Complete allocation logs for compliance
- **Error Handling**: Comprehensive error handling at DB and API levels

## Development Workflow
1. Start with database migrations
2. Create API routes & controllers
3. Build React components with proper state management
4. Implement RBAC protection on routes
5. Add comprehensive tests

## Contributing
Follow the Git workflow documented in SETUP_INSTRUCTIONS.md

## License
Private - Property Management System
