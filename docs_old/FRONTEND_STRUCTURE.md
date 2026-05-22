# Frontend Project Structure - Property Management ERP

Complete React component and file organization for building the UI.

---

## Overall Frontend Structure

```
frontend/
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── Auth/
│   │   ├── Dashboard/
│   │   ├── Scheme/
│   │   ├── Lottery/
│   │   ├── Auction/
│   │   ├── FCFS/
│   │   ├── DirectAllotment/
│   │   ├── Property/
│   │   ├── RBAC/
│   │   └── Common/
│   │
│   ├── pages/                   # Full page components
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── NotFoundPage.tsx
│   │   ├── UnauthorizedPage.tsx
│   │   └── ...
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useFetch.ts
│   │   ├── useFormValidation.ts
│   │   ├── useLocalStorage.ts
│   │   └── ...
│   │
│   ├── services/                # API service calls
│   │   ├── api.ts              # Axios instance
│   │   ├── authService.ts
│   │   ├── schemeService.ts
│   │   ├── propertyService.ts
│   │   ├── lotteryService.ts
│   │   ├── auctionService.ts
│   │   ├── fcfsService.ts
│   │   └── ...
│   │
│   ├── store/                   # State management (Zustand)
│   │   ├── authStore.ts
│   │   ├── schemeStore.ts
│   │   ├── propertyStore.ts
│   │   └── ...
│   │
│   ├── types/                   # TypeScript interfaces
│   │   ├── auth.types.ts
│   │   ├── scheme.types.ts
│   │   ├── property.types.ts
│   │   ├── applicant.types.ts
│   │   └── ...
│   │
│   ├── utils/                   # Utility functions
│   │   ├── formatters.ts        # Date, number, currency formatting
│   │   ├── validators.ts        # Form validation functions
│   │   ├── api-error.ts         # Error handling
│   │   ├── constants.ts         # App constants
│   │   └── ...
│   │
│   ├── styles/                  # Global styles
│   │   ├── globals.css          # Tailwind globals
│   │   ├── variables.css        # CSS variables
│   │   └── animations.css       # Custom animations
│   │
│   ├── App.tsx                  # Main app component
│   ├── index.css                # Root styles
│   └── main.tsx                 # Entry point
│
├── public/                      # Static assets
│   ├── icons/
│   ├── images/
│   └── favicon.ico
│
├── .env                         # Environment variables
├── .env.example
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript config
├── tailwind.config.js          # Tailwind configuration
├── postcss.config.js           # PostCSS configuration
├── package.json
├── package-lock.json
└── README.md
```

---

## Component Breakdown by Module

### 1. Auth Components (`src/components/Auth/`)

```
Auth/
├── LoginForm.tsx                # Email/password login
├── RegisterForm.tsx             # User registration
├── ProtectedRoute.tsx           # Route guard component
├── RoleGuard.tsx                # Permission-based component visibility
├── LogoutButton.tsx             # Logout action
└── AuthStatus.tsx               # Show current user info
```

**LoginForm.tsx** - Example structure:
```typescript
interface LoginFormProps {
  onSuccess: (token: string) => void;
  loading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, loading }) => {
  // Form state and submission logic
  // Calls authService.login()
  // Updates AuthContext on success
}
```

---

### 2. Dashboard Components (`src/components/Dashboard/`)

```
Dashboard/
├── DashboardLayout.tsx          # Main dashboard layout
├── Sidebar.tsx                  # Role-based navigation
├── TopBar.tsx                   # Header with user menu
├── StatsCard.tsx                # Metric display card
├── RecentActivity.tsx           # Activity feed
├── SchemeQuickAccess.tsx        # Scheme shortcuts
└── QuickStats.tsx               # Overview metrics
```

**DashboardLayout.tsx**:
```typescript
interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar user={user} />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
```

---

### 3. Scheme Components (`src/components/Scheme/`)

