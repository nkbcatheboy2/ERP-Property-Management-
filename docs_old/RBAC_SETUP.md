# RBAC Setup Guide - Property Management ERP

## Overview
Role-Based Access Control (RBAC) is implemented at two levels:
1. **Backend**: API endpoint protection with permission checks
2. **Frontend**: Route protection and UI component visibility based on user roles

---

## Role Hierarchy & Default Roles

### 1. Super Admin
- **Role Type**: `super_admin`
- **Permissions**: Full read/write access to ALL modules
- **Capabilities**: 
  - Create/edit/delete all schemes (lottery, auction, fcfs, direct)
  - Manage employees and assign roles
  - View all properties and applicants
  - Execute lottery draws
  - Manage system-wide permissions
  - Access all reports and analytics

### 2. Admin
- **Role Type**: `admin`
- **Permissions**: Scheme and employee management
- **Capabilities**:
  - Create/edit/delete schemes of any type
  - Manage employee accounts
  - View all properties (global read-only to metrics)
  - Cannot execute lottery draws (only manage setup)
  - Cannot manage role permissions

### 3. Employee - Lottery
- **Role Type**: `employee`
- **Permissions**: Lottery module only + global read-only
- **Module Access**:
  - `lottery:read` - View lottery schemes
  - `lottery:create` - Create new lottery
  - `lottery:update` - Edit lottery
  - `lottery:execute_draw` - Execute lottery draw
  - `reporting:view_all` - View global metrics
- **Cannot Access**: Auction, FCFS, Direct Allotment modules

### 4. Employee - Auction
- **Role Type**: `employee`
- **Permissions**: Auction module only + global read-only
- **Module Access**:
  - `auction:read` - View auctions
  - `auction:create` - Create auction
  - `auction:update` - Edit auction
  - `auction:manage_bids` - Manage bids
  - `reporting:view_all` - View global metrics

### 5. Employee - FCFS
- **Role Type**: `employee`
- **Permissions**: FCFS module only + global read-only
- **Module Access**:
  - `fcfs:read` - View FCFS schemes
  - `fcfs:book` - Enable booking
  - `fcfs:manage_bookings` - Manage bookings
  - `reporting:view_all` - View global metrics

### 6. Applicant
- **Role Type**: `applicant`
- **Permissions**: Apply to schemes only
- **Module Access**:
  - `lottery:apply` - Apply for lottery
  - `auction:bid` - Place auction bids
  - `fcfs:book` - Book via FCFS
  - Can view ONLY their own applications and allotments

---

## Permission Structure

### Module: `lottery`
```json
{
  "read": "View lottery schemes and applicants",
  "create": "Create new lottery scheme",
  "update": "Edit lottery scheme details",
  "delete": "Delete lottery scheme",
  "execute_draw": "Execute lottery draw",
  "approve_application": "Approve applicant applications"
}
```

### Module: `auction`
```json
{
  "read": "View auction schemes",
  "create": "Create new auction",
  "update": "Edit auction details",
  "delete": "Delete auction",
  "manage_bids": "Manage bids and close auction",
  "approve_application": "Approve applicant applications"
}
```

### Module: `fcfs`
```json
{
  "read": "View FCFS schemes",
  "create": "Create new FCFS scheme",
  "update": "Edit FCFS scheme",
  "delete": "Delete FCFS scheme",
  "manage_bookings": "Manage bookings"
}
```

### Module: `direct_allotment`
```json
{
  "read": "View direct allotments",
  "allot": "Assign property to allottee",
  "update": "Edit allotment details",
  "delete": "Cancel allotment"
}
```

### Module: `rbac`
```json
{
  "manage_roles": "Create/edit/delete roles",
  "manage_employees": "Add/edit employee accounts",
  "assign_permissions": "Assign permissions to roles"
}
```

### Module: `reporting`
```json
{
  "view_all": "View all reports and analytics",
  "view_scheme": "View scheme-specific reports",
  "export": "Export reports as CSV/PDF"
}
```

---

## Implementation Guide

### Backend (Node.js/Express)

