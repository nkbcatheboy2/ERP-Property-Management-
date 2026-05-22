# API Documentation - Property Management ERP

Base URL: `http://localhost:5000/api`

All endpoints require JWT token in `Authorization: Bearer <token>` header (except login/register).

---

## Authentication Endpoints

### Register New User
**POST** `/auth/register`

Request:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe",
  "phone": "+91-9876543210"
}
```

Response (201):
```json
{
  "message": "User created successfully",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "John Doe",
    "status": "active"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### Login
**POST** `/auth/login`

Request:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

Response (200):
```json
{
  "message": "Login successful",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "John Doe",
    "roles": ["Applicant"],
    "status": "active"
  },
  "permissions": [
    "lottery:apply",
    "auction:bid",
    "fcfs:book"
  ],
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": "24h"
}
```

Error Response (401):
```json
{
  "error": "Invalid credentials",
  "code": "AUTH_INVALID"
}
```

---

### Get Current User
**GET** `/auth/me`

Headers: `Authorization: Bearer <token>`

Response (200):
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "John Doe",
    "roles": ["Admin"],
    "status": "active"
  },
  "permissions": [
    "lottery:read",
    "lottery:create",
    "auction:read",
    "rbac:manage_employees"
  ]
}
```

---

## Scheme Endpoints

### Create Lottery Scheme
**POST** `/schemes`

Permission Required: `lottery:create`

Request:
```json
{
  "name": "Omaxe City - Phase 1 Lottery",
  "scheme_type": "lottery",
  "description": "Lottery scheme for Omaxe City properties",
  "metadata": {
    "draw_date": "2026-06-15T10:00:00Z",
    "total_properties": 150,
    "reserved_for_sc": 15,
    "reserved_for_st": 7
  }
}
```

Response (201):
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440111",
  "name": "Omaxe City - Phase 1 Lottery",
  "scheme_type": "lottery",
  "status": "draft",
  "created_by": "550e8400-e29b-41d4-a716-446655440000",
  "metadata": { ... },
  "created_at": "2026-05-21T11:41:34Z"
}
```

---

### Get All Schemes
**GET** `/schemes?type=lottery&status=active&page=1&limit=10`

Permission Required: `<module>:read` (matching scheme type)

Query Parameters:
- `type` - Filter by scheme type (lottery, auction, fcfs, direct_allotment)
- `status` - Filter by status (draft, active, closed, archived)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search in scheme name and description

Response (200):
```json
{
  "data": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440111",
      "name": "Omaxe City - Phase 1 Lottery",
      "scheme_type": "lottery",
      "status": "active",
      "total_properties": 150,
      "available_properties": 45,
      "created_at": "2026-05-21T11:41:34Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_items": 50,
    "items_per_page": 10
  }
}
```

---

### Get Single Scheme
**GET** `/schemes/:scheme_id`

Permission Required: `<module>:read` (matching scheme type)

Response (200):
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440111",
  "name": "Omaxe City - Phase 1 Lottery",
  "scheme_type": "lottery",
  "description": "Lottery scheme for Omaxe City properties",
  "status": "active",
  "created_by": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Admin User"
  },
  "metadata": { ... },
  "properties": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440222",
      "property_id": "001001",
      "category": "flat",
      "size_sqft": 1200,
      "base_price": 4500000,
      "status": "available"
    }
  ],
  "created_at": "2026-05-21T11:41:34Z",
  "updated_at": "2026-05-21T14:30:20Z"
}
```

---

### Update Scheme
**PUT** `/schemes/:scheme_id`

Permission Required: `<module>:update` (matching scheme type)

Request:
```json
{
  "name": "Omaxe City - Phase 1 Lottery (Updated)",
  "description": "Updated description",
  "metadata": { ... }
}
```

Response (200): Updated scheme object

---

### Delete Scheme
**DELETE** `/schemes/:scheme_id`

Permission Required: `<module>:delete` (matching scheme type)

Response (200):
```json
{
  "message": "Scheme deleted successfully"
}
```

---

## Property Endpoints

### Add Property to Scheme
**POST** `/schemes/:scheme_id/properties`

Permission Required: `<module>:create` (matching scheme type)

Request:
```json
{
  "name": "Plot A-101",
  "category": "plot",
  "size_sqft": 2500,
  "size_unit": "sqft",
  "location": "Block A, Sector 5",
  "base_price": 4500000,
  "allocation_mode": "lottery"
}
```

Response (201):
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440222",
  "property_id": "001001",  // Auto-generated 6-digit unique ID
  "scheme_id": "660e8400-e29b-41d4-a716-446655440111",
  "name": "Plot A-101",
  "category": "plot",
  "size_sqft": 2500,
  "base_price": 4500000,
  "status": "available",
  "allocation_mode": "lottery",
  "created_at": "2026-05-21T11:41:34Z"
}
```

---

### Get Property by ID (6-digit)
**GET** `/properties/search/:property_id`

