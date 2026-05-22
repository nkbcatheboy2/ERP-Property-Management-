# Backend Project Structure - Property Management ERP

Complete Node.js/Express architecture and implementation guide.

---

## Overall Backend Structure

```
backend/
├── src/
│   ├── models/                  # Sequelize ORM models
│   │   ├── User.ts
│   │   ├── Role.ts
│   │   ├── Permission.ts
│   │   ├── RolePermission.ts
│   │   ├── UserRole.ts
│   │   ├── Scheme.ts
│   │   ├── Property.ts
│   │   ├── Applicant.ts
│   │   ├── Allottee.ts
│   │   ├── LotteryDraw.ts
│   │   ├── AuctionBid.ts
│   │   └── AllocationLog.ts
│   │
│   ├── controllers/             # Route handlers
│   │   ├── authController.ts
│   │   ├── schemeController.ts
│   │   ├── propertyController.ts
│   │   ├── lotteryController.ts
│   │   ├── auctionController.ts
│   │   ├── fcfsController.ts
│   │   ├── directAllotmentController.ts
│   │   ├── rbacController.ts
│   │   └── reportingController.ts
│   │
│   ├── routes/                  # API route definitions
│   │   ├── auth.routes.ts
│   │   ├── schemes.routes.ts
│   │   ├── properties.routes.ts
│   │   ├── lottery.routes.ts
│   │   ├── auction.routes.ts
│   │   ├── fcfs.routes.ts
│   │   ├── direct-allotment.routes.ts
│   │   ├── rbac.routes.ts
│   │   └── index.ts             # Main route router
│   │
│   ├── middleware/              # Express middleware
│   │   ├── auth.middleware.ts   # JWT verification
│   │   ├── rbac.middleware.ts   # Permission checking
│   │   ├── errorHandler.ts      # Global error handling
│   │   ├── validation.ts        # Input validation
│   │   ├── requestLogger.ts     # Request logging
│   │   ├── corsHandler.ts       # CORS configuration
│   │   └── rateLimit.ts         # Rate limiting
│   │
│   ├── services/                # Business logic layer
│   │   ├── authService.ts
│   │   ├── schemeService.ts
│   │   ├── propertyService.ts
│   │   ├── lotteryService.ts    # Lottery draw logic
│   │   ├── auctionService.ts    # Auction close logic
│   │   ├── fcfsService.ts       # FCFS booking logic
│   │   ├── directAllotmentService.ts
│   │   ├── rbacService.ts
│   │   ├── emailService.ts      # Email notifications
│   │   └── reportingService.ts
│   │
│   ├── utils/                   # Utility functions
│   │   ├── jwt.ts               # JWT token generation
│   │   ├── password.ts          # Password hashing
│   │   ├── propertyId.ts        # 6-digit ID generation
│   │   ├── logger.ts            # Logging utility
│   │   ├── errorHandler.ts      # Custom error classes
│   │   ├── validators.ts        # Input validation rules
│   │   ├── constants.ts         # App constants
│   │   └── helpers.ts           # Common helpers
│   │
│   ├── database/
│   │   ├── config.ts            # Database connection config
│   │   ├── migrations/          # Schema migrations
│   │   │   ├── 001_create_users_table.ts
│   │   │   ├── 002_create_roles_table.ts
│   │   │   ├── 003_create_schemes_table.ts
│   │   │   ├── 004_create_properties_table.ts
│   │   │   └── ... (more migrations)
│   │   ├── seeders/             # Data seeding
│   │   │   ├── seed_roles_permissions.ts
│   │   │   ├── seed_default_admin.ts
│   │   │   └── run.ts
│   │   ├── triggers/            # PostgreSQL triggers
│   │   │   ├── property_id_trigger.sql
│   │   │   ├── timestamp_triggers.sql
│   │   │   └── status_validation.sql
│   │   └── migrations_runner.ts # Migration execution
│   │
│   ├── config/                  # Configuration files
│   │   ├── database.ts          # Database connection
│   │   ├── env.ts               # Environment validation
│   │   ├── cors.ts              # CORS settings
│   │   └── constants.ts         # App constants
│   │
│   ├── types/                   # TypeScript interfaces
│   │   ├── models.ts            # Model types
│   │   ├── dto.ts               # Data transfer objects
│   │   ├── requests.ts          # API request types
│   │   ├── responses.ts         # API response types
│   │   ├── errors.ts            # Error types
│   │   └── index.ts             # Export all types
│   │
│   ├── validators/              # Input validators
│   │   ├── authValidators.ts
│   │   ├── schemeValidators.ts
│   │   ├── propertyValidators.ts
│   │   ├── applicationValidators.ts
│   │   └── commonValidators.ts
│   │
│   └── index.ts                 # Server entry point
│
├── tests/                       # Jest test suites
│   ├── unit/                    # Unit tests
│   │   ├── utils/
│   │   ├── services/
│   │   └── validators/
│   │
│   ├── integration/             # Integration tests
│   │   ├── auth.test.ts
│   │   ├── lottery.test.ts
│   │   ├── auction.test.ts
│   │   ├── fcfs.test.ts
│   │   └── ...
│   │
│   └── fixtures/                # Test data
│       ├── users.json
│       ├── schemes.json
│       └── properties.json
│
├── .env                         # Environment variables
├── .env.example                 # Example env template
├── tsconfig.json               # TypeScript configuration
├── jest.config.js              # Jest test configuration
├── nodemon.json                # Nodemon auto-restart config
├── package.json
├── package-lock.json
└── README.md
```

