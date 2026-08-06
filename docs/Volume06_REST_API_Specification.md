# MADVENTURE / Travel Tracer

# Enterprise Software Documentation

## Version 5.0

# Volume 06 — Enterprise REST API Specification

---

# Chapter 6 — API Architecture

## 6.1 API Design Principles

Madventure API নিম্নলিখিত Enterprise Standard অনুসরণ করবে।

### Standards

* RESTful Architecture
* HTTPS Only
* JSON Payload
* JWT Authentication
* OAuth 2.0 Ready
* API Versioning
* Idempotency Support
* Cursor Pagination
* RFC 7807 Compatible Error Format
* Rate Limiting
* Request Validation

---

# 6.2 Base URL

```text
Development

https://dev-api.madventure.com/v1

Staging

https://staging-api.madventure.com/v1

Production

https://api.madventure.com/v1
```

---

# 6.3 HTTP Methods

| Method | Purpose        |
| ------ | -------------- |
| GET    | Read           |
| POST   | Create         |
| PUT    | Full Update    |
| PATCH  | Partial Update |
| DELETE | Soft Delete    |

---

# 6.4 Authentication

Public

```
GET /destinations
```

Protected

```
Authorization

Bearer JWT_TOKEN
```

---

# 6.5 Response Standard

Success

```json
{
    "success": true,
    "data": {},
    "message": "Success"
}
```

Error

```json
{
    "success": false,
    "error": {
        "code": "AUTH_001",
        "message": "Invalid Credentials"
    }
}
```

---

# AUTH MODULE

---

## Register

```
POST

/auth/register
```

Request

```json
{
    "full_name":"",
    "email":"",
    "phone":"",
    "password":""
}
```

Response

```json
{
 "user_id":"",
 "email_verified":false
}
```

---

## Login

```
POST

/auth/login
```

---

## Logout

```
POST

/auth/logout
```

---

## Refresh Token

```
POST

/auth/refresh
```

---

## Forgot Password

```
POST

/auth/forgot-password
```

---

## Reset Password

```
POST

/auth/reset-password
```

---

## Verify Email

```
POST

/auth/verify-email
```

---

## Verify Phone

```
POST

/auth/verify-phone
```

---

# PROFILE API

---

Get Profile

```
GET

/profile
```

---

Update Profile

```
PATCH

/profile
```

---

Upload Avatar

```
POST

/profile/avatar
```

---

Travel Statistics

```
GET

/profile/statistics
```

---

Achievements

```
GET

/profile/badges
```

---

# DESTINATION API

---

Get Divisions

```
GET

/divisions
```

---

Get Districts

```
GET

/districts
```

---

Get Places

```
GET

/places
```

Filters

```
District

Category

Search

Featured
```

---

Destination Details

```
GET

/places/{slug}
```

---

Nearby Places

```
GET

/places/{id}/nearby
```

---

Popular Destinations

```
GET

/destinations/popular
```

---

# TOUR API

---

List Tours

```
GET

/tours
```

Filters

* Price

* Rating

* Duration

* Category

* District

* Agency

---

Tour Details

```
GET

/ tours/{slug}
```

---

Tour Schedule

```
GET

/tours/{id}/schedules
```

---

Tour Reviews

```
GET

/tours/{id}/reviews
```

---

Related Tours

```
GET

/tours/{id}/related
```

---

Agency Tours

```
GET

/agencies/{id}/tours
```

---

# HOTEL API

---

Hotels

```
GET

/hotels
```

---

Hotel Details

```
GET

/hotels/{slug}
```

---

Hotel Rooms

```
GET

/hotels/{id}/rooms
```

---

Availability

```
GET

/hotels/{id}/availability
```

---

Reviews

```
GET

/hotels/{id}/reviews
```

---

# BOOKING API

---

Create Booking

```
POST

/bookings
```

---

Booking Details

```
GET

/bookings/{id}
```

---

Booking List

```
GET

/bookings
```

Filters

Status

Date

Type

---

Cancel Booking

```
PATCH

/bookings/{id}/cancel
```

---

Download Invoice

```
GET

/bookings/{id}/invoice
```

---

Booking Timeline

```
GET

/bookings/{id}/history
```

---

# PAYMENT API

---

Initiate Payment

```
POST

/payments/initiate
```

---

Verify Payment

