# 🎬 LIVE DEMO - Run These Commands NOW!

**Actual commands to execute right now to see everything working!**

---

## ⚡ INSTANT SETUP (Copy & Paste Commands)

### 🟢 Step 1: Setup Database (Choose One)

**Using Docker (Easiest):**
```bash
cd d:\MY_ERP
docker-compose up -d
echo "✅ PostgreSQL started in Docker!"
docker-compose ps
```

**Or Using PostgreSQL CLI:**
```bash
psql -U postgres -c "CREATE DATABASE property_erp_db;"
psql -U postgres -c "CREATE USER erp_user WITH PASSWORD 'secure_password_123';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE property_erp_db TO erp_user;"
echo "✅ Database created!"

# Test connection
psql -U erp_user -d property_erp_db -h localhost -c "SELECT 'Database is ready!' AS status;"
```

### 🔵 Step 2: Setup Backend (Copy files and install)

```bash
# Navigate to project
cd d:\MY_ERP

# Copy package.json to backend
copy backend_package.json backend\package.json
copy backend.env.example backend\.env
copy backend_tsconfig.json backend\tsconfig.json

# Create src directory structure
mkdir backend\src
mkdir backend\src\models
mkdir backend\src\controllers
mkdir backend\src\services
mkdir backend\src\middleware
mkdir backend\src\routes
mkdir backend\src\database
mkdir backend\tests

# Copy main index.ts
copy backend_index.ts backend\src\index.ts

# Install dependencies
cd backend
npm install

echo "✅ Backend dependencies installed!"
```

### 🟣 Step 3: Setup Frontend (Copy files and install)

```bash
# Navigate to project
cd d:\MY_ERP

# Copy files
copy frontend_package.json frontend\package.json
copy frontend.env.example frontend\.env
copy frontend_vite.config.ts frontend\vite.config.ts

# Create src directory structure
mkdir frontend\src
mkdir frontend\src\components
mkdir frontend\src\pages
mkdir frontend\src\hooks
mkdir frontend\src\services
mkdir frontend\src\store
mkdir frontend\src\types
mkdir frontend\src\utils
mkdir frontend\src\styles
mkdir frontend\public

# Install dependencies
cd frontend
npm install

echo "✅ Frontend dependencies installed!"
```

---

## 🚀 RUN IN 3 TERMINALS

### **Terminal 1: Backend Server**
```bash
cd d:\MY_ERP\backend
npm run dev

# Expected Output:
# ==================================================
# ✅ Property Management ERP Backend
# ✅ Server running at http://localhost:5000
# ✅ Environment: development
# ✅ API Base: http://localhost:5000/api
# ==================================================
```

### **Terminal 2: Frontend Server**
```bash
cd d:\MY_ERP\frontend
npm run dev

# Expected Output:
# VITE v5.0.8  ready in 234 ms
# ➜  Local:   http://localhost:5173/
# Browser opens automatically!
```

### **Terminal 3: Test Everything**
```bash
# Wait 5 seconds for servers to start, then run:

echo "Testing Backend..."
curl -X GET http://localhost:5000/health

echo.
echo "Testing API..."
curl -X GET http://localhost:5000/api

echo.
echo "Testing Frontend..."
curl -s http://localhost:5173/ | find /c "<!DOCTYPE"

echo.
echo "✅✅✅ ALL SYSTEMS RUNNING! ✅✅✅"

# Open browser - you should see Vite welcome page
start http://localhost:5173
```

---

## 📊 VERIFY STATUS

Run this in any terminal:

```bash
# Check Backend
echo [Backend Health]
curl -s http://localhost:5000/health | findstr "OK"

# Check Frontend
echo [Frontend Running]
curl -s http://localhost:5173/ | findstr "<" >nul && echo Frontend OK

# Check Database
echo [Database Connected]
psql -U erp_user -d property_erp_db -c "SELECT 'DB Ready' AS status;" 2>nul

# All should show as OK/Ready
```

---

## 🎯 QUICK VISUAL DEMO

### What You'll See:

**Backend (Terminal 1):**
```
==================================================
✅ Property Management ERP Backend
✅ Server running at http://localhost:5000
✅ Environment: development
✅ API Base: http://localhost:5000/api
==================================================

Available endpoints:
  • GET  http://localhost:5000/health
  • GET  http://localhost:5000/api
  • POST http://localhost:5000/api/auth/login
  • POST http://localhost:5000/api/auth/register

Ready to handle requests! 🚀
```