---

## Models (`src/models/`)

### User Model
```typescript
// src/models/User.ts
import { Model, DataTypes, Sequelize } from 'sequelize';
import bcrypt from 'bcrypt';

export class User extends Model {
  public id!: string;
  public email!: string;
  public passwordHash!: string;
  public name!: string;
  public phone?: string;
  public status!: 'active' | 'inactive' | 'suspended';
  
  // Associations
  public getRoles!: any;
  public getPermissions!: any;
  
  // Methods
  public async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.passwordHash);
  }
  
  public async hasPermission(module: string, action: string): Promise<boolean> {
    const roles = await this.getRoles();
    for (const role of roles) {
      const perms = await role.getPermissions();
      if (perms.some(p => p.module === module && p.action === action)) {
        return true;
      }
    }
    return false;
  }
}

export default (sequelize: Sequelize) => {
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
      validate: { isEmail: true },
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phone: DataTypes.STRING(20),
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended'),
      defaultValue: 'active',
    },
  }, {
    sequelize,
    tableName: 'users',
    hooks: {
      beforeCreate: async (user) => {
        user.passwordHash = await bcrypt.hash(user.passwordHash, 10);
      },
    },
  });
  
  return User;
};
```

### Property Model with Trigger Integration
```typescript
// src/models/Property.ts
export class Property extends Model {
  public id!: string;
  public property_id!: string;  // 6-digit auto-generated
  public scheme_id!: string;
  public name!: string;
  public category!: string;
  public size_sqft!: number;
  public base_price!: number;
  public status!: 'available' | 'booked' | 'allotted' | 'sold' | 'hold';
  public allocation_mode!: string;
}

export default (sequelize: Sequelize) => {
  Property.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    property_id: {
      type: DataTypes.CHAR(6),
      unique: true,
      allowNull: false,
      comment: 'Auto-generated 6-digit unique ID via trigger',
    },
    scheme_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'schemes', key: 'id' },
    },
    name: DataTypes.STRING(255),
    category: DataTypes.ENUM('plot', 'flat', 'apartment', 'bungalow', 'commercial'),
    size_sqft: DataTypes.NUMERIC(10, 2),
    base_price: DataTypes.NUMERIC(15, 2),
    status: {
      type: DataTypes.ENUM('available', 'booked', 'allotted', 'sold', 'hold'),
      defaultValue: 'available',
    },
    allocation_mode: DataTypes.ENUM('lottery', 'auction', 'fcfs', 'direct'),
  }, {
    sequelize,
    tableName: 'properties',
  });
  
  return Property;
};
```

---

## Controllers (`src/controllers/`)

### Auth Controller
```typescript
// src/controllers/authController.ts
import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name, phone } = req.body;
      const { user, token } = await authService.register({
        email,
        password,
        name,
        phone,
      });
      
      res.status(201).json({
        message: 'User registered successfully',
        user,
        token,
      });
    } catch (error) {
      next(error);
    }
  }
  
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const { user, token, permissions } = await authService.login(
        email,
        password
      );
      
      res.json({
        message: 'Login successful',
        user,
        token,
        permissions,
        expiresIn: '24h',
      });
    } catch (error) {
      next(error);
    }
  }
  
  async getCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.getCurrentUser(req.user.id);
      const permissions = await authService.getUserPermissions(req.user.id);
      
      res.json({ user, permissions });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
```