```
POST

/payments/verify
```

---

Payment History

```
GET

/payments
```

---

Payment Details

```
GET

/payments/{id}
```

---

Refund

```
POST

/payments/refund
```

---

# WALLET API

---

Wallet

```
GET

/wallet
```

---

Transactions

```
GET

/wallet/transactions
```

---

Deposit

```
POST

/wallet/deposit
```

---

Withdraw

```
POST

/wallet/withdraw
```

---

Cashback

```
GET

/wallet/cashbacks
```

---

# AI API

---

Generate Planner

```
POST

/ai/planner
```

---

Save Planner

```
POST

/planners
```

---

Planner History

```
GET

/planners
```

---

Delete Planner

```
DELETE

/planners/{id}
```

---

# COMMUNITY API

---

Threads

```
GET

/forum
```

---

Create Thread

```
POST

/forum
```

---

Thread Details

```
GET

/forum/{id}
```

---

Reply

```
POST

/forum/{id}/reply
```

---

Vote

```
POST

/forum/{id}/vote
```

---

Report

```
POST

/forum/{id}/report
```

---

# REVIEW API

---

Create Review

```
POST

/reviews
```

---

Update Review

```
PATCH

/reviews/{id}
```

---

Delete Review

```
DELETE

/reviews/{id}
```

---

# WISHLIST API

---

Wishlist

```
GET

/wishlist
```

---

Add

```
POST

/wishlist
```

---

Delete

```
DELETE

/wishlist/{id}
```

---

# LOST & FOUND API

---

Items

```
GET

/lost-found
```

---

Create

```
POST

/lost-found
```

---

Claim

```
POST

/lost-found/{id}/claim
```

---

Close

```
PATCH

/lost-found/{id}/close
```

---

# NOTIFICATION API

---

Notifications

```
GET

/notifications
```

---

Read

```
PATCH

/notifications/{id}
```

---

Read All

```
PATCH

/notifications/read-all
```

---

Delete

```
DELETE

/notifications/{id}
```

---

# ADMIN API

---

Dashboard

```
GET

/admin/dashboard
```

---

Users

```
GET

/admin/users
```

---

Bookings

```
GET

/admin/bookings
```

---

Payments

```
GET

/admin/payments
```

---

Tours

```
GET

/admin/tours
```

---

Hotels

```
GET

/admin/hotels
```

---

Analytics

```
GET

/admin/analytics
```

---

Broadcast Notification

```
POST

/admin/notifications
```

---

# AGENCY API

---

Agency Dashboard

```
GET

/agency/dashboard
```

---

Create Tour

```
POST

/agency/tours
```

---

Update Tour

```
PATCH

/agency/tours/{id}
```

---

Schedules

```
POST

/agency/schedules
```

---

Revenue

```
GET

/agency/revenue
```

---

Bookings

```
GET

/agency/bookings
```

---

# HOTEL OWNER API

---

Dashboard

```
GET

/hotel-owner/dashboard
```

---

Hotels

```
POST

/hotel-owner/hotels
```

---

Rooms

```
POST

/hotel-owner/rooms
```

---

Inventory

```
PATCH

/hotel-owner/inventory
```

---

Bookings

```
GET

/hotel-owner/bookings
```

---

# 6.6 Pagination Standard

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 250,
    "total_pages": 13,
    "next_cursor": "eyJpZCI6..."
  }
}
```

---

# 6.7 Rate Limits

| API        | Limit         |
| ---------- | ------------- |
| Login      | 5/min/IP      |
| Register   | 3/hour/IP     |
| Planner    | 20/day (Free) |
| Booking    | 30/hour       |
| Payment    | 10/hour       |
| Forum Post | 20/day        |
| Review     | 10/day        |

---

# 6.8 API Versioning

Current Version

```
v1
```

Future

```
v2

v3
```

Breaking changes শুধুমাত্র Major Version-এ হবে।

---

# 6.9 Webhooks

Supported Events

* payment.success
* payment.failed
* booking.confirmed
* booking.cancelled
* refund.completed
* agency.verified

---

# 6.10 API Documentation

Production-এ OpenAPI 3.1 Specification বজায় রাখা হবে।

প্রয়োজনীয়:

* Swagger UI
* Redoc
* Postman Collection
* API Changelog
* Deprecation Policy
