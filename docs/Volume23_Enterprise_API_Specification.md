# MADVENTURE / Travel Tracer

# Enterprise Documentation v6.0

# Volume 23 — Enterprise API Specification & Backend Contract

---

# Chapter 325 — API Architecture Overview

Madventure-এর Backend হবে **REST API First Architecture**, ভবিষ্যতে GraphQL বা gRPC যোগ করার সুযোগ রেখে।

## API Flow

```text
Client (Web / Mobile)
        │
 HTTPS + JWT
        │
 API Gateway
        │
Authentication Middleware
        │
Authorization (RBAC)
        │
Validation Layer
        │
Business Service Layer
        │
Repository Layer
        │
PostgreSQL (Supabase)
```

---

# Chapter 326 — API Versioning

সব API versioned হবে।

```text
/api/v1/
/api/v2/
```

Example

```http
GET /api/v1/tours
GET /api/v1/bookings
POST /api/v1/auth/login
```

পুরনো Version minimum ১২ মাস support করা হবে।

---

# Chapter 327 — Authentication Flow

```text
Login
    │
    ▼
Access Token (15 min)

Refresh Token (30 days)

↓

Protected API

↓

401?

↓

Refresh Token

↓

New Access Token
```

---

# Chapter 328 — Standard HTTP Methods

| Method | Usage       |
| ------ | ----------- |
| GET    | Read        |
| POST   | Create      |
| PUT    | Replace     |
| PATCH  | Update      |
| DELETE | Soft Delete |

---

# Chapter 329 — HTTP Status Codes

| Code | Meaning          |
| ---- | ---------------- |
| 200  | Success          |
| 201  | Created          |
| 204  | No Content       |
| 400  | Bad Request      |
| 401  | Unauthorized     |
| 403  | Forbidden        |
| 404  | Not Found        |
| 409  | Conflict         |
| 422  | Validation Error |
| 429  | Rate Limited     |
| 500  | Internal Error   |

---

# Chapter 330 — Standard Response Format

Success

```json
{
  "success": true,
  "message": "Booking created successfully.",
  "data": {},
  "meta": {}
}
```

Error

```json
{
  "success": false,
  "error": {
    "code": "BOOK_001",
    "message": "No available seats."
  }
}
```

---

# Chapter 331 — Authentication APIs

## Register

```http
POST /api/v1/auth/register
```

Body

```json
{
  "full_name": "",
  "email": "",
  "phone": "",
  "password": ""
}
```

---

## Login

```http
POST /api/v1/auth/login
```

---

## Logout

```http
POST /api/v1/auth/logout
```

---

## Refresh Token

```http
POST /api/v1/auth/refresh
```

---

## Forgot Password

```http
POST /api/v1/auth/forgot-password
```

---

## Reset Password

```http
POST /api/v1/auth/reset-password
```

---

# Chapter 332 — User APIs

```http
GET /users/me

PATCH /users/me

GET /users/{id}

GET /users/me/bookings

GET /users/me/wallet
```

---

# Chapter 333 — Destination APIs

```http
GET /divisions

GET /districts

GET /places

GET /places/{slug}

GET /places/nearby

GET /places/search
```

Filters

* division
* district
* category
* featured

---

# Chapter 334 — Tour APIs

```http
GET /tours

GET /tours/{slug}

POST /tours

PATCH /tours/{id}

DELETE /tours/{id}
```

Agency Only

```http
POST /agency/tours
```

---

Schedules

```http
GET /tour-schedules

POST /tour-schedules

PATCH /tour-schedules/{id}
```

---

# Chapter 335 — Hotel APIs

```http
GET /hotels

GET /hotels/{slug}

GET /hotels/{slug}/rooms

POST /hotels

PATCH /hotels/{id}
```

---

Inventory

```http
GET /inventory

PATCH /inventory
```

---

# Chapter 336 — Booking APIs

```http
POST /bookings

GET /bookings

GET /bookings/{id}

PATCH /bookings/{id}

DELETE /bookings/{id}
```

Traveler List

```http
POST /bookings/{id}/travelers
```

Invoice

```http
GET /bookings/{id}/invoice
```

---

# Chapter 337 — Payment APIs

```http
POST /payments/initiate

POST /payments/callback

GET /payments/{id}

POST /payments/refund
```

---

# Chapter 338 — Wallet APIs

```http
GET /wallet

GET /wallet/ledger

POST /wallet/deposit

POST /wallet/withdraw

POST /wallet/transfer
```

---

# Chapter 339 — Wishlist APIs

```http
GET /wishlist

POST /wishlist

DELETE /wishlist/{id}
```

---

# Chapter 340 — Community APIs

```http
GET /threads

POST /threads

GET /threads/{id}

POST /threads/{id}/reply

POST /threads/{id}/vote

POST /threads/{id}/report
```

---

# Chapter 341 — Reviews APIs

```http
POST /reviews

GET /reviews

PATCH /reviews

DELETE /reviews
```

---

# Chapter 342 — Notification APIs

```http
GET /notifications

PATCH /notifications/read

PATCH /notifications/read-all
```

---

# Chapter 343 — AI APIs