### Lottery Controller
```typescript
// src/controllers/lotteryController.ts
class LotteryController {
  async applyForLottery(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const { scheme_id, full_name, phone, category, documents } = req.body;
      
      const applicant = await lotteryService.submitApplication({
        user_id: userId,
        scheme_id,
        full_name,
        phone,
        category,
        documents,
      });
      
      res.status(201).json({
        message: 'Application submitted successfully',
        applicant,
      });
    } catch (error) {
      next(error);
    }
  }
  
  async executeDraw(req: Request, res: Response, next: NextFunction) {
    try {
      const { scheme_id } = req.params;
      const { draw_date, include_reserved } = req.body;
      
      // Verify permission
      const hasPermission = await req.user.hasPermission('lottery', 'execute_draw');
      if (!hasPermission) {
        throw new ForbiddenError('Cannot execute lottery draw');
      }
      
      // Execute draw within transaction
      const results = await lotteryService.executeLotteryDraw({
        scheme_id,
        draw_date,
        include_reserved,
        executed_by: req.user.id,
      });
      
      res.json({
        message: 'Lottery draw executed successfully',
        ...results,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const lotteryController = new LotteryController();
```

---

## Services (`src/services/`)

### Auth Service
```typescript
// src/services/authService.ts
import { User, Role } from '../models';
import { generateToken } from '../utils/jwt';
import { validateEmail } from '../utils/validators';

class AuthService {
  async register(data: RegisterRequest) {
    // Validate email format
    if (!validateEmail(data.email)) {
      throw new ValidationError('Invalid email format');
    }
    
    // Check if user exists
    const existingUser = await User.findOne({ where: { email: data.email } });
    if (existingUser) {
      throw new ConflictError('User already exists');
    }
    
    // Create user (password will be hashed by model hook)
    const user = await User.create({
      email: data.email,
      passwordHash: data.password,
      name: data.name,
      phone: data.phone,
    });
    
    // Assign Applicant role by default
    const applicantRole = await Role.findOne({ where: { name: 'Applicant' } });
    await user.addRole(applicantRole);
    
    const token = generateToken(user.id);
    const permissions = await this.getUserPermissions(user.id);
    
    return { user, token, permissions };
  }
  
  async login(email: string, password: string) {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.validatePassword(password))) {
      throw new UnauthorizedError('Invalid credentials');
    }
    
    const token = generateToken(user.id);
    const permissions = await this.getUserPermissions(user.id);
    
    return { user, token, permissions };
  }
  
  async getUserPermissions(userId: string): Promise<string[]> {
    const user = await User.findByPk(userId);
    const roles = await user.getRoles();
    
    const permissionsSet = new Set<string>();
    for (const role of roles) {
      const perms = await role.getPermissions();
      perms.forEach(p => permissionsSet.add(`${p.module}:${p.action}`));
    }
    
    return Array.from(permissionsSet);
  }
}

export const authService = new AuthService();
```