```
Scheme/
├── SchemeForm.tsx               # Create/Edit scheme
├── SchemeList.tsx               # Paginated scheme listing
├── SchemeFilter.tsx             # Filter and search
├── SchemeCard.tsx               # Individual scheme preview
├── SchemeDetail.tsx             # Full scheme details
└── SchemeActions.tsx            # Bulk actions toolbar
```

**SchemeForm.tsx**:
```typescript
interface SchemeFormProps {
  initialData?: Scheme;
  onSubmit: (data: CreateSchemeDTO) => Promise<void>;
  loading?: boolean;
}

export const SchemeForm: React.FC<SchemeFormProps> = ({ 
  initialData, 
  onSubmit, 
  loading 
}) => {
  // Form with scheme_type, name, description
  // Conditional metadata fields based on scheme_type
  // Validation and submission
}
```

---

### 4. Lottery Components (`src/components/Lottery/`)

```
Lottery/
├── LotteryApplicationForm.tsx   # User applies for lottery
├── LotterySchemeSetup.tsx       # Admin creates lottery
├── LotteryDrawExecution.tsx     # Admin executes draw
├── LotteryResults.tsx           # Display draw winners
├── LotteryApplicationStatus.tsx # Track applicant status
└── LotteryResultsTable.tsx      # Paginated results table
```

**LotteryApplicationForm.tsx**:
```typescript
interface ApplicationFormData {
  scheme_id: string;
  full_name: string;
  phone: string;
  category: 'general' | 'sc' | 'st' | 'obc' | 'ews';
  documents: Record<string, File>;
}

export const LotteryApplicationForm: React.FC = () => {
  const { handleSubmit, loading } = useFormValidation<ApplicationFormData>();
  // Form fields for application
  // Document upload
  // Submit via lotteryService.applyForLottery()
}
```

---

### 5. Auction Components (`src/components/Auction/`)

```
Auction/
├── AuctionSetup.tsx             # Admin creates auction
├── AuctionPropertyCard.tsx      # Property under auction
├── BidPlacementForm.tsx         # Place bid UI
├── AuctionBidHistory.tsx        # Current bids table
├── AuctionTimer.tsx             # Countdown timer
├── AuctionResults.tsx           # Winner announcement
└── AuctionPropertyGallery.tsx   # Browse auction items
```

**BidPlacementForm.tsx**:
```typescript
interface BidFormProps {
  property_id: string;
  currentHighestBid: number;
  minBidIncrement: number;
}

export const BidPlacementForm: React.FC<BidFormProps> = ({
  property_id,
  currentHighestBid,
  minBidIncrement,
}) => {
  // Input for bid amount with validation
  // Min bid = currentHighestBid + minBidIncrement
  // Real-time validation
  // Submit via auctionService.placeBid()
}
```

---

### 6. FCFS Components (`src/components/FCFS/`)

```
FCFS/
├── FCFSPropertyBrowser.tsx      # Available properties list
├── PropertyAvailabilityCheck.tsx# Check if available
├── BookingConfirmation.tsx      # Confirm & pay booking
├── PaymentIntegration.tsx       # Payment gateway
├── BookingReceipt.tsx           # Post-booking receipt
├── MyBookings.tsx               # User's FCFS bookings
└── RealtimeAvailability.tsx     # WebSocket availability updates
```

**PropertyAvailabilityCheck.tsx**:
```typescript
interface AvailabilityCheckProps {
  propertyId: string;
}

export const PropertyAvailabilityCheck: React.FC<AvailabilityCheckProps> = ({
  propertyId,
}) => {
  // Check availability status
  // Show: Available, Booked, Sold, On Hold
  // Enable "Book Now" button only if available
  // Real-time updates via WebSocket
}
```

---

### 7. DirectAllotment Components (`src/components/DirectAllotment/`)

