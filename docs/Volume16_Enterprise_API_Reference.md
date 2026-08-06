# MADVENTURE / Travel Tracer

# Enterprise Documentation v6.0

# Volume 16 — Enterprise REST API Specification

---

# Chapter 136 — API Standards

## Base URL

```text
Development
https://dev-api.madventure.com/api/v1

Staging
https://staging-api.madventure.com/api/v1

Production
https://api.madventure.com/api/v1
```

---

## Authentication

All Protected APIs

```
Authorization: Bearer <JWT_ACCESS_TOKEN>
```

---

## Headers

```http
Content-Type: application/json
Accept: application/json
Accept-Language: bn
X-Request-ID: UUID
X-App-Version: 1.0.0
```

---

# Chapter 137 — Response Standard

## Success

```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {},
  "meta": {},
  "timestamp": "2026-07-07T10:30:00Z"
}
```

---

## Error

```json
{
  "success": false,
  "error": {
    "code": "BOOK_001",
    "message": "No available seats"
  },
  "timestamp": "2026-07-07T10:30:00Z"
}
```

---

# Chapter 138 — Authentication APIs

## Register

```
POST /auth/register
```

Body

```json
{
  "full_name":"John Doe",
  "email":"john@example.com",
  "phone":"017XXXXXXXX",
  "password":"********"
}
```

Response

```json
{
 "user_id":"UUID",
 "email_verified":false
}
```

---

## Login

```
POST /auth/login
```

Response

```json
{
 "access_token":"JWT",
 "refresh_token":"JWT",
 "expires_in":3600
}
```

---

## Refresh Token

```
POST /auth/refresh
```

---

## Logout

```
POST /auth/logout
```

---

## Forgot Password

```
POST /auth/forgot-password
```

---

## Reset Password

```
POST /auth/reset-password
```

---

## Verify Email

```
POST /auth/verify-email
```

---

## Verify Phone

```
POST /auth/verify-phone
```

---

# Chapter 139 — User APIs

## Get Profile

```
GET /users/me
```

---

## Update Profile

```
PUT /users/me
```

---

## Change Password

```
PUT /users/change-password
```

---

## Upload Avatar

```
POST /users/avatar
```

---

## Delete Account

```
DELETE /users/me
```

---

# Chapter 140 — Destination APIs

## Get Districts

```
GET /districts
```

Supports

* Pagination
* Search
* Division Filter

---

## District Details

```
GET /districts/{id}
```

---

## Places

```
GET /places
```

Filters

* Category
* District
* Featured

---

## Place Details

```
GET /places/{id}
```

---

# Chapter 141 — Tour APIs

## Tour List

```
GET /tours
```

Filters

* Destination
* Price
* Duration
* Rating
* Category

Sorting

* Price
* Rating
* Popularity

---

## Tour Details

```
GET /tours/{id}
```

---

## Featured Tours

```
GET /tours/featured
```

---

## Search Tours

```
GET /tours/search
```

Parameters

```
keyword

price_min

price_max

date

district

sort
```

---

# Chapter 142 — Agency APIs

## Agency Dashboard

```
GET /agency/dashboard
```

---

## Create Tour

```
POST /agency/tours
```

---

## Update Tour

```
PUT /agency/tours/{id}
```

---

## Delete Tour

```
DELETE /agency/tours/{id}
```

---

## Tour Bookings

```
GET /agency/bookings
```

---

# Chapter 143 — Hotel APIs

## Hotel List

```
GET /hotels
```

---

## Hotel Details

```
GET /hotels/{id}
```

---

## Hotel Rooms

```
GET /hotels/{id}/rooms
```

---

## Hotel Availability

```
GET /hotels/{id}/availability
```

---

## Create Hotel

```
POST /hotel-owner/hotels
```

---

# Chapter 144 — Booking APIs

## Create Booking

```
POST /bookings
```

Body

```json
{
 "schedule_id":"UUID",
 "travelers":[]
}
```

---

## Booking Details

```
GET /bookings/{id}
```

---

## Booking List

```
GET /bookings
```

---

## Cancel Booking

```
POST /bookings/{id}/cancel
```

---

## Download Invoice

```
GET /bookings/{id}/invoice
```

---

# Chapter 145 — Payment APIs

## Create Payment

```
POST /payments/create
```

---

## Verify Payment

```
POST /payments/verify
```

---

## Payment History

```
GET /payments
```

---

## Refund Request

```
POST /payments/refund
```

---

# Chapter 146 — Wallet APIs

## Wallet Summary

```
GET /wallet
```

---

## Wallet Transactions

```
GET /wallet/ledger
```

---

## Add Money

```
POST /wallet/deposit
```

---

## Withdraw

```
POST /wallet/withdraw
```

---

# Chapter 147 — Review APIs

