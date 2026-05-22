# Setup Instructions - Property Management ERP

Complete step-by-step guide to initialize the full-stack application.

---

## Prerequisites

### Required Software
- **Node.js**: v18.x or higher ([Download](https://nodejs.org))
- **npm**: v9.x or higher (comes with Node.js)
- **PostgreSQL**: v14.x or higher ([Download](https://www.postgresql.org/download))
- **Git**: v2.30+ ([Download](https://git-scm.com/downloads))

### Optional but Recommended
- **Docker & Docker Compose** (for PostgreSQL containerization)
- **VS Code** with extensions: ES7+, Tailwind CSS IntelliSense, Thunder Client
- **Postman** (for API testing)
- **pgAdmin** or **DBeaver** (for database inspection)

### Verification
```bash
# Check installations
node --version      # Should be v18+
npm --version       # Should be v9+
psql --version      # Should be v14+
git --version       # Should be v2.30+
```

---

## Phase 1: Database Setup

### Step 1.1: Create PostgreSQL Database

#### Option A: Using PostgreSQL CLI
```bash
# Open PostgreSQL terminal
psql -U postgres

# Create database and user
CREATE DATABASE property_erp_db;
CREATE USER erp_user WITH PASSWORD 'secure_password_123';
GRANT ALL PRIVILEGES ON DATABASE property_erp_db TO erp_user;

# Exit psql
\q
```

#### Option B: Using Docker Compose (Recommended)
```bash
# Navigate to project root
cd d:\MY_ERP

# Create docker-compose.yml in project root
# (File will be provided with Docker configuration)

# Start PostgreSQL container
docker-compose up -d

# Verify container is running
docker-compose ps

# Access database
docker-compose exec postgres psql -U erp_user -d property_erp_db
```

### Step 1.2: Verify Database Connection
```bash
# Test connection from command line
psql -U erp_user -d property_erp_db -h localhost

# You should see the psql prompt if successful
property_erp_db=#
```

---

## Phase 2: Backend Setup

### Step 2.1: Initialize Backend Project
```bash
cd d:\MY_ERP\backend

# Initialize Node.js project
npm init -y

# Install dependencies
npm install express cors dotenv bcrypt jsonwebtoken uuid
npm install sequelize pg pg-hstore

# Install dev dependencies
npm install --save-dev typescript @types/node @types/express nodemon ts-node
npm install --save-dev jest @types/jest ts-jest
npm install --save-dev eslint prettier
```

### Step 2.2: Create TypeScript Configuration
Create `backend/tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

### Step 2.3: Create Environment Configuration
Create `backend/.env`:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=property_erp_db
DB_USER=erp_user
DB_PASSWORD=secure_password_123
DB_LOGGING=false

# Server Configuration
NODE_ENV=development
PORT=5000
API_BASE_URL=http://localhost:5000

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_minimum_32_chars_1234567890
JWT_EXPIRE=24h

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760  # 10MB

# Email Configuration (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Logging
LOG_LEVEL=info
LOG_DIR=./logs
```

Copy to example:
```bash
cp backend/.env backend/.env.example
```

### Step 2.4: Create Database Configuration
Create `backend/src/config/database.ts`:
```typescript
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  dialect: 'postgres',
  logging: process.env.DB_LOGGING === 'true' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export default sequelize;
```

### Step 2.5: Create Main Server File
Create `backend/src/index.ts`:
```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Database connection
sequelize
  .authenticate()
  .then(() => {
    console.log('✓ Database connected successfully');
  })
  .catch((err) => {
    console.error('✗ Database connection error:', err);
    process.exit(1);
  });

// Start server
app.listen(PORT, () => {
  console.log(`✓ Server running at http://localhost:${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV}`);
});

export default app;
```

### Step 2.6: Update package.json Scripts
Edit `backend/package.json`:
```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "migrate": "ts-node src/database/migrations/run.ts",
    "seed": "ts-node src/database/seeders/run.ts",
    "test": "jest",
    "lint": "eslint src/**/*.ts",
    "format": "prettier --write src/**/*.ts"
  }
}
```

### Step 2.7: Test Backend Setup
```bash
cd d:\MY_ERP\backend

# Start development server
npm run dev

# Expected output:
# ✓ Server running at http://localhost:5000
# ✓ Database connected successfully

# Test health endpoint (in another terminal)
curl http://localhost:5000/health
# Response: {"status":"OK","timestamp":"..."}

# Keep server running for next steps
```

---

## Phase 3: Database Migrations

### Step 3.1: Create Migration Files
Create `backend/src/database/migrations/001_create_users_table.ts`:
```typescript
import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
  await queryInterface.createTable('users', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended'),
      defaultValue: 'active',
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  // Add indexes
  await queryInterface.addIndex('users', ['email']);
  await queryInterface.addIndex('users', ['status']);
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.dropTable('users');
}
```

Create `backend/src/database/migrations/002_create_roles_table.ts`:
```typescript
// Similar structure for roles, permissions, etc.
// (Detailed migration files will be provided in documentation)
```

### Step 3.2: Create Migration Runner
Create `backend/src/database/migrations/run.ts`:
```typescript
import sequelize from '../../config/database';
import * as migration001 from './001_create_users_table';
// Import other migrations

async function runMigrations() {
  try {
    console.log('Running migrations...');
    const queryInterface = sequelize.getQueryInterface();
    
    // Run migrations in order
    await migration001.up(queryInterface);
    // await migration002.up(queryInterface);
    // ... more migrations
    
    console.log('✓ All migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('✗ Migration error:', error);
    process.exit(1);
  }
}

runMigrations();
```

### Step 3.3: Run Migrations
```bash
cd d:\MY_ERP\backend

# Run all migrations
npm run migrate

# Expected output:
# Running migrations...
# ✓ All migrations completed successfully

# Verify in database
psql -U erp_user -d property_erp_db -c "\dt"

# Should show: users, roles, permissions, etc.
```

---

## Phase 4: Database Seeding

### Step 4.1: Create Seed Data
Create `backend/src/database/seeders/seed_roles_permissions.ts`:
```typescript
import sequelize from '../../config/database';

async function seedRolesAndPermissions() {
  try {
    const queryInterface = sequelize.getQueryInterface();
    
    // Seed roles
    await queryInterface.bulkInsert('roles', [
      {
        id: 'role_super_admin',
        name: 'Super Admin',
        roleType: 'super_admin',
        description: 'Full system access',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'role_admin',
        name: 'Admin',
        roleType: 'admin',
        description: 'Scheme and employee management',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // ... more roles
    ]);
    
    // Seed permissions
    await queryInterface.bulkInsert('permissions', [
      {
        id: 'perm_lottery_read',
        module: 'lottery',
        action: 'read',
        description: 'View lottery schemes',
        createdAt: new Date(),
      },
      // ... more permissions
    ]);
    
    console.log('✓ Roles and permissions seeded');
  } catch (error) {
    console.error('✗ Seeding error:', error);
    throw error;
  }
}

seedRolesAndPermissions();
```

### Step 4.2: Run Seeds
```bash
cd d:\MY_ERP\backend

npm run seed

# Expected output:
# ✓ Roles and permissions seeded
```

---

## Phase 5: Frontend Setup

### Step 5.1: Initialize Frontend Project
```bash
cd d:\MY_ERP\frontend

# Create Vite React app
npm create vite@latest . -- --template react-ts

# Install dependencies
npm install
npm install -D tailwindcss postcss autoprefixer
npm install -D @tailwindcss/forms @tailwindcss/typography

# Install UI & utilities
npm install react-router-dom axios zustand
npm install lucide-react clsx
```

### Step 5.2: Configure Tailwind CSS
```bash
cd d:\MY_ERP\frontend

# Initialize Tailwind
npx tailwindcss init -p
```

Create `frontend/tailwind.config.js`:
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e40af',
        secondary: '#7c3aed',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
```

### Step 5.3: Create Environment File
Create `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_NAME=Property Management ERP
```

### Step 5.4: Setup TypeScript Configuration
Create `frontend/tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "strict": true,
    "resolveJsonModule": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Step 5.5: Test Frontend Setup
```bash
cd d:\MY_ERP\frontend

# Start development server
npm run dev

# Expected output:
# VITE v4.x.x  ready in XXX ms
# ➜  Local:   http://localhost:5173/

# Open browser and navigate to http://localhost:5173
# You should see Vite welcome page
```

---

## Phase 6: Initial Project Structure Verification

### Step 6.1: Verify All Directories Exist
```bash
cd d:\MY_ERP

# Check structure
tree /F /L 3

# You should see:
# MY_ERP/
# ├── README.md
# ├── DATABASE_SCHEMA.md
# ├── RBAC_SETUP.md
# ├── docker-compose.yml
# ├── backend/
# │   ├── src/
# │   ├── tests/
# │   └── package.json
# └── frontend/
#     ├── src/
#     ├── public/
#     └── package.json
```

### Step 6.2: Verify Databases
```bash
# Connect to database
psql -U erp_user -d property_erp_db

# List tables
\dt

# Should show: users, roles, permissions, etc.

# Exit
\q
```

### Step 6.3: Verify Servers Running
```bash
# Terminal 1: Backend server
cd d:\MY_ERP\backend
npm run dev
# Expected: ✓ Server running at http://localhost:5000

# Terminal 2: Frontend server
cd d:\MY_ERP\frontend
npm run dev
# Expected: ✓ Local: http://localhost:5173

# Terminal 3: Test APIs
curl http://localhost:5000/health
# Expected: {"status":"OK",...}
```

---

## Phase 7: Git Setup

### Step 7.1: Initialize Git Repository
```bash
cd d:\MY_ERP

git init
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### Step 7.2: Create .gitignore
Create `d:\MY_ERP\.gitignore`:
```
# Dependencies
node_modules/
package-lock.json
yarn.lock

# Environment variables
.env
.env.local
.env.*.local

# Build outputs
dist/
build/
out/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store

# Logs
logs/
*.log
npm-debug.log*

# Testing
coverage/
.nyc_output/

# Database
*.sqlite
*.db

# OS
Thumbs.db
.DS_Store
```

### Step 7.3: First Commit
```bash
cd d:\MY_ERP

git add .
git commit -m "Initial project setup: folder structure, configs, and documentation

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"

# View commit
git log --oneline
```

---

## Next Steps

### Now Ready To:
1. ✅ Database schema created and migrations configured
2. ✅ Backend server initialized with Express
3. ✅ Frontend setup with React + Vite + Tailwind
4. ✅ RBAC structure documented and ready for implementation
5. 📋 **Next**: Create models and API controllers (See API_DOCUMENTATION.md)

### Development Workflow:
1. Create feature branch: `git checkout -b feature/lottery-module`
2. Implement backend controllers and routes
3. Create React components and pages
4. Test with Postman/curl
5. Commit with proper messages
6. Push to repository

---

## Troubleshooting

### PostgreSQL Connection Issues
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

### Port Already in Use
```bash
# Windows: Find process using port
netstat -ano | findstr :5000

# Kill process
taskkill /PID <PID> /F

# Or use different ports in .env
PORT=5001
```

### Node Module Conflicts
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## References
- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [PostgreSQL Manual](https://www.postgresql.org/docs/)
- [Sequelize ORM](https://sequelize.org/)
- [Tailwind CSS](https://tailwindcss.com/)