```
DirectAllotment/
├── AllotteeForm.tsx             # Create/edit allottee
├── PropertyAllotmentModal.tsx   # Simple allotment UI
├── AllotmentList.tsx            # Paginated allotments
├── AllotmentSearch.tsx          # Search allottees
└── BulkAllotment.tsx            # Batch allotment upload
```

**PropertyAllotmentModal.tsx**:
```typescript
interface AllotmentModalProps {
  propertyId: string;
  onSuccess: () => void;
  open: boolean;
  onClose: () => void;
}

export const PropertyAllotmentModal: React.FC<AllotmentModalProps> = ({
  propertyId,
  onSuccess,
  open,
  onClose,
}) => {
  // Simple form: select applicant + confirm
  // Submit via directAllotmentService.allot()
}
```

---

### 8. Property Components (`src/components/Property/`)

```
Property/
├── PropertyCard.tsx             # Individual property display
├── PropertyDetail.tsx           # Full property information
├── PropertySearch.tsx           # 6-digit ID quick search
├── PropertyFilter.tsx           # Filter by category, price
├── PropertyGallery.tsx          # Image gallery
├── PropertyStatusBadge.tsx      # Status indicator
├── PropertyMetrics.tsx          # Size, price, location info
└── PropertyActionMenu.tsx       # Context menu actions
```

**PropertySearch.tsx**:
```typescript
export const PropertySearch: React.FC = () => {
  const [propertyId, setPropertyId] = useState('');
  
  const handleSearch = async (id: string) => {
    // Fetch property by 6-digit ID
    // Open detailed modal/page
    // Show full property info with allocation mode
  }
  
  return (
    <input
      placeholder="Enter 6-digit Property ID (e.g., 001001)"
      value={propertyId}
      onChange={e => setPropertyId(e.target.value)}
      onKeyPress={e => e.key === 'Enter' && handleSearch(propertyId)}
    />
  );
}
```

---

### 9. RBAC Components (`src/components/RBAC/`)

```
RBAC/
├── RoleManagement.tsx           # Create/edit roles
├── PermissionMatrix.tsx         # Role-permission mapping
├── EmployeeManagement.tsx       # Add/edit employees
├── RoleAssignment.tsx           # Assign roles to users
├── PermissionCheck.tsx          # Component-level guard
└── AuditTrail.tsx               # View access logs
```

**RoleAssignment.tsx**:
```typescript
interface RoleAssignmentProps {
  employeeId: string;
  currentRoles: string[];
}

export const RoleAssignment: React.FC<RoleAssignmentProps> = ({
  employeeId,
  currentRoles,
}) => {
  const [selectedRoles, setSelectedRoles] = useState(currentRoles);
  
  // Checkbox list of available roles
  // Show permissions for each role
  // Save via rbacService.assignRoles()
}
```

---

### 10. Common Components (`src/components/Common/`)

```
Common/
├── Button.tsx                   # Reusable button
├── Input.tsx                    # Input field wrapper
├── Select.tsx                   # Dropdown wrapper
├── Modal.tsx                    # Modal dialog
├── LoadingSpinner.tsx           # Loading indicator
├── ErrorBoundary.tsx            # Error handling
├── Toast.tsx                    # Notification system
├── Pagination.tsx               # Paginated list control
├── DataTable.tsx                # Reusable table component
├── ConfirmDialog.tsx            # Confirmation modal
└── FileUpload.tsx               # File upload component
```

---

## Services (`src/services/`)

### api.ts - Axios Configuration
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