```
POST /reviews
GET /reviews
PUT /reviews/{id}
DELETE /reviews/{id}
```

---

# Chapter 148 — Wishlist APIs

```
GET /wishlist

POST /wishlist

DELETE /wishlist/{id}
```

---

# Chapter 149 — Community APIs

```
GET /forum

POST /forum

GET /forum/{id}

PUT /forum/{id}

DELETE /forum/{id}
```

Replies

```
POST /forum/{id}/reply
```

---

# Chapter 150 — Lost & Found APIs

```
GET /lost-found

POST /lost-found

PUT /lost-found/{id}

DELETE /lost-found/{id}
```

---

# Chapter 151 — AI Planner APIs

## Generate Planner

```
POST /planner/generate
```

Request

```json
{
 "destination":"Cox's Bazar",
 "days":3,
 "budget":15000,
 "interests":["Beach","Photography"]
}
```

---

## Saved Plans

```
GET /planner
```

---

## Update Plan

```
PUT /planner/{id}
```

---

## Export PDF

```
GET /planner/{id}/pdf
```

---

# Chapter 152 — Notification APIs

```
GET /notifications

PUT /notifications/read

DELETE /notifications/{id}
```

---

# Chapter 153 — Admin APIs

Users

```
GET /admin/users

PUT /admin/users/{id}

DELETE /admin/users/{id}
```

---

Bookings

```
GET /admin/bookings
```

---

Payments

```
GET /admin/payments
```

---

Reports

```
GET /admin/reports
```

---

Dashboard

```
GET /admin/dashboard
```

---

# Chapter 154 — Analytics APIs

```
GET /analytics/revenue

GET /analytics/bookings

GET /analytics/users

GET /analytics/tours

GET /analytics/hotels
```

---

# Chapter 155 — Pagination Standard

```
?page=1

&limit=20

&sort=created_at

&order=desc
```

Response

```json
{
 "meta":{
   "page":1,
   "limit":20,
   "total":530,
   "pages":27
 }
}
```

---

# Chapter 156 — Filtering Standard

```
GET /tours

?district=coxsbazar

&price_min=1000

&price_max=10000

&rating=4

&featured=true
```

---

# Chapter 157 — HTTP Status Codes

| Code | Meaning               |
| ---- | --------------------- |
| 200  | OK                    |
| 201  | Created               |
| 204  | No Content            |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 409  | Conflict              |
| 422  | Validation Failed     |
| 429  | Rate Limited          |
| 500  | Internal Server Error |

---

# Chapter 158 — Rate Limits

| Endpoint | Limit         |
| -------- | ------------- |
| Login    | 5/min         |
| Register | 3/hour        |
| Booking  | 10/min        |
| Planner  | 20/day (Free) |
| Payment  | 20/hour       |
| Search   | 120/min       |

---

# Chapter 159 — Webhooks

Payment Gateway

```
POST /webhooks/payment
```

Booking

```
POST /webhooks/booking
```

Notification

```
POST /webhooks/notification
```

Security

* Signature Verification
* Timestamp Validation
* Replay Protection
* Idempotency Check

---

# Chapter 160 — API Versioning

```
/api/v1

/api/v2
```

Breaking changes only in a new major version.

---

# Chapter 161 — Idempotency

Required for:

* Payments
* Bookings
* Refunds
* Wallet Deposit
* Wallet Withdrawal

Header:

```http
Idempotency-Key: 7b7d9f87-8c62-49b4-9b14-6b0c0d6d7f92
```

---

# Chapter 162 — API Security

* JWT Access Token
* Refresh Token Rotation
* CORS Policy
* CSRF Protection (where applicable)
* Rate Limiting
* Request Validation
* SQL Injection Protection
* XSS Protection
* Security Headers (CSP, HSTS, X-Frame-Options)

---

# Chapter 163 — API Deprecation Policy

* Minimum 6 months notice
* Deprecation response header
* Migration guide
* Sunset date published
* Backward compatibility maintained during transition

---

# 📌 Volume 16 Complete

## 🔜 Next: Volume 17 — Enterprise Production Database (100+ Tables)

এই Volume-এ শুধু টেবিলের নাম নয়, বরং একটি **বাস্তব Enterprise Database Schema** তৈরি করা হবে, যেখানে থাকবে:

* 100+ Production Tables
* Complete Foreign Key Relationships
* PostgreSQL Enums
* Constraints
* Composite Indexes
* Partitioning Strategy
* Views
* Materialized Views
* Stored Procedures
* Triggers
* Audit Triggers
* RLS Policies
* Full Backup & Migration Strategy
* Performance Optimization
* Multi-Tenant Ready Schema

এটি Madventure-এর **Production Database Blueprint** হিসেবে কাজ করবে।
