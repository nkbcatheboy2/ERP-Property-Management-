# Database Schema - Property Management ERP

## Database: PostgreSQL
All tables use UUID primary keys except reference IDs. PropertyID is a 6-digit string with UNIQUE constraint.

---

## Core Tables

### 1. users
User accounts for all system actors (Admin, Employees, Applicants).

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_status (status)
);
```

---

### 2. roles
Predefined roles with granular permission control.

```sql
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  role_type ENUM('super_admin', 'admin', 'employee', 'applicant') NOT NULL,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_name (name)
);

-- Seed Data
INSERT INTO roles (name, role_type, description) VALUES
  ('Super Admin', 'super_admin', 'Full system access'),
  ('Admin', 'admin', 'Scheme and employee management'),
  ('Employee - Lottery', 'employee', 'Manage lottery schemes only'),
  ('Employee - Auction', 'employee', 'Manage auction schemes only'),
  ('Employee - FCFS', 'employee', 'Manage FCFS schemes only'),
  ('Applicant', 'applicant', 'Apply for properties');
```

---

### 3. permissions
Granular permissions per module and action.

```sql
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module VARCHAR(50) NOT NULL,  -- 'lottery', 'auction', 'fcfs', 'direct_allotment', 'rbac', 'reporting'
  action VARCHAR(50) NOT NULL,  -- 'read', 'create', 'update', 'delete', 'approve'
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(module, action),
  INDEX idx_module (module)
);

-- Seed Data (Example)
INSERT INTO permissions (module, action, description) VALUES
  ('lottery', 'read', 'View lottery schemes'),
  ('lottery', 'create', 'Create lottery scheme'),
  ('lottery', 'update', 'Edit lottery scheme'),
  ('lottery', 'delete', 'Delete lottery scheme'),
  ('lottery', 'execute_draw', 'Execute lottery draw'),
  ('auction', 'read', 'View auction schemes'),
  ('auction', 'create', 'Create auction'),
  ('auction', 'update', 'Edit auction'),
  ('fcfs', 'read', 'View FCFS schemes'),
  ('fcfs', 'book', 'Book property'),
  ('direct_allotment', 'read', 'View direct allotments'),
  ('direct_allotment', 'allot', 'Assign property to allottee'),
  ('rbac', 'manage_roles', 'Manage roles and permissions'),
  ('rbac', 'manage_employees', 'Add/edit employees'),
  ('reporting', 'view_all', 'View all reports and analytics');