```http
POST /ai/planner

POST /ai/chat

GET /ai/history

DELETE /ai/history
```

---

# Chapter 344 — Admin APIs

```http
GET /admin/users

GET /admin/bookings

GET /admin/payments

GET /admin/reports

GET /admin/logs

PATCH /admin/users/{id}
```

---

# Chapter 345 — Pagination Standard

Query

```http
?page=1

&limit=20
```

Response

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

---

# Chapter 346 — Filtering

Example

```http
GET /tours?

district=coxs-bazar

&price_min=2000

&price_max=8000

&rating=4

&featured=true
```

---

# Chapter 347 — Sorting

```http
sort=price

order=asc
```

Supported

* newest
* oldest
* rating
* popularity
* price
* duration

---

# Chapter 348 — Search Standard

```http
GET /search?q=sajek
```

Search

* Tours
* Hotels
* Places
* Guides

---

# Chapter 349 — File Upload

Images

```http
POST /uploads/image
```

Documents

```http
POST /uploads/document
```

Allowed

* JPG
* PNG
* WEBP
* PDF

Maximum

20 MB

---

# Chapter 350 — Webhooks

Payment

```http
POST /webhooks/payment
```

Notification

```http
POST /webhooks/notification
```

Verification

* HMAC Signature
* Timestamp Validation
* Replay Protection

---

# Chapter 351 — Rate Limiting

| API        | Limit   |
| ---------- | ------- |
| Login      | 5/min   |
| Register   | 5/min   |
| AI Planner | 20/hour |
| Search     | 100/min |
| Payment    | 10/min  |

---

# Chapter 352 — Idempotency

Required APIs

* Booking
* Payment
* Refund

Header

```http
Idempotency-Key:
```

---

# Chapter 353 — Realtime Events

WebSocket Channels

```text
booking.updated

wallet.updated

notification.created

forum.reply

admin.alert
```

---

# Chapter 354 — Error Codes

| Code       | Meaning              |
| ---------- | -------------------- |
| AUTH_001   | Invalid Login        |
| AUTH_002   | OTP Expired          |
| BOOK_001   | Seat Full            |
| BOOK_002   | Booking Expired      |
| PAY_001    | Payment Failed       |
| PAY_002    | Duplicate Callback   |
| HOTEL_001  | Room Unavailable     |
| WALLET_001 | Insufficient Balance |

---

# Chapter 355 — API Security

Mandatory

* JWT Authentication
* HTTPS Only
* CORS Policy
* Rate Limiting
* Request Validation
* SQL Injection Protection
* XSS Protection
* CSRF Protection (where applicable)
* Audit Logging

---

# Chapter 356 — OpenAPI Documentation

Maintain a complete OpenAPI 3.1 specification including:

* Paths
* Components
* Schemas
* Security Schemes
* Examples
* Error Responses
* Tags by module

Documentation should be generated automatically and published for internal developers.

---

# Chapter 357 — API Deprecation Policy

* Mark deprecated endpoints in OpenAPI.
* Provide replacement endpoints.
* Maintain backward compatibility during the deprecation window.
* Announce breaking changes before removal.

---

# Chapter 358 — SDK Guidelines

Official SDKs (Future)

* JavaScript / TypeScript
* Flutter (Dart)
* Kotlin (Android)
* Swift (iOS)

SDK Features

* Authentication
* Automatic Token Refresh
* Error Handling
* Pagination Helpers
* Retry Logic
* File Upload Helpers

---

# Chapter 359 — API Performance Targets

| Metric                | Target   |
| --------------------- | -------- |
| Average Response Time | < 300 ms |
| P95 Response Time     | < 800 ms |
| Availability          | 99.95%   |
| Error Rate            | < 0.1%   |
| Authentication        | < 200 ms |

---

# Chapter 360 — API Quality Checklist

* ✅ Versioned Endpoints
* ✅ OpenAPI Documentation
* ✅ Consistent Response Format
* ✅ Validation Layer
* ✅ RBAC Authorization
* ✅ Pagination
* ✅ Filtering & Sorting
* ✅ Rate Limiting
* ✅ Idempotency
* ✅ Webhooks
* ✅ Realtime Events
* ✅ Audit Logging
* ✅ Performance Monitoring

---

# 📌 Volume 23 Complete

## 🔜 Next: **Volume 24 — Enterprise Security Architecture, Compliance & Governance**

এটি Security-এর সবচেয়ে গুরুত্বপূর্ণ অংশ হবে। এতে থাকবে:

* Zero Trust Security Model
* Complete RBAC & ABAC Design
* Permission Matrix (100+ Permissions)
* JWT & Session Security
* Encryption Standards
* Secrets Management
* OWASP Top 10 Mitigation
* Fraud Detection
* GDPR / Privacy Compliance
* Bangladesh ICT Act & Data Governance Considerations
* Incident Response Plan
* Business Continuity
* Security Operations (SecOps)
* Penetration Testing Framework
* Enterprise Security Checklist

এই Volume সম্পন্ন হলে Madventure-এর Architecture আন্তর্জাতিক মানের Enterprise Security Framework-এর সাথে সামঞ্জস্যপূর্ণ হবে।