#### 1. User Model with Roles & Permissions
```typescript
// backend/src/models/User.ts
import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class User extends Model {
  public id!: string;
  public email!: string;
  public passwordHash!: string;
  public name!: string;
  public status!: 'active' | 'inactive' | 'suspended';
  
  public async getRoles() {
    return this.getDataValue('roles') || [];
  }
  
  public async getPermissions() {
    const roles = await this.getRoles();
    const permissionsSet = new Set();
    
    for (const role of roles) {
      const perms = await role.getPermissions();
      perms.forEach(p => permissionsSet.add(`${p.module}:${p.action}`));
    }
    
    return Array.from(permissionsSet);
  }
  
  public async hasPermission(module: string, action: string): Promise<boolean> {
    const perms = await this.getPermissions();
    return perms.includes(`${module}:${action}`);
  }
}

User.init({
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
  passwordHash: DataTypes.STRING(255),
  name: DataTypes.STRING(255),
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'suspended'),
    defaultValue: 'active',
  },
}, { sequelize, tableName: 'users' });

export default User;
```

#### 2. Role & Permission Models
```typescript
// backend/src/models/Role.ts
class Role extends Model {
  public id!: string;
  public name!: string;
  public roleType!: string;
  
  public async getPermissions() {
    // Implementation to fetch permissions for this role
  }
}

// backend/src/models/Permission.ts
class Permission extends Model {
  public id!: string;
  public module!: string;
  public action!: string;
}
```

#### 3. RBAC Middleware
```typescript
// backend/src/middleware/rbac.ts
import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; roles: string[] };
      permissions?: Set<string>;
    }
  }
}

export const requirePermission = (module: string, action: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      const user = await User.findByPk(req.user.id);
      const hasAccess = await user.hasPermission(module, action);
      
      if (!hasAccess) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      
      next();
    } catch (error) {
      res.status(500).json({ error: 'Permission check failed' });
    }
  };
};

export const checkPermission = (module: string, action: string) => {
  return requirePermission(module, action);
};
```

#### 4. Protected Routes Example
```typescript
// backend/src/routes/lottery.ts
import express from 'express';
import { requireAuth } from '../middleware/auth';
import { checkPermission } from '../middleware/rbac';
import lotteryController from '../controllers/lottery';

const router = express.Router();

// Create lottery (requires: lottery:create)
router.post(
  '/',
  requireAuth,
  checkPermission('lottery', 'create'),
  lotteryController.create
);

// Read lottery (requires: lottery:read)
router.get(
  '/:id',
  requireAuth,
  checkPermission('lottery', 'read'),
  lotteryController.getOne
);

// Update lottery (requires: lottery:update)
router.put(
  '/:id',
  requireAuth,
  checkPermission('lottery', 'update'),
  lotteryController.update
);

// Execute draw (requires: lottery:execute_draw)
router.post(
  '/:id/execute-draw',
  requireAuth,
  checkPermission('lottery', 'execute_draw'),
  lotteryController.executeDraw
);

export default router;
```

---

### Frontend (React + TypeScript)

#### 1. Auth Context with Roles & Permissions
```typescript
// frontend/src/store/AuthContext.tsx
import React, { createContext, useState, useEffect } from 'react';

interface AuthContextType {
  user: {
    id: string;
    name: string;
    email: string;
    roles: string[];
  } | null;
  permissions: Set<string>;
  hasPermission: (module: string, action: string) => boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Load user and permissions from API on mount
    const initAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await fetch('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          const data = await response.json();
          setUser(data.user);
          setPermissions(new Set(data.permissions));
        } catch (error) {
          console.error('Auth init failed', error);
        }
      }
      setLoading(false);
    };
    
    initAuth();
  }, []);
  
  const hasPermission = (module: string, action: string): boolean => {
    return permissions.has(`${module}:${action}`);
  };
  
  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) throw new Error('Login failed');
    
    const { token, user: userData, permissions: perms } = await response.json();
    localStorage.setItem('authToken', token);
    setUser(userData);
    setPermissions(new Set(perms));
  };
  
  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setPermissions(new Set());
  };
  
  return (
    <AuthContext.Provider value={{ user, permissions, hasPermission, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

#### 2. Protected Route Component
```typescript
// frontend/src/components/RBAC/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  element: React.ReactElement;
  requiredModule?: string;
  requiredAction?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element,
  requiredModule,
  requiredAction,
}) => {
  const { user, hasPermission, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (requiredModule && requiredAction) {
    if (!hasPermission(requiredModule, requiredAction)) {
      return <Navigate to="/unauthorized" />;
    }
  }
  
  return element;
};
```

#### 3. Role-Based Navigation Sidebar
```typescript
// frontend/src/components/RBAC/Sidebar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const navigationItems = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    module: null, // Available to all
  },
  {
    label: 'Lottery',
    path: '/schemes/lottery',
    module: 'lottery',
    action: 'read',
  },
  {
    label: 'Auction',
    path: '/schemes/auction',
    module: 'auction',
    action: 'read',
  },
  {
    label: 'FCFS',
    path: '/schemes/fcfs',
    module: 'fcfs',
    action: 'read',
  },
  {
    label: 'Direct Allotment',
    path: '/schemes/direct',
    module: 'direct_allotment',
    action: 'read',
  },
  {
    label: 'RBAC Management',
    path: '/admin/rbac',
    module: 'rbac',
    action: 'manage_roles',
  },
  {
    label: 'Reports',
    path: '/reports',
    module: 'reporting',
    action: 'view_all',
  },
];