```

---

### 4. role_permissions
Junction table linking roles to permissions.

```sql
CREATE TABLE role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(role_id, permission_id),
  INDEX idx_role_id (role_id),
  INDEX idx_permission_id (permission_id)
);
```

---

### 5. user_roles
Junction table linking users to roles.

```sql
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  assigned_by UUID REFERENCES users(id),  -- Who assigned this role
  UNIQUE(user_id, role_id),
  INDEX idx_user_id (user_id),
  INDEX idx_role_id (role_id)
);
```

---

## Scheme & Property Tables

### 6. schemes
Main container for allocation campaigns.

```sql
CREATE TABLE schemes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  scheme_type ENUM('lottery', 'auction', 'fcfs', 'direct_allotment') NOT NULL,
  description TEXT,
  created_by UUID NOT NULL REFERENCES users(id),
  status ENUM('draft', 'active', 'closed', 'archived') DEFAULT 'draft',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_scheme_type (scheme_type),
  INDEX idx_status (status),
  INDEX idx_created_by (created_by)
);
```

---

### 7. properties
Individual property records (plots, flats, apartments).

```sql
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id CHAR(6) UNIQUE NOT NULL,  -- Auto-generated 6-digit ID
  scheme_id UUID NOT NULL REFERENCES schemes(id) ON DELETE CASCADE,
  
  name VARCHAR(255) NOT NULL,
  category ENUM('plot', 'flat', 'apartment', 'bungalow', 'commercial') NOT NULL,
  size_sqft NUMERIC(10, 2) NOT NULL,
  size_unit ENUM('sqft', 'sqm') DEFAULT 'sqft',
  location VARCHAR(255),
  
  base_price NUMERIC(15, 2) NOT NULL,
  current_price NUMERIC(15, 2),
  
  status ENUM('available', 'booked', 'allotted', 'sold', 'hold') DEFAULT 'available',
  allocation_mode ENUM('lottery', 'auction', 'fcfs', 'direct') NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(scheme_id, property_id),
  INDEX idx_property_id (property_id),
  INDEX idx_scheme_id (scheme_id),
  INDEX idx_status (status),
  INDEX idx_allocation_mode (allocation_mode)
);
```

---

## Applicant & Allotment Tables

### 8. applicants
Track people applying for properties under a scheme.

```sql
CREATE TABLE applicants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scheme_id UUID NOT NULL REFERENCES schemes(id) ON DELETE CASCADE,
  
  application_status ENUM('draft', 'submitted', 'approved', 'rejected', 'withdrawn') DEFAULT 'draft',
  application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  category ENUM('general', 'sc', 'st', 'obc', 'ews') DEFAULT 'general',
  
  documents JSONB DEFAULT '{}',
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id, scheme_id),
  INDEX idx_user_id (user_id),
  INDEX idx_scheme_id (scheme_id),
  INDEX idx_application_status (application_status)
);
```

---

### 9. allottees
Record of final property allocations.

```sql
CREATE TABLE allottees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE RESTRICT,
  applicant_id UUID REFERENCES applicants(id) ON DELETE SET NULL,
  
  allotment_mode ENUM('lottery', 'auction', 'fcfs', 'direct') NOT NULL,
  allotment_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  allotment_amount NUMERIC(15, 2) NOT NULL,
  
  status ENUM('allotted', 'confirmed', 'cancelled', 'forfeited') DEFAULT 'allotted',
  
  order_number VARCHAR(100) UNIQUE,
  payment_status ENUM('pending', 'partial', 'complete') DEFAULT 'pending',
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_property_id (property_id),
  INDEX idx_applicant_id (applicant_id),
  INDEX idx_allotment_date (allotment_date),
  INDEX idx_status (status)
);
```

---

## Lottery & Auction Tables

### 10. lottery_draws
Track lottery draw executions and results.

```sql
CREATE TABLE lottery_draws (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheme_id UUID NOT NULL REFERENCES schemes(id) ON DELETE CASCADE,
  
  draw_date TIMESTAMP NOT NULL,
  draw_time TIMESTAMP,
  draw_status ENUM('scheduled', 'in_progress', 'completed', 'cancelled') DEFAULT 'scheduled',
  
  total_applicants INT NOT NULL,
  winning_results JSONB,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_scheme_id (scheme_id),
  INDEX idx_draw_status (draw_status),
  INDEX idx_draw_date (draw_date)
);
```

---

### 11. auction_bids
Track all bids for auction properties.

```sql
CREATE TABLE auction_bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  bidder_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  bid_amount NUMERIC(15, 2) NOT NULL,
  bid_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  status ENUM('active', 'outbid', 'winning', 'cancelled') DEFAULT 'active',
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_property_id (property_id),
  INDEX idx_bidder_id (bidder_id),
  INDEX idx_bid_time (bid_time),
  INDEX idx_status (status)
);
```

---

## Audit & Logging

### 12. allocation_logs
Complete audit trail of all allocation operations.

```sql
CREATE TABLE allocation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  action VARCHAR(50) NOT NULL,
  allocation_mode ENUM('lottery', 'auction', 'fcfs', 'direct') NOT NULL,
  
  old_status VARCHAR(50),
  new_status VARCHAR(50),
  
  notes TEXT,
  metadata JSONB,
  
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45),
  
  INDEX idx_property_id (property_id),
  INDEX idx_user_id (user_id),
  INDEX idx_timestamp (timestamp),
  INDEX idx_action (action)
);
```

---

## Database Triggers & Functions

### PropertyID Generation Trigger
```sql
CREATE OR REPLACE FUNCTION generate_property_id()
RETURNS TRIGGER AS $$
DECLARE
  new_id CHAR(6);
  id_counter INT;
BEGIN
  SELECT COUNT(*) + 1 INTO id_counter FROM properties WHERE scheme_id = NEW.scheme_id;
  new_id := LPAD(TO_CHAR(id_counter, '000000'), 6, '0');
  
  WHILE EXISTS (SELECT 1 FROM properties WHERE property_id = new_id AND id != NEW.id) LOOP
    id_counter := id_counter + 1;
    new_id := LPAD(TO_CHAR(id_counter, '000000'), 6, '0');
  END LOOP;
  
  NEW.property_id := new_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_generate_property_id
BEFORE INSERT ON properties
FOR EACH ROW
WHEN (NEW.property_id IS NULL)
EXECUTE FUNCTION generate_property_id();
```

### Updated Timestamp Trigger
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_update_timestamp
BEFORE UPDATE ON users FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

---

## Key Constraints
- PropertyID: UNIQUE + 6-digit format
- One allotment per property (UNIQUE constraint with status check)
- Foreign key integrity for all relationships
- Enum constraints for status values