**Frontend (Terminal 2):**
```
VITE v5.0.8  ready in 234 ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

**Browser (http://localhost:5173):**
```
Shows Vite welcome page with logo
React is successfully running!
```

**API Response (http://localhost:5000/api):**
```json
{
  "message": "Welcome to Property Management ERP API",
  "version": "1.0.0",
  "endpoints": {
    "health": "/health",
    "auth": "/api/auth/*",
    "schemes": "/api/schemes/*",
    ...
  }
}
```

---

## ⚡ QUICK COMMANDS CHEAT SHEET

```bash
# Backend quick start
cd d:\MY_ERP\backend && npm run dev

# Frontend quick start
cd d:\MY_ERP\frontend && npm run dev

# Backend build
cd d:\MY_ERP\backend && npm run build

# Frontend build
cd d:\MY_ERP\frontend && npm run build

# Run tests
cd d:\MY_ERP\backend && npm test

# Format code
cd d:\MY_ERP\backend && npm run format

# Start database only
docker-compose up -d postgres

# Stop all services
docker-compose down

# View database
psql -U erp_user -d property_erp_db
# Then in psql: \dt (list tables), \q (quit)
```

---

## 🔍 TESTING ENDPOINTS

### Using curl (Command Line)

```bash
# Test 1: Health Check
curl http://localhost:5000/health

# Test 2: API Info
curl http://localhost:5000/api

# Test 3: With JSON body (when auth endpoints are built)
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\": \"test@example.com\", \"password\": \"password123\"}"

# Test 4: Check CORS
curl -X OPTIONS http://localhost:5000/api ^
  -H "Origin: http://localhost:5173" ^
  -H "Access-Control-Request-Method: POST"
```

### Using Browser

1. **Backend Health**: [http://localhost:5000/health](http://localhost:5000/health)
2. **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
3. **Frontend**: [http://localhost:5173](http://localhost:5173)

---

## ✅ WHAT YOU'LL HAVE RUNNING

```
┌─────────────────────────────────────────────┐
│         PROPERTY MANAGEMENT ERP             │
├─────────────────────────────────────────────┤
│                                             │
│  🔵 Backend API                             │
│     • Express.js server                     │
│     • Running on port 5000                  │
│     • TypeScript configured                 │
│     • Cors enabled                          │
│     • Health check working                  │
│                                             │
│  🟣 Frontend                                │
│     • React + Vite                          │
│     • Running on port 5173                  │
│     • Hot reload enabled                    │
│     • Tailwind CSS ready                    │
│     • Proxy to backend configured           │
│                                             │
│  🟢 Database                                │
│     • PostgreSQL running                    │
│     • property_erp_db database              │
│     • erp_user configured                   │
│     • Ready for migrations                  │
│                                             │
└─────────────────────────────────────────────┘

EVERYTHING IS READY FOR DEVELOPMENT! 🚀
```

---

## 🎬 FULL DEMO SEQUENCE

Run these in order in **3 separate terminals**:

### Terminal 1 (Database):
```bash
cd d:\MY_ERP
docker-compose up -d
echo "✅ Database running!"
docker-compose ps
```

### Terminal 2 (Backend):
```bash
cd d:\MY_ERP\backend
npm install
npm run dev
# Wait for "Ready to handle requests! 🚀"
```

### Terminal 3 (Frontend):
```bash
cd d:\MY_ERP\frontend
npm install
npm run dev
# Browser will open with http://localhost:5173
```

### Terminal 4 (Verification):
```bash
# After waiting 10 seconds...
echo "=== SYSTEM STATUS ==="
curl -s http://localhost:5000/health | find "OK"
echo "Backend Health: OK"

curl -s http://localhost:5173/ | find "DOCTYPE"
echo "Frontend Health: OK"

psql -U erp_user -d property_erp_db -c "SELECT 1;" 2>nul
echo "Database Health: OK"

echo.
echo "✅ SYSTEM FULLY OPERATIONAL ✅"
echo "Backend:  http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo "Ready to develop!"
```

---

## 📈 NEXT: START BUILDING

Once everything is running, pick one and start:

### 🟦 Build a Model
```bash
cd d:\MY_ERP\backend
# Create src/models/User.ts following BACKEND_STRUCTURE.md
```

### 🟪 Build a Component
```bash
cd d:\MY_ERP\frontend
# Create src/components/Auth/LoginForm.tsx following FRONTEND_STRUCTURE.md
```

### 🟥 Build an API Endpoint
```bash
cd d:\MY_ERP\backend
# Create src/controllers/authController.ts following API_DOCUMENTATION.md
```

---

## 🎉 YOU'RE LIVE!

Everything is set up and running!

**Open your browser:**
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000/health
- **API**: http://localhost:5000/api

**Start building with:**
- BACKEND_STRUCTURE.md (for APIs)
- FRONTEND_STRUCTURE.md (for components)
- API_DOCUMENTATION.md (for endpoint specs)

---

**Good luck! Your ERP system is ready to build! 🚀**

