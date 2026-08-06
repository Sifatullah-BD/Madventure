# MADVENTURE / Travel Tracer

# Enterprise Documentation v6.0

# Volume 15 — Enterprise Data Dictionary

---

# Chapter 109 — Database Standards

## Database Engine

| Item      | Value                |
| --------- | -------------------- |
| Database  | PostgreSQL 16        |
| ORM       | Drizzle ORM / Prisma |
| Charset   | UTF-8                |
| Collation | en_US.UTF-8          |
| UUID      | Version 4            |
| Timezone  | UTC                  |

---

## Global Table Rules

প্রতিটি Table-এ থাকবে

```text
id UUID PRIMARY KEY

created_at TIMESTAMP

updated_at TIMESTAMP

deleted_at TIMESTAMP NULL

created_by UUID

updated_by UUID

status

version INTEGER

is_active BOOLEAN
```

---

# Chapter 110 — Table : users

## Purpose

Platform-এর সকল Authentication User Store করবে।

---

### Columns

| Column          | Type         | Nullable | Description         |
| --------------- | ------------ | -------- | ------------------- |
| id              | UUID         | No       | Primary Key         |
| email           | VARCHAR(255) | No       | Unique Email        |
| phone           | VARCHAR(20)  | Yes      | Phone Number        |
| password_hash   | TEXT         | No       | Encrypted Password  |
| role            | ENUM         | No       | User Role           |
| status          | ENUM         | No       | Active / Suspended  |
| email_verified  | BOOLEAN      | No       | Verification Status |
| phone_verified  | BOOLEAN      | No       | Verification Status |
| last_login      | TIMESTAMP    | Yes      | Last Login          |
| failed_attempts | INTEGER      | No       | Login Failure Count |

---

## Index

```sql
CREATE UNIQUE INDEX idx_users_email ON users(email);

CREATE UNIQUE INDEX idx_users_phone ON users(phone);

CREATE INDEX idx_users_role ON users(role);

CREATE INDEX idx_users_status ON users(status);
```

---

## Relationships

```
users

↓

user_profiles

↓

wallets

↓

bookings

↓

notifications

↓

audit_logs
```

---

# Chapter 111 — user_profiles

Purpose

Store Personal Information

---

Columns

| Name            | Type    |
| --------------- | ------- |
| full_name       | VARCHAR |
| username        | VARCHAR |
| avatar_url      | TEXT    |
| cover_photo_url | TEXT    |
| gender          | ENUM    |
| date_of_birth   | DATE    |
| district        | VARCHAR |
| nationality     | VARCHAR |
| travel_score    | INTEGER |
| completed_trips | INTEGER |

---

Business Rules

* Username Unique
* Age ≥ 13
* Avatar Optional
* One Profile Per User

---

# Chapter 112 — districts

Purpose

Bangladesh Administrative District

---

Columns

| Column        | Description     |
| ------------- | --------------- |
| name          | District Name   |
| division      | Parent Division |
| slug          | URL Slug        |
| latitude      | GPS             |
| longitude     | GPS             |
| tourism_score | Ranking         |
| image_url     | Cover           |

---

Relationship

```
District

↓

Places

↓

Hotels

↓

Tours
```

---

# Chapter 113 — places

Purpose

Tourist Attractions

---

Columns

| Column      | Description    |
| ----------- | -------------- |
| district_id | FK             |
| title       | Name           |
| description | Details        |
| category    | Beach, Hill    |
| entry_fee   | Ticket         |
| duration    | Visit Duration |
| featured    | Homepage       |

---

Indexes

```sql
district_id

category

featured
```

---

# Chapter 114 — tours

Purpose

Store Tour Packages

---

Columns

| Column        | Description |
| ------------- | ----------- |
| agency_id     | Owner       |
| destination   | FK          |
| duration_days | Trip Length |
| price         | Base Price  |
| max_capacity  | Seats       |
| featured      | Home        |
| published     | Live Status |

---

Rules

* Price > 0
* Capacity > 0
* Agency Verified
* Cover Image Required

---

# Chapter 115 — tour_schedules

Purpose

Inventory Control

---

Columns

| Column          | Description |
| --------------- | ----------- |
| tour_id         | FK          |
| start_date      | Start       |
| end_date        | End         |
| seats_total     | Capacity    |
| seats_booked    | Booked      |
| seats_available | Remaining   |

---

Constraint

```
Booked ≤ Total
```

---

# Chapter 116 — hotels

Purpose

Hotel Master

---

Columns

| Column      | Description |
| ----------- | ----------- |
| owner_id    | FK          |
| district_id | FK          |
| hotel_name  | Name        |
| star_rating | 1–5         |
| latitude    | GPS         |
| longitude   | GPS         |
| amenities   | JSONB       |

---

Relationship