### Lottery Service with Transaction
```typescript
// src/services/lotteryService.ts
import sequelize from '../database/config';
import { Applicant, Allottee, Property, LotteryDraw } from '../models';

class LotteryService {
  async executeLotteryDraw(data: ExecuteDrawRequest) {
    const transaction = await sequelize.transaction({
      isolationLevel: 'SERIALIZABLE',
    });
    
    try {
      // Step 1: Get all approved applicants
      const applicants = await Applicant.findAll({
        where: {
          scheme_id: data.scheme_id,
          application_status: 'approved',
        },
        transaction,
        lock: true,  // Lock rows for update
      });
      
      if (applicants.length === 0) {
        throw new BadRequestError('No approved applicants for draw');
      }
      
      // Step 2: Shuffle applicants for lottery draw
      const shuffled = this.shuffleApplicants(applicants);
      
      // Step 3: Get available properties
      const properties = await Property.findAll({
        where: {
          scheme_id: data.scheme_id,
          status: 'available',
        },
        transaction,
        lock: true,
      });
      
      if (properties.length === 0) {
        throw new BadRequestError('No available properties for allotment');
      }
      
      // Step 4: Create allottees (assign properties to winners)
      const allottees = [];
      const winningResults = [];
      
      for (let i = 0; i < Math.min(shuffled.length, properties.length); i++) {
        const applicant = shuffled[i];
        const property = properties[i];
        
        const allottee = await Allottee.create({
          property_id: property.id,
          applicant_id: applicant.id,
          allotment_mode: 'lottery',
          allotment_amount: property.base_price,
          status: 'allotted',
          order_number: `ORD-LOTTERY-${Date.now()}-${i}`,
        }, { transaction });
        
        // Update property status
        await property.update({ status: 'allotted' }, { transaction });
        
        // Log allocation
        await AllocationLog.create({
          property_id: property.id,
          user_id: data.executed_by,
          action: 'allotted',
          allocation_mode: 'lottery',
          old_status: 'available',
          new_status: 'allotted',
          notes: `Allotted via lottery draw`,
        }, { transaction });
        
        allottees.push(allottee);
        winningResults.push({
          rank: i + 1,
          applicant_id: applicant.id,
          property_id: property.id,
        });
      }
      
      // Step 5: Create lottery draw record
      const draw = await LotteryDraw.create({
        scheme_id: data.scheme_id,
        draw_date: data.draw_date,
        draw_status: 'completed',
        total_applicants: applicants.length,
        winning_results: winningResults,
      }, { transaction });
      
      // Commit transaction
      await transaction.commit();
      
      return {
        draw_id: draw.id,
        total_allotted: allottees.length,
        allotment_ids: allottees.map(a => a.id),
      };
      
    } catch (error) {
      // Rollback on any error
      await transaction.rollback();
      throw error;
    }
  }
  
  private shuffleApplicants(applicants: Applicant[]): Applicant[] {
    // Fisher-Yates shuffle algorithm
    const shuffled = [...applicants];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

export const lotteryService = new LotteryService();
```

### FCFS Service with Real-time Locking
```typescript
// src/services/fcfsService.ts
class FCFSService {
  async bookProperty(data: BookingRequest): Promise<AllotteeResponse> {
    const transaction = await sequelize.transaction({
      isolationLevel: 'SERIALIZABLE',
    });
    
    try {
      // Step 1: Lock and check property availability
      const property = await Property.findOne({
        where: {
          id: data.property_id,
          status: 'available',  // Must be available
          allocation_mode: 'fcfs',
        },
        transaction,
        lock: 'UPDATE',  // Pessimistic locking
      });
      
      if (!property) {
        throw new ConflictError('Property not available for booking');
      }
      
      // Step 2: Check applicant eligibility
      const applicant = await Applicant.findOne({
        where: {
          user_id: data.user_id,
          scheme_id: data.scheme_id,
          application_status: 'approved',
        },
        transaction,
      });
      
      if (!applicant) {
        throw new ForbiddenError('Applicant not approved for this scheme');
      }
      
      // Step 3: Verify payment
      if (!await this.verifyPayment(data.payment_reference)) {
        throw new BadRequestError('Payment verification failed');
      }
      
      // Step 4: Create allottee
      const allottee = await Allottee.create({
        property_id: data.property_id,
        applicant_id: applicant.id,
        allotment_mode: 'fcfs',
        allotment_amount: property.base_price,
        status: 'booked',
        order_number: `ORD-FCFS-${Date.now()}`,
        payment_status: 'complete',
      }, { transaction });
      
      // Step 5: Update property status
      await property.update(
        { status: 'booked' },
        { transaction }
      );
      
      // Step 6: Log allocation
      await AllocationLog.create({
        property_id: data.property_id,
        user_id: data.user_id,
        action: 'booked',
        allocation_mode: 'fcfs',
        old_status: 'available',
        new_status: 'booked',
        notes: `FCFS booking at ${new Date().toISOString()}`,
        ip_address: data.ip_address,
      }, { transaction });
      
      await transaction.commit();
      
      return {
        allottee_id: allottee.id,
        order_number: allottee.order_number,
        property_id: property.id,
        booking_time: allottee.created_at,
        status: 'booked',
      };
      
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

export const fcfsService = new FCFSService();
```

---

## Routes (`src/routes/`)

