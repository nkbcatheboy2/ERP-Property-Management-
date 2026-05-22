# 🚀 SETUP DEMO - Run the Property Management ERP RIGHT NOW!

Complete step-by-step guide to get the system up and running in **minutes**.

---

## ⚡ EXPRESS SETUP (5 minutes)

### Step 1: Copy Files to Their Directories

```bash
# Backend - Copy files from MY_ERP root to backend folder
cd d:\MY_ERP

# Backend files
copy backend_package.json backend\package.json
copy backend.env.example backend\.env
copy backend_index.ts backend\src\index.ts
copy backend_tsconfig.json backend\tsconfig.json

# Frontend files
copy frontend_package.json frontend\package.json
copy frontend.env.example frontend\.env
copy frontend_vite.config.ts frontend\vite.config.ts
```

### Step 2: Start PostgreSQL Database

**Option A: Using Docker (Recommended)**
```bash
cd d:\MY_ERP
docker-compose up -d
# Wait 10 seconds for database to be ready
```

**Option B: Using PostgreSQL CLI**
```bash
# If PostgreSQL is installed
psql -U postgres
CREATE DATABASE property_erp_db;
CREATE USER erp_user WITH PASSWORD 'secure_password_123';
GRANT ALL PRIVILEGES ON DATABASE property_erp_db TO erp_user;
\q
```

**Verify database is running:**
```bash
psql -U erp_user -d property_erp_db -h localhost -c "SELECT 1;"
# Output should show: ?column? | 1
```

---

## 💻 BACKEND SETUP (3 minutes)

### Terminal 1: Backend Server

```bash
# Navigate to backend
cd d:\MY_ERP\backend

# Install dependencies
npm install

# Start development server
npm run dev

# Expected Output:
# ==================================================
# ✅ Property Management ERP Backend
# ✅ Server running at http://localhost:5000
# ✅ Environment: development
# ✅ API Base: http://localhost:5000/api
# ==================================================
```

**Keep this terminal running!**

### Test Backend Health

Open **new terminal**:
```bash
# Test the server is running
curl http://localhost:5000/health

# Expected Response:
# {
#   "status": "OK",
#   "timestamp": "2026-05-21T12:28:07.309Z",
#   "message": "✅ Property Management ERP Backend is running!"
# }

# Great! Backend is working! ✅
```

---

## 🎨 FRONTEND SETUP (3 minutes)

### Terminal 2: Frontend Server

```bash
# Open NEW terminal (keep backend running in Terminal 1)
cd d:\MY_ERP\frontend

# Install dependencies
npm install

# Start dev server
npm run dev

# Expected Output:
# VITE v5.0.8  ready in 234 ms
# ➜  Local:   http://localhost:5173/

# The browser should open automatically!
```

**Keep this terminal running!**

---

## ✅ VERIFICATION (1 minute)

### Check Both Services Running

```bash
# Terminal 3: Verify everything

# Check Backend Health
curl http://localhost:5000/health
# Should return OK

# Check Backend API Root
curl http://localhost:5000/api
# Should return API information

# Check Frontend is serving
curl http://localhost:5173/
# Should return HTML

echo "✅ All services running!"
```

---

## 📊 CURRENT STATUS

```
✅ BACKEND
   • Running on: http://localhost:5000
   • Health: http://localhost:5000/health
   • API: http://localhost:5000/api
   • Database: Connected (ready for models)

✅ FRONTEND  
   • Running on: http://localhost:5173
   • Vite Dev Server: Active
   • Hot Module Reload: Enabled
   • API Proxy: Configured

✅ DATABASE
   • PostgreSQL: Running on localhost:5432
   • Database: property_erp_db
   • User: erp_user
   • Status: Ready for migrations
```

---

## 🎯 WHAT'S NEXT (Start Building!)

### Backend Development
```bash
cd d:\MY_ERP\backend

# Create first model
cat > src/models/User.ts << 'EOF'
import { Model, DataTypes, Sequelize } from 'sequelize';

export class User extends Model {
  public id!: string;
  public email!: string;
  public name!: string;
}

export default (sequelize: Sequelize) => {
  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    name: DataTypes.STRING,
  }, {
    sequelize,
    tableName: 'users',
  });
  
  return User;
};
EOF

# Create first controller
cat > src/controllers/authController.ts << 'EOF'
import { Request, Response } from 'express';

export const authController = {
  login: (req: Request, res: Response) => {
    res.json({ message: 'Login endpoint ready!' });
  },
  register: (req: Request, res: Response) => {
    res.json({ message: 'Register endpoint ready!' });
  },
};
EOF
```

### Frontend Development
```bash
cd d:\MY_ERP\frontend

# Create first component
mkdir -p src/components/Auth
cat > src/components/Auth/LoginForm.tsx << 'EOF'
import React from 'react';

export const LoginForm: React.FC = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">Login</h2>
      <input type="email" placeholder="Email" className="border p-2 m-2" />
      <input type="password" placeholder="Password" className="border p-2 m-2" />
      <button className="bg-blue-500 text-white px-4 py-2 m-2">Login</button>
    </div>
  );
};
EOF
```