```
Hotel

↓

Rooms

↓

Inventory

↓

Bookings
```

---

# Chapter 117 — hotel_rooms

Columns

* room_type
* max_guest
* total_rooms
* base_price
* amenities

---

Rule

```
Total Rooms

>

0
```

---

# Chapter 118 — hotel_inventory

Inventory Table

Daily Record

```
Date

Available

Booked

Blocked
```

---

# Chapter 119 — bookings

Master Booking Table

---

Columns

| Column         | Description |
| -------------- | ----------- |
| booking_code   | Public ID   |
| user_id        | FK          |
| payment_status | Enum        |
| booking_status | Enum        |
| total_amount   | Final       |
| currency       | BDT         |

---

Booking Status

```
Draft

Pending

Confirmed

Completed

Cancelled

Refunded
```

---

# Chapter 120 — booking_items

Stores

* Tour
* Hotel
* Guide
* Activity

---

Relationship

```
Booking

↓

Booking Items
```

---

# Chapter 121 — booking_travelers

Purpose

Traveler Manifest

Columns

* Name
* Gender
* Age
* Passport/NID (Optional)
* Emergency Contact
* Medical Note (Optional)

---

# Chapter 122 — payment_transactions

Columns

* Gateway
* Amount
* Currency
* Gateway Response
* Transaction ID
* Callback Time
* Settlement Status

---

Indexes

```
Transaction ID

Booking ID

User ID
```

---

# Chapter 123 — wallets

Purpose

Current Balance

---

Relationship

```
Wallet

↓

Wallet Ledger

↓

Settlement
```

---

# Chapter 124 — wallet_ledger

Columns

* Debit
* Credit
* Balance After
* Reference
* Remarks

---

Rule

```
Never Delete Ledger
```

---

# Chapter 125 — notifications

Columns

* User
* Title
* Message
* Type
* Read
* Created

---

Notification Types

* Booking
* Payment
* Promotion
* Reminder
* Emergency

---

# Chapter 126 — audit_logs

Purpose

Complete System History

Columns

* Actor
* Action
* Entity
* Old Value
* New Value
* IP
* Browser

---

Retention

```
7 Years
```

---

# Chapter 127 — reviews

Columns

* Rating
* Review
* Images
* Verified Purchase
* Helpful Count

---

Rule

```
Verified Booking Only
```

---

# Chapter 128 — wishlists

Stores

* Tour
* Hotel
* Place

---

Rule

```
Unique

User + Item
```

---

# Chapter 129 — forum_threads

Columns

* Title
* Body
* Tags
* Views
* Upvotes
* Status

---

Moderation

* Spam
* Reported
* Deleted
* Hidden

---

# Chapter 130 — reports

Purpose

User Reports

Reasons

* Spam
* Fraud
* Fake
* Abuse
* Copyright

---

# Chapter 131 — coupons

Columns

* Code
* Discount
* Expiry
* Usage Limit
* Vendor Scope
* Active

---

# Chapter 132 — subscriptions

Plans

* Free
* Premium
* Agency
* Enterprise

---

# Chapter 133 — commissions

Tracks

* Platform Revenue
* Agency Revenue
* Settlement
* VAT

---

# Chapter 134 — analytics_events

Tracks Every Important Event

Examples

```
login

search

view_tour

book

payment

refund

planner

review
```

---

# Chapter 135 — Master Relationship Summary

```text
Users
 ├── User Profile
 ├── Wallet
 │    └── Wallet Ledger
 ├── Bookings
 │    ├── Booking Items
 │    ├── Travelers
 │    └── Payments
 ├── Notifications
 ├── Reviews
 ├── Wishlist
 ├── Forum
 └── Audit Logs

Districts
 ├── Places
 ├── Hotels
 │    ├── Rooms
 │    │    └── Inventory
 │    └── Bookings
 └── Tours
      ├── Schedules
      ├── Bookings
      └── Reviews
```

---

# 📌 Volume 15 Complete

## 🔜 Next Volume 16 — Complete Enterprise API Reference (OpenAPI Style)

এখানে থাকবে:

* **100+ REST API Endpoint**
* Authentication APIs
* User APIs
* Tour APIs
* Hotel APIs
* Booking APIs
* Payment APIs
* Wallet APIs
* Community APIs
* AI Planner APIs
* Notification APIs
* Admin APIs
* Analytics APIs
* Request/Response JSON
* HTTP Status Codes
* Validation Rules
* Pagination
* Filtering
* Sorting
* Rate Limits
* Webhooks
* API Versioning
* Idempotency Keys
* Error Response Standards

এটি শেষ হলে Madventure-এর Backend API Documentation সম্পূর্ণ Enterprise-Grade হবে এবং Frontend, Mobile App ও Third-party Integration Team সরাসরি এটি অনুসরণ করে কাজ করতে পারবে।
