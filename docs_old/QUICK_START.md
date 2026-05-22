# QUICK START GUIDE - Property Management ERP

This is a condensed version of setup. See SETUP_INSTRUCTIONS.md for detailed steps.

---

## 📁 Project Structure Created

✅ **Complete monorepo with:**
- `/frontend` - React 18 + Vite + Tailwind CSS
- `/backend` - Node.js + Express + TypeScript
- `/docs` - Comprehensive documentation

---

## 🚀 Quick Setup (Windows)

### Phase 1: Database (5 minutes)

```bash
# Option A: Using Docker Compose (Recommended)
cd d:\MY_ERP
docker-compose up -d

# Option B: Manual PostgreSQL
psql -U postgres
CREATE DATABASE property_erp_db;
CREATE USER erp_user WITH PASSWORD 'secure_password_123';
GRANT ALL PRIVILEGES ON DATABASE property_erp_db TO erp_user;
```

### Phase 2: Backend Setup (10 minutes)

```bash
cd d:\MY_ERP\backend

# Install dependencies
npm install express cors dotenv bcrypt jsonwebtoken uuid sequelize pg
npm install --save-dev typescript @types/node @types/express nodemon ts-node jest

# Copy environment file
copy .env.example .env
# Edit .env with your database credentials

# Run migrations
npm run migrate

# Run seeds
npm run seed

# Start server
npm run dev
# Expected: ✓ Server running at http://localhost:5000
```

### Phase 3: Frontend Setup (8 minutes)

```bash
cd d:\MY_ERP\frontend

# Install dependencies
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Copy environment file
copy .env.example .env

# Start dev server
npm run dev
# Expected: ✓ Local: http://localhost:5173
```

### Phase 4: Verify Everything Works

```bash
# Terminal 1: Backend running on port 5000
# Terminal 2: Frontend running on port 5173

# Test backend (in another terminal)
curl http://localhost:5000/health
# Expected: {"status":"OK","timestamp":"..."}

# Open browser
http://localhost:5173
# You should see the Vite welcome page
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Project overview and features |
| `DATABASE_SCHEMA.md` | Complete database design with 12 tables, triggers, and ERD |
| `RBAC_SETUP.md` | Role-based access control implementation guide |
| `SETUP_INSTRUCTIONS.md` | Detailed step-by-step setup (16K guide) |
| `API_DOCUMENTATION.md` | Complete API endpoints reference (100+ endpoints) |
| `FRONTEND_STRUCTURE.md` | React component organization and patterns |
| `BACKEND_STRUCTURE.md` | Node.js services, controllers, and middleware |
| `docker-compose.yml` | PostgreSQL Docker configuration |

---

## 🎯 Key Features Implemented in Architecture

### ✅ Database Design
- **12 core tables** with proper relationships
- **PropertyID**: 6-digit auto-generated with UNIQUE constraint
- **Triggers**: Automatic timestamp updates, PropertyID generation
- **Transactions**: Serializable isolation for critical operations
- **Audit Trail**: Complete allocation_logs table for compliance

### ✅ RBAC System
- **6 predefined roles**: Super Admin, Admin, Employee (Lottery/Auction/FCFS), Applicant
- **Fine-grained permissions**: 15+ permissions per module
- **Role-Permission mapping**: Junction tables for flexibility
- **Frontend guards**: ProtectedRoute component for route protection
- **Backend enforcement**: Middleware-based permission checks

### ✅ Lottery Module
- Applicants apply with documents
- Admin executes draw (transaction-safe)
- Automatic allotment to winners
- Reserve allocation support

### ✅ Auction Module
- Property bidding with base price
- Real-time bid management
- Auto-close at end time
- Winner selection

### ✅ FCFS Module
- Real-time property availability
- Instant booking on payment
- Pessimistic locking to prevent overbooking
- Payment verification integration

### ✅ Direct Allotment
- Simple property-to-allottee assignment
- Bulk allotment support
- Manual admin control

---

## 🛠️ Tech Stack Decision Made

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | React 18 + Vite + Tailwind CSS | Modern, fast, SPA capability |
| Backend | Node.js + Express + TypeScript | Type-safe, fast, event-driven |
| Database | PostgreSQL | Strong transaction support, JSONB, Triggers |
| ORM | Sequelize | Good migration support, relationship handling |
| Auth | JWT + Bcrypt | Stateless, secure, scalable |
| State | Zustand (Frontend) | Lightweight, no boilerplate |

---

## 📋 Next Steps After Setup

### 1. Create Models (Backend)
- Implement all 12 models in `backend/src/models/`
- Set up associations between models
- Add custom methods (hasPermission, etc.)

### 2. Create Routes & Controllers
- Implement API routes for each module
- Create controllers with business logic
- Add input validation

### 3. Implement Services
- Business logic layer separating data and API
- Transaction handling for critical operations
- Error handling and logging

### 4. Build React Components
- Auth module (Login, Register)
- Dashboard with sidebar navigation
- Scheme management (Create, List, Edit)
- Lottery, Auction, FCFS, Direct Allotment modules
- RBAC management interface

### 5. Testing & Deployment
- Unit tests for services and utils
- Integration tests for API endpoints
- Frontend component tests
- Production build and deployment

---

## 🔑 Critical Implementation Points

### Database
```sql
-- PropertyID generation via trigger (automatic)
-- Runs BEFORE INSERT on properties table
-- Auto-assigns 6-digit unique ID