---

## 🧪 API TESTING

### Using curl (Command Line)

```bash
# Test health endpoint
curl -X GET http://localhost:5000/health

# Test API root
curl -X GET http://localhost:5000/api

# Test CORS from frontend
curl -X GET http://localhost:5000/api \
  -H "Origin: http://localhost:5173" \
  -H "Content-Type: application/json"
```

### Using Postman

1. Download [Postman](https://www.postman.com/downloads/)
2. Create new request:
   - **URL**: `http://localhost:5000/api`
   - **Method**: GET
   - Click **Send**
3. Should return API information

### Using Thunder Client (VS Code)

1. Install Thunder Client extension
2. Click Thunder Client icon
3. Create new request:
   - **URL**: `http://localhost:5000/health`
   - **Method**: GET
4. Click Send

---

## 🛠️ COMMON ISSUES & FIXES

### Port Already in Use

```bash
# Windows: Find what's using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID)
taskkill /PID 1234 /F

# Or use different port - edit .env
PORT=5001
```

### Database Connection Error

```bash
# Check if PostgreSQL is running
psql -U postgres -c "SELECT version();"

# If using Docker
docker-compose ps
docker-compose logs postgres

# Reset database
dropdb property_erp_db
createdb property_erp_db
```

### npm Dependencies Issues

```bash
# Clear cache and reinstall
rm -r node_modules package-lock.json
npm install

# Or use yarn
yarn install
```

---

## 📁 FILE STRUCTURE (Now Created)

```
d:\MY_ERP\
├── backend/
│   ├── src/
│   │   └── index.ts          ← Main server file
│   ├── package.json          ← Dependencies
│   ├── tsconfig.json         ← TypeScript config
│   └── .env                  ← Environment variables
│
├── frontend/
│   ├── src/
│   ├── package.json          ← Dependencies
│   ├── vite.config.ts        ← Vite config
│   └── .env                  ← Environment variables
│
├── docker-compose.yml        ← PostgreSQL container
├── SETUP_DEMO.md            ← This file!
└── [Other documentation files]
```

---

## 🚀 FULL WORKFLOW

### Terminal 1: Database
```bash
cd d:\MY_ERP
docker-compose up -d
# ✅ PostgreSQL running
```

### Terminal 2: Backend
```bash
cd d:\MY_ERP\backend
npm install
npm run dev
# ✅ Server running on :5000
```

### Terminal 3: Frontend
```bash
cd d:\MY_ERP\frontend
npm install
npm run dev
# ✅ Browser opens on :5173
```

### Terminal 4: Verification
```bash
# Test everything
curl http://localhost:5000/health
curl http://localhost:5173/

echo "✅ ALL SYSTEMS GO!"
```

---

## 📊 QUICK STATUS CHECK

```bash
# All in one command - check if everything is running
echo "Checking Backend..."   && curl -s http://localhost:5000/health | grep -q "OK" && echo "✅ Backend OK" || echo "❌ Backend DOWN"
echo "Checking Frontend..."  && curl -s http://localhost:5173/ | grep -q "html" && echo "✅ Frontend OK" || echo "❌ Frontend DOWN"
echo "Checking Database..."  && psql -U erp_user -d property_erp_db -c "SELECT 1;" 2>/dev/null && echo "✅ Database OK" || echo "❌ Database DOWN"
```

---

## 🎓 WHAT YOU HAVE NOW

✅ **Working Backend API**
- Express server running
- TypeScript support
- Cors enabled
- Environment config ready
- Health check endpoint working

✅ **Working Frontend**
- React + Vite running
- Hot Module Reload enabled
- Tailwind CSS ready
- API proxy configured
- TypeScript support

✅ **Working Database**
- PostgreSQL running
- Database created
- User configured
- Ready for migrations

✅ **Ready to Build**
- Create models
- Build APIs
- Design components
- Connect everything

---

## 🎉 YOU'RE LIVE!

```
🎯 BACKEND:  http://localhost:5000
🎯 FRONTEND: http://localhost:5173
🎯 DATABASE: postgresql://erp_user:***@localhost:5432/property_erp_db

All systems ready for development! 🚀
```

---

## 📞 NEXT STEPS

1. ✅ Keep backend running: `npm run dev`
2. ✅ Keep frontend running: `npm run dev`
3. 📝 **Start building features** using BACKEND_STRUCTURE.md & FRONTEND_STRUCTURE.md
4. 🧪 Test APIs using the examples in API_DOCUMENTATION.md
5. 🎨 Build React components following FRONTEND_STRUCTURE.md

---

**Everything is ready! Start coding! 💪🚀**