export const Sidebar: React.FC = () => {
  const { hasPermission } = useAuth();
  
  return (
    <aside className="w-64 bg-gray-900 text-white h-screen">
      <nav className="p-4">
        {navigationItems.map((item) => {
          // Show item if no module required or user has permission
          const canAccess = !item.module || hasPermission(item.module, item.action);
          
          return canAccess ? (
            <Link
              key={item.path}
              to={item.path}
              className="block py-2 px-4 hover:bg-gray-800 rounded"
            >
              {item.label}
            </Link>
          ) : null;
        })}
      </nav>
    </aside>
  );
};
```

#### 4. Route Setup with ProtectedRoute
```typescript
// frontend/src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './store/AuthContext';
import { ProtectedRoute } from './components/RBAC/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import LotteryPage from './pages/LotteryPage';
import AuctionPage from './pages/AuctionPage';
import FCFSPage from './pages/FCFSPage';
import DirectAllotmentPage from './pages/DirectAllotmentPage';
import RBACPage from './pages/RBACPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          
          <Route
            path="/dashboard"
            element={<ProtectedRoute element={<DashboardPage />} />}
          />
          
          <Route
            path="/schemes/lottery"
            element={
              <ProtectedRoute
                element={<LotteryPage />}
                requiredModule="lottery"
                requiredAction="read"
              />
            }
          />
          
          <Route
            path="/schemes/auction"
            element={
              <ProtectedRoute
                element={<AuctionPage />}
                requiredModule="auction"
                requiredAction="read"
              />
            }
          />
          
          <Route
            path="/schemes/fcfs"
            element={
              <ProtectedRoute
                element={<FCFSPage />}
                requiredModule="fcfs"
                requiredAction="read"
              />
            }
          />
          
          <Route
            path="/admin/rbac"
            element={
              <ProtectedRoute
                element={<RBACPage />}
                requiredModule="rbac"
                requiredAction="manage_roles"
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
```

---

## Permission Check Patterns

### Frontend Examples
```typescript
// Check single permission
if (hasPermission('lottery', 'execute_draw')) {
  // Show "Execute Draw" button
}

// Show component conditionally
{hasPermission('auction', 'manage_bids') && (
  <BidManagementPanel />
)}

// Disable button based on permission
<button disabled={!hasPermission('direct_allotment', 'allot')}>
  Assign Property
</button>
```

### Backend Examples
```typescript
// In controller
if (!user.hasPermission('lottery', 'execute_draw')) {
  throw new ForbiddenError('Cannot execute lottery draw');
}

// In service layer
const canEdit = await userService.hasPermission(userId, 'lottery', 'update');
if (!canEdit) {
  throw new PermissionDeniedError();
}
```

---

## Setup Steps for New Employee

1. **Admin creates employee account** in RBAC Management UI
2. **Admin assigns roles** (e.g., "Employee - Lottery")
3. **System automatically assigns permissions** from role
4. **Employee logs in**, sees only allowed modules in sidebar
5. **API validates permission** on every request
6. **Frontend hides restricted UI elements**

---

## Testing RBAC

```bash
# Backend: Test with different roles
npm run test:rbac

# Frontend: Mock different user roles in Storybook
npm run storybook

# Manual: Switch user role in DevTools LocalStorage and refresh
```

---

## Audit Trail
All permission-related actions are logged in `allocation_logs`:
- Who assigned what role to whom
- Which permissions were checked
- Unauthorized access attempts