-- Transactions for critical operations
BEGIN TRANSACTION (SERIALIZABLE);
-- Lottery draw: Lock applicants → Create allottees → Update properties
COMMIT;
```

### Backend Security
```typescript
// JWT verification on every request
// Permission check middleware
// Password hashing with Bcrypt (10 rounds)
// Input validation on all endpoints
// SQL injection prevention via ORM
```

### Frontend Protection
```typescript
// ProtectedRoute component checks:
// 1. Is user logged in? (token in localStorage)
// 2. Does user have required permission?
// 3. Allow access only if both pass

// Conditional UI rendering based on permissions
{hasPermission('lottery', 'execute_draw') && (
  <ExecuteDrawButton />
)}
```

---

## 📊 Database Relationships (ER Summary)

```
users ──────── user_roles ──────── roles ──────── role_permissions ──────── permissions
  │
  ├─ applicants ──── applicant_id ──── allottees ──── property_id ──── properties
  │
  └─ creates schemes (created_by)

schemes ────── properties ────── allottees
   │
   ├─ applicants
   │
   └─ lottery_draws OR auction_bids

allocation_logs (audit trail for all operations)
```

---

## 🧪 Testing Scenarios

### Test Lottery Module
1. Create lottery scheme
2. Add properties to scheme
3. Create applicants
4. Execute draw
5. Verify allottees created
6. Check allocation logs

### Test FCFS Module
1. Create FCFS scheme
2. List available properties
3. Place booking (should succeed)
4. Try to book same property (should fail with 409 Conflict)
5. Verify pessimistic locking worked

### Test RBAC
1. Create admin user with 'Employee - Lottery' role
2. Try to access auction routes (should get 403)
3. Login with different role
4. Verify different sidebar menu
5. Check API permission enforcement

---

## 🐛 Troubleshooting

### PostgreSQL Connection Issues
```bash
# Check if running
psql -U postgres -c "SELECT version();"

# Verify credentials in .env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=property_erp_db
DB_USER=erp_user

# Reset database
dropdb property_erp_db
createdb property_erp_db
```

### Port Conflicts
```bash
# Check if port is in use
netstat -ano | findstr :5000
netstat -ano | findstr :5173

# Kill process (replace PID)
taskkill /PID 1234 /F

# Or use different port in .env
PORT=5001
```

### Dependencies Issues
```bash
# Clear cache and reinstall
cd backend
rm -r node_modules package-lock.json
npm install

cd ../frontend
rm -r node_modules package-lock.json
npm install
```

---

## 📞 API Health Check

```bash
# Backend health
curl http://localhost:5000/health

# Expected response:
# {"status":"OK","timestamp":"2026-05-21T11:41:34.213Z"}

# Login (get token)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Use token in subsequent requests
curl http://localhost:5000/api/schemes \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📖 Documentation Hierarchy

```
1. README.md (This overview)
   ↓
2. SETUP_INSTRUCTIONS.md (Step-by-step setup)
   ↓
3. DATABASE_SCHEMA.md (Table definitions)
   ↓
4. RBAC_SETUP.md (Permission system)
   ↓
5. API_DOCUMENTATION.md (All endpoints)
   ↓
6. FRONTEND_STRUCTURE.md (React architecture)
   ↓
7. BACKEND_STRUCTURE.md (Node.js architecture)
```

---

## 🎓 Learning Resources

- **PostgreSQL Transactions**: https://www.postgresql.org/docs/current/tutorial-transactions.html
- **Sequelize ORM**: https://sequelize.org/docs/v6/
- **React Patterns**: https://react.dev/learn
- **JWT Auth**: https://jwt.io/
- **Express Best Practices**: https://expressjs.com/en/advanced/best-practice-security.html

---

## ✨ Premium Features Ready to Implement

1. **WebSocket Support**: Real-time FCFS availability updates
2. **Email Notifications**: Applicant status updates
3. **SMS Alerts**: Lottery results, bidding updates
4. **Payment Gateway**: Razorpay/Stripe integration
5. **Document Upload**: File storage in S3/Cloudinary
6. **Advanced Search**: Elasticsearch for property search
7. **Analytics Dashboard**: Charts and metrics
8. **Multi-tenancy**: Multiple property groups
9. **Mobile App**: React Native version
10. **API Rate Limiting**: Prevent abuse

---

## 🎉 You're Ready!

All architecture is designed and documented. Now:

1. ✅ Database schema ready
2. ✅ RBAC system defined
3. ✅ API routes planned
4. ✅ Component structure outlined
5. 📝 Ready to start coding!

**Next: Start implementing services and controllers following the guides above.**

Good luck! 🚀