Query Parameters:
- `property_id` - 6-digit auto-generated property ID (e.g., "001001")

Response (200):
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440222",
  "property_id": "001001",
  "name": "Plot A-101",
  "category": "plot",
  "size_sqft": 2500,
  "base_price": 4500000,
  "current_price": 4500000,
  "status": "available",
  "allocation_mode": "lottery",
  "scheme": {
    "id": "660e8400-e29b-41d4-a716-446655440111",
    "name": "Omaxe City - Phase 1 Lottery"
  },
  "allottee": null,
  "created_at": "2026-05-21T11:41:34Z"
}
```

---

### Get Properties in Scheme
**GET** `/schemes/:scheme_id/properties?status=available&category=plot`

Query Parameters:
- `status` - Filter (available, booked, allotted, sold, hold)
- `category` - Filter (plot, flat, apartment, bungalow, commercial)
- `min_price` - Minimum price filter
- `max_price` - Maximum price filter
- `page` - Pagination

Response (200):
```json
{
  "data": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440222",
      "property_id": "001001",
      "name": "Plot A-101",
      "category": "plot",
      "size_sqft": 2500,
      "base_price": 4500000,
      "status": "available",
      "allocation_mode": "lottery"
    }
  ],
  "pagination": { ... }
}
```

---

## Lottery Endpoints

### Apply for Lottery
**POST** `/lottery/apply`

Permission Required: `lottery:apply`

Request:
```json
{
  "scheme_id": "660e8400-e29b-41d4-a716-446655440111",
  "full_name": "Rajesh Kumar",
  "phone": "+91-9876543210",
  "category": "general",  // general, sc, st, obc, ews
  "documents": {
    "id_proof": "doc_file_id_123",
    "address_proof": "doc_file_id_456",
    "income_certificate": "doc_file_id_789"
  }
}
```

Response (201):
```json
{
  "id": "880e8400-e29b-41d4-a716-446655440333",
  "scheme_id": "660e8400-e29b-41d4-a716-446655440111",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "application_status": "submitted",
  "full_name": "Rajesh Kumar",
  "phone": "+91-9876543210",
  "category": "general",
  "documents": { ... },
  "application_date": "2026-05-21T11:41:34Z",
  "message": "Application submitted successfully"
}
```

---

### Get Lottery Draw Results
**GET** `/lottery/schemes/:scheme_id/draw-results`

Permission Required: `lottery:read`

Response (200):
```json
{
  "scheme_id": "660e8400-e29b-41d4-a716-446655440111",
  "draw_date": "2026-06-15T10:00:00Z",
  "draw_status": "completed",
  "total_applicants": 250,
  "winning_results": [
    {
      "rank": 1,
      "applicant": {
        "id": "880e8400-e29b-41d4-a716-446655440333",
        "full_name": "Rajesh Kumar"
      },
      "property_id": "001001",
      "draw_order": 1,
      "allotment_status": "allotted"
    }
  ],
  "total_won": 45,
  "created_at": "2026-06-15T10:00:00Z"
}
```

---

### Execute Lottery Draw
**POST** `/lottery/schemes/:scheme_id/execute-draw`

Permission Required: `lottery:execute_draw`

Request:
```json
{
  "draw_date": "2026-06-15T10:00:00Z",
  "include_reserved": true
}
```

Response (200):
```json
{
  "message": "Lottery draw executed successfully",
  "scheme_id": "660e8400-e29b-41d4-a716-446655440111",
  "draw_id": "990e8400-e29b-41d4-a716-446655440444",
  "total_allotted": 45,
  "allotment_ids": ["allottee_001", "allottee_002", ...]
}
```

---

## Auction Endpoints

### Create Auction
**POST** `/auction/create`

Permission Required: `auction:create`

Request:
```json
{
  "scheme_id": "660e8400-e29b-41d4-a716-446655440111",
  "property_id": "770e8400-e29b-41d4-a716-446655440222",
  "base_price": 4500000,
  "start_date": "2026-06-01T10:00:00Z",
  "end_date": "2026-06-30T18:00:00Z",
  "earnest_money": 500000
}
```

Response (201):
```json
{
  "message": "Auction created successfully",
  "auction_id": "aa0e8400-e29b-41d4-a716-446655440555"
}
```

---

### Place Auction Bid
**POST** `/auction/:property_id/bid`

Permission Required: `auction:bid`

Request:
```json
{
  "bid_amount": 4800000
}
```

Response (201):
```json
{
  "message": "Bid placed successfully",
  "bid_id": "bb0e8400-e29b-41d4-a716-446655440666",
  "bid_amount": 4800000,
  "current_highest": 4800000,
  "bid_time": "2026-06-15T14:30:20Z"
}
```

---

### Get Auction Bids
**GET** `/auction/:property_id/bids`

Response (200):
```json
{
  "property_id": "770e8400-e29b-41d4-a716-446655440222",
  "base_price": 4500000,
  "highest_bid": 5200000,
  "total_bids": 23,
  "bids": [
    {
      "rank": 1,
      "bidder": "Priya Sharma",
      "bid_amount": 5200000,
      "bid_time": "2026-06-15T14:30:20Z",
      "status": "winning"
    }
  ]
}
```

---

## FCFS Endpoints

### Check Property Availability
**GET** `/fcfs/properties/:property_id/availability`

Response (200):
```json
{
  "property_id": "001001",
  "status": "available",
  "available_since": "2026-06-01T10:00:00Z",
  "price": 4500000,
  "can_book": true,
  "message": "Property is available for booking"
}
```

---

### Book Property (FCFS)
**POST** `/fcfs/book`

Permission Required: `fcfs:book`

Request:
```json
{
  "scheme_id": "660e8400-e29b-41d4-a716-446655440111",
  "property_id": "770e8400-e29b-41d4-a716-446655440222",
  "payment_reference": "PAYMENT_TXN_12345"
}
```

Response (201):
```json
{
  "message": "Property booked successfully",
  "allottee_id": "cc0e8400-e29b-41d4-a716-446655440777",
  "property_id": "770e8400-e29b-41d4-a716-446655440222",
  "booking_time": "2026-06-15T14:30:20.123Z",
  "order_number": "ORD-2026-0001",
  "status": "booked"
}
```

Error Response (409 - Conflict):
```json
{
  "error": "Property already booked",
  "code": "PROPERTY_ALREADY_BOOKED",
  "booked_by": "Priya Sharma",
  "booked_at": "2026-06-15T14:30:15Z"
}
```

---

## Direct Allotment Endpoints

### Create Direct Allotment
**POST** `/direct-allotment/allot`

Permission Required: `direct_allotment:allot`

Request:
```json
{
  "property_id": "770e8400-e29b-41d4-a716-446655440222",
  "applicant_id": "880e8400-e29b-41d4-a716-446655440333",
  "allotment_amount": 4500000
}
```

Response (201):
```json
{
  "message": "Property allotted successfully",
  "allottee_id": "dd0e8400-e29b-41d4-a716-446655440888",
  "order_number": "ORD-DIRECT-0001",
  "property_id": "770e8400-e29b-41d4-a716-446655440222",
  "allottee": {
    "id": "880e8400-e29b-41d4-a716-446655440333",
    "full_name": "Rajesh Kumar"
  },
  "allotment_date": "2026-05-21T11:41:34Z"
}
```

---

## RBAC/Employee Management Endpoints

### Add Employee
**POST** `/admin/employees`

Permission Required: `rbac:manage_employees`

Request:
```json
{
  "email": "employee@example.com",
  "password": "SecurePass123!",
  "name": "Priya Sharma",
  "roles": ["Employee - Lottery"],
  "phone": "+91-9876543211"
}
```

Response (201):
```json
{
  "id": "ee0e8400-e29b-41d4-a716-446655440999",
  "email": "employee@example.com",
  "name": "Priya Sharma",
  "roles": ["Employee - Lottery"],
  "permissions": ["lottery:read", "lottery:create", "lottery:update"],
  "status": "active"
}
```

---

### Assign Role to Employee
**PUT** `/admin/employees/:employee_id/roles`

Permission Required: `rbac:manage_roles`

Request:
```json
{
  "roles": ["Employee - Lottery", "Employee - Auction"]
}
```

Response (200):
```json
{
  "message": "Roles assigned successfully",
  "employee_id": "ee0e8400-e29b-41d4-a716-446655440999",
  "roles": ["Employee - Lottery", "Employee - Auction"],
  "permissions": [
    "lottery:read", "lottery:create", "lottery:update",
    "auction:read", "auction:create", "auction:update"
  ]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation error",
  "code": "VALIDATION_ERROR",
  "details": {
    "email": "Invalid email format",
    "scheme_id": "Scheme not found"
  }
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid or expired token",
  "code": "AUTH_INVALID",
  "message": "Please login again"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions",
  "code": "PERMISSION_DENIED",
  "required_permission": "lottery:execute_draw"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found",
  "code": "NOT_FOUND",
  "resource": "Scheme"
}
```

### 409 Conflict
```json
{
  "error": "Property already booked",
  "code": "CONFLICT",
  "details": "Cannot book: property status is 'allotted'"
}
```

### 500 Internal Server Error
```json
{
  "error": "An unexpected error occurred",
  "code": "INTERNAL_ERROR",
  "request_id": "req_123456789"
}
```

---

## Rate Limiting

All endpoints have rate limiting:
- **Authenticated Users**: 100 requests per minute
- **Unauthenticated**: 10 requests per minute
- **Special Operations** (lottery draw): 1 request per draw period

Response Header:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1621679494
```

---

## Webhook Events (Future)
- `scheme.created` - New scheme created
- `property.allotted` - Property allotted to applicant
- `lottery.draw_executed` - Lottery draw completed
- `auction.closed` - Auction closed, winner selected
- `fcfs.booked` - Property booked via FCFS