// Add JWT token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(null, (error) => {
  if (error.response?.status === 401) {
    // Clear auth and redirect to login
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

export default api;
```

### lotteryService.ts
```typescript
export const lotteryService = {
  applyForLottery: (data: ApplicationFormData) => 
    api.post('/lottery/apply', data),
    
  getMyApplications: () => 
    api.get('/lottery/my-applications'),
    
  getDrawResults: (schemeId: string) => 
    api.get(`/lottery/schemes/${schemeId}/draw-results`),
    
  executeDraw: (schemeId: string, data: DrawData) => 
    api.post(`/lottery/schemes/${schemeId}/execute-draw`, data),
};
```

---

## State Management (`src/store/`)

Using **Zustand** for lightweight state:

```typescript
// authStore.ts
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  permissions: string[];
  token: string | null;
  setAuth: (user: User, token: string, permissions: string[]) => void;
  clearAuth: () => void;
  hasPermission: (module: string, action: string) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  permissions: [],
  token: localStorage.getItem('authToken'),
  
  setAuth: (user, token, permissions) =>
    set({ user, token, permissions }),
    
  clearAuth: () =>
    set({ user: null, token: null, permissions: [] }),
    
  hasPermission: (module, action) => {
    const { permissions } = get();
    return permissions.includes(`${module}:${action}`);
  },
}));
```

---

## Type Definitions (`src/types/`)

### auth.types.ts
```typescript
export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  status: 'active' | 'inactive' | 'suspended';
}

export interface LoginResponse {
  user: User;
  token: string;
  permissions: string[];
  expiresIn: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
}
```

### scheme.types.ts
```typescript
export interface Scheme {
  id: string;
  name: string;
  scheme_type: 'lottery' | 'auction' | 'fcfs' | 'direct_allotment';
  status: 'draft' | 'active' | 'closed' | 'archived';
  created_by: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export type CreateSchemeDTO = Omit<Scheme, 'id' | 'created_at' | 'updated_at'>;
```

---

## Custom Hooks (`src/hooks/`)

### useAuth.ts
```typescript
export const useAuth = () => {
  const { user, permissions, hasPermission, setAuth, clearAuth } = useAuthStore();
  
  const login = async (email: string, password: string) => {
    const { data } = await authService.login({ email, password });
    setAuth(data.user, data.token, data.permissions);
    return data;
  };
  
  const logout = () => {
    clearAuth();
    localStorage.removeItem('authToken');
  };
  
  return { user, permissions, hasPermission, login, logout };
};
```

### useFetch.ts
```typescript
interface UseFetchOptions {
  skip?: boolean;
  refetchInterval?: number;
}

export const useFetch = <T>(
  url: string,
  options?: UseFetchOptions
): { data: T | null; loading: boolean; error: Error | null } => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    if (options?.skip) return;
    
    api.get<T>(url)
      .then(res => setData(res.data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, [url]);
  
  return { data, loading, error };
};
```

---

## Utility Functions (`src/utils/`)

### formatters.ts
```typescript
export const formatCurrency = (amount: number, currency = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date));
};

export const formatPropertySize = (size: number, unit: 'sqft' | 'sqm'): string => {
  return `${size.toLocaleString('en-IN')} ${unit}`;
};
```

### validators.ts
```typescript
export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePropertyId = (id: string): boolean => {
  return /^\d{6}$/.test(id);
};

export const validatePhone = (phone: string): boolean => {
  return /^[+]?[\d\s\-()]{10,}$/.test(phone);
};
```

---

## App Routing (`src/App.tsx`)

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/RBAC/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import LotteryPage from './pages/LotteryPage';
import AuctionPage from './pages/AuctionPage';
import FCFSPage from './pages/FCFSPage';
import DirectAllotmentPage from './pages/DirectAllotmentPage';
import RBACPage from './pages/RBACPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route
          path="/"
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
        
        {/* More routes... */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

---

## Development Notes

- Use **Tailwind CSS** for all styling (no CSS-in-JS)
- Implement **API error handling** in every service call
- Add **loading states** for async operations
- Use **TypeScript strict mode** - no `any` types
- Create **reusable components** in `Common/` folder
- Implement **proper validation** for all forms
- Use **custom hooks** to reduce component complexity
- Lazy-load pages with `React.lazy()` for code splitting

---

## Testing Strategy

- Unit tests for utils and hooks
- Component tests for RBAC components
- Integration tests for service layer
- E2E tests for critical user flows (lottery apply, FCFS booking)