### Lottery Routes
```typescript
// src/routes/lottery.routes.ts
import express from 'express';
import { lotteryController } from '../controllers/lotteryController';
import { requireAuth } from '../middleware/auth.middleware';
import { requirePermission } from '../middleware/rbac.middleware';
import { validateLotteryApplication } from '../validators/applicationValidators';

const router = express.Router();

// Apply for lottery
router.post(
  '/apply',
  requireAuth,
  validateLotteryApplication,
  lotteryController.applyForLottery
);

// Get lottery schemes
router.get(
  '/schemes',
  requireAuth,
  requirePermission('lottery', 'read'),
  lotteryController.getSchemes
);

// Execute lottery draw
router.post(
  '/schemes/:scheme_id/execute-draw',
  requireAuth,
  requirePermission('lottery', 'execute_draw'),
  lotteryController.executeDraw
);

// Get draw results
router.get(
  '/schemes/:scheme_id/draw-results',
  requireAuth,
  lotteryController.getDrawResults
);

export default router;
```

---

## Middleware (`src/middleware/`)

### RBAC Middleware
```typescript
// src/middleware/rbac.middleware.ts
import { Request, Response, NextFunction } from 'express';

export const requirePermission = (module: string, action: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      const user = await User.findByPk(req.user.id);
      const hasAccess = await user.hasPermission(module, action);
      
      if (!hasAccess) {
        return res.status(403).json({
          error: 'Insufficient permissions',
          required: `${module}:${action}`,
        });
      }
      
      next();
    } catch (error) {
      res.status(500).json({ error: 'Permission check failed' });
    }
  };
};
```

---

## Database Triggers (`src/database/triggers/`)

### Property ID Generation Trigger
```sql
-- src/database/triggers/property_id_trigger.sql
CREATE OR REPLACE FUNCTION generate_property_id()
RETURNS TRIGGER AS $$
DECLARE
  v_counter INT;
  v_new_id CHAR(6);
BEGIN
  -- Get count of properties in this scheme
  SELECT COUNT(*) + 1 INTO v_counter
  FROM properties
  WHERE scheme_id = NEW.scheme_id;
  
  -- Generate ID: SSCCCC format
  -- SS: Scheme code (01-99)
  -- CCCC: Counter (0001-9999)
  v_new_id := LPAD(
    TO_CHAR(
      MOD(
        (CAST(SUBSTR(NEW.scheme_id::TEXT, 1, 2)::INT AS INT) + 1),
        100
      ),
      '00'
    ) || LPAD(TO_CHAR(v_counter, '0000'), 4, '0'),
    6,
    '0'
  );
  
  -- Ensure uniqueness
  WHILE EXISTS(
    SELECT 1 FROM properties
    WHERE property_id = v_new_id AND id != NEW.id
  ) LOOP
    v_counter := v_counter + 1;
    v_new_id := LPAD(
      TO_CHAR(v_counter, '000000'),
      6,
      '0'
    );
  END LOOP;
  
  NEW.property_id := v_new_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_generate_property_id
BEFORE INSERT ON properties
FOR EACH ROW
WHEN (NEW.property_id IS NULL)
EXECUTE FUNCTION generate_property_id();
```

---

## Environment Configuration

```env
# .env
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=property_erp_db
DB_USER=erp_user
DB_PASSWORD=secure_password_123
DB_LOGGING=false

# JWT
JWT_SECRET=your_super_secret_key_minimum_32_chars_here_1234567890
JWT_EXPIRE=24h

# CORS
CORS_ORIGIN=http://localhost:5173

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Logging
LOG_LEVEL=info
```

---

## Testing Setup

```typescript
// tests/integration/lottery.test.ts
describe('Lottery Module', () => {
  it('should execute lottery draw with transaction', async () => {
    const result = await lotteryService.executeLotteryDraw({
      scheme_id: 'scheme_123',
      draw_date: new Date(),
      include_reserved: true,
      executed_by: 'user_123',
    });
    
    expect(result.total_allotted).toBeGreaterThan(0);
    expect(result.allotment_ids).toHaveLength(result.total_allotted);
  });
  
  it('should rollback on payment failure in FCFS', async () => {
    // Mock payment failure
    mockPaymentService.verifyPayment.mockRejectedValueOnce();
    
    await expect(() =>
      fcfsService.bookProperty({...})
    ).rejects.toThrow('Payment verification failed');
    
    // Verify property is still available
    const property = await Property.findByPk('prop_123');
    expect(property.status).toBe('available');
  });
});
```

---

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Seeds executed for roles/permissions
- [ ] JWT secret is strong and unique
- [ ] CORS is properly configured
- [ ] Error handling tested
- [ ] Rate limiting enabled
- [ ] Logging configured
- [ ] SSL/TLS certificates ready
- [ ] Database backups configured
- [ ] Monitoring and alerts setup

