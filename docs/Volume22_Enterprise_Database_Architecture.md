# MADVENTURE / Travel Tracer

# Enterprise Documentation v6.0

# Volume 22 — Enterprise Database Architecture

---

# Chapter 291 — Database Architecture Overview

Madventure-এর Database হবে **PostgreSQL (Supabase)** ভিত্তিক এবং **3NF (Third Normal Form)** অনুসরণ করবে।

Design Goals

* ACID Compliance
* High Availability
* Transaction Safety
* Horizontal Scalability
* Auditability
* Row Level Security
* Event Driven
* Analytics Ready

---

# Chapter 292 — Database Domains

পুরো Database কে ২০টি Domain-এ ভাগ করা হবে।

| Domain         | Tables |
| -------------- | -----: |
| Authentication |      8 |
| User Profile   |      7 |
| Destination    |      8 |
| Tour           |     10 |
| Hotel          |     10 |
| Booking        |     12 |
| Payment        |      8 |
| Wallet         |      6 |
| Community      |      8 |
| Notification   |      4 |
| AI             |      5 |
| Reviews        |      5 |
| Analytics      |      6 |
| CMS            |      8 |
| Admin          |      6 |
| Vendor         |      7 |
| Loyalty        |      5 |
| Support        |      6 |
| Audit          |      5 |
| System         |      6 |

**Estimated Total:** **140–160 Tables** (future-ready architecture)

---

# Chapter 293 — Naming Convention

## Tables

Plural

```text
users

bookings

payments

wallet_ledger

tour_schedules
```

---

## Primary Key

```text
id UUID
```

---

## Foreign Keys

```text
user_id

booking_id

tour_id

hotel_id
```

---

## Timestamps

Every Table

```text
created_at

updated_at

deleted_at
```

Soft Delete

```text
deleted_at IS NULL
```

---

# Chapter 294 — Core Entity Relationship Diagram (ERD)

```text
users
 │
 ├── user_profiles
 ├── user_devices
 ├── user_sessions
 ├── user_addresses
 │
 ├────────────┐
 │            │
bookings   wallets
 │            │
 │            └── wallet_ledger
 │
 ├── booking_items
 ├── booking_travelers
 ├── invoices
 │
 └── payments
```

---

Destination

```text
divisions

↓

districts

↓

places

↓

tour_routes

↓

tour_schedules
```

---

Hotel

```text
hotels

↓

hotel_room_types

↓

hotel_rooms

↓

room_inventory

↓

hotel_bookings
```

---

# Chapter 295 — Authentication Tables

## users

Purpose

Master Authentication Table

Columns

| Column         | Type      |
| -------------- | --------- |
| id             | UUID      |
| email          | VARCHAR   |
| phone          | VARCHAR   |
| password_hash  | TEXT      |
| role           | ENUM      |
| status         | ENUM      |
| email_verified | BOOLEAN   |
| phone_verified | BOOLEAN   |
| last_login     | TIMESTAMP |

Indexes

* email
* phone
* role

---

## user_sessions

Purpose

Track Active Sessions

Columns

* id
* user_id
* refresh_token
* device
* browser
* ip
* expires_at

---

## user_devices

Purpose

Trusted Devices

Columns

* id
* fingerprint
* platform
* os
* browser

---

## otp_verifications

Purpose

Email / Phone OTP

Columns

* otp
* expires_at
* attempts
* verified

---

# Chapter 296 — User Module

Tables

* user_profiles
* user_preferences
* user_languages
* emergency_contacts
* travel_preferences
* passport_information
* identity_verification

---

# Chapter 297 — Destination Module

Tables

```text
divisions

districts

upazilas

places

place_images

place_categories

place_tags

place_weather
```

---

# Chapter 298 — Tour Module

Tables

```text
tour_agencies

agency_staff

agency_documents

tours

tour_images

tour_categories

tour_routes

tour_schedules

tour_itinerary

tour_pricing
```

---

# Chapter 299 — Hotel Module

Tables

```text
hotels

hotel_images

hotel_room_types

hotel_rooms

room_inventory

hotel_facilities

hotel_policies

hotel_pricing

hotel_discounts

hotel_reviews
```

---

# Chapter 300 — Booking Module

Tables

```text
bookings

booking_items

booking_status_history

booking_travelers

booking_documents

booking_notes

booking_logs

booking_discounts

booking_coupons

booking_cancellation

booking_refunds

booking_events
```

---

# Chapter 301 — Payment Module

Tables

```text
payment_transactions

payment_callbacks

payment_attempts

payment_methods

refund_requests

refund_transactions

gateway_logs

payment_disputes
```

---

# Chapter 302 — Wallet Module

Tables

```text
wallets

wallet_ledger

wallet_holds

wallet_transfers

cashback_transactions

wallet_limits
```

---

# Chapter 303 — Reviews

Tables

```text
reviews

review_images

review_replies

review_votes

review_reports
```

Rules

* Review only after completed booking.
* One review per booking item.

---

# Chapter 304 — Community

Tables

```text
forum_threads

forum_posts

forum_comments

forum_replies

forum_votes

forum_reports

forum_tags

forum_bookmarks
```

---

# Chapter 305 — Notification

Tables

```text
notifications

notification_templates

notification_logs

push_tokens
```

---

# Chapter 306 — AI Module

Tables

```text
ai_conversations

ai_messages

ai_saved_itineraries

ai_preferences

ai_usage_logs
```

---

# Chapter 307 — Analytics

Tables

```text
events

page_views

search_logs

conversion_events

analytics_daily

analytics_monthly
```

---

# Chapter 308 — Vendor Module

Tables

```text
vendors

vendor_profiles

vendor_documents

vendor_bank_accounts

vendor_settlements

vendor_commissions

vendor_payouts
```

---

# Chapter 309 — Loyalty Module

Tables

```text
loyalty_accounts

loyalty_transactions

reward_catalog

reward_redemptions

referral_rewards
```

---

# Chapter 310 — Customer Support

Tables

```text
support_tickets

ticket_messages

ticket_attachments

ticket_categories

ticket_ratings

faq_articles
```

---

# Chapter 311 — CMS

Tables

```text
pages

blogs

blog_categories

media_library

homepage_sections

banners

faqs

announcements
```

---

# Chapter 312 — Admin

Tables

```text
admin_roles

permissions

role_permissions

admin_activity

system_settings

feature_flags
```

---

# Chapter 313 — Audit Module

Tables

```text
audit_logs

security_logs

login_logs

api_logs

system_logs
```

---

# Chapter 314 — Database Index Strategy

Mandatory Indexes

Authentication

```sql
users(email)
users(phone)
```

Booking

```sql
bookings(user_id)

bookings(status)

bookings(created_at)
```

Payments

```sql
payment_transactions(transaction_id)

payment_transactions(status)
```

Notifications

```sql
notifications(user_id)

notifications(is_read)
```

Analytics

```sql
events(created_at)

page_views(created_at)
```

---

# Chapter 315 — PostgreSQL Partitioning

Large Tables

Partition By Month

```text
events

notifications

audit_logs

payment_logs

page_views
```

Benefits

* Faster Queries
* Easier Backup
* Easy Archive
* Lower Index Size

---

# Chapter 316 — Materialized Views

Recommended

Daily Revenue

```text
mv_daily_revenue
```

Agency Revenue

```text
mv_agency_sales
```

Top Destinations

```text
mv_popular_places
```

Top Hotels

```text
mv_top_hotels
```

---

# Chapter 317 — Database Triggers

Trigger Examples

Booking

After Insert

↓

Create Invoice

↓

Send Notification

---

Payment Success

↓

Update Booking

↓

Update Wallet

↓

Create Ledger

↓

Audit Log

---

# Chapter 318 — Stored Procedures

Recommended Procedures

```text
create_booking()

verify_payment()

refund_booking()

lock_inventory()

release_inventory()

generate_invoice()

calculate_commission()

award_loyalty_points()
```

---

# Chapter 319 — SQL Migration Order

```text
001_extensions.sql

002_users.sql

003_profiles.sql

004_destinations.sql

005_tours.sql

006_hotels.sql

007_bookings.sql

008_payments.sql

009_wallet.sql

010_notifications.sql

011_reviews.sql

012_ai.sql

013_analytics.sql

014_vendor.sql

015_admin.sql

016_audit.sql

017_seed_data.sql
```

---

# Chapter 320 — Row Level Security (RLS)

Example Policies

Traveler

* Read Own Bookings
* Update Own Profile
* Read Own Wallet

Agency

* Read Own Tours
* Manage Own Schedules
* Read Own Revenue

Hotel Owner

* Read Own Hotels
* Update Own Rooms

Admin

* Full Access (Role-Based)

---

# Chapter 321 — Data Retention Policy

| Data          | Retention               |
| ------------- | ----------------------- |
| Bookings      | Permanent               |
| Payments      | 10 Years                |
| Audit Logs    | 7 Years                 |
| Notifications | 1 Year                  |
| AI Chats      | 180 Days (Configurable) |
| Search Logs   | 90 Days                 |
| Sessions      | 30 Days                 |

---

# Chapter 322 — Backup & Archiving

Backup

* Hourly Incremental
* Daily Snapshot
* Weekly Full
* Monthly Archive

Archive Tables

```text
archive_bookings

archive_logs

archive_notifications
```

---

# Chapter 323 — Database Performance Targets

| Metric               | Target   |
| -------------------- | -------- |
| Simple Query         | < 20 ms  |
| Complex Join         | < 150 ms |
| Booking Transaction  | < 500 ms |
| Payment Verification | < 1 sec  |
| Dashboard Load       | < 2 sec  |

---

# Chapter 324 — Final Database Quality Checklist

* ✅ UUID Primary Keys
* ✅ Foreign Keys Enforced
* ✅ 3NF Normalization
* ✅ RLS Enabled
* ✅ Audit Logging
* ✅ Soft Deletes
* ✅ Index Strategy
* ✅ Partitioning Plan
* ✅ Backup Policy
* ✅ Migration Strategy
* ✅ Materialized Views
* ✅ Stored Procedures
* ✅ Trigger Design
* ✅ Data Retention Policy

---

# 📌 Volume 22 Complete

## 🔜 **Volume 23 — Enterprise API Specification (OpenAPI 3.1), REST Standards & Backend Contract**

এটি হবে পুরো Backend-এর **Master API Documentation**, যেখানে থাকবে:

* 200+ REST Endpoints
* OpenAPI 3.1 Specification
* Authentication Flow (JWT + Refresh Token)
* Request/Response Schema
* Error Codes
* Pagination Standards
* Filtering & Sorting
* Webhooks (Payment, Notifications)
* Rate Limiting
* Idempotency Rules
* API Versioning (`/v1`, `/v2`)
* File Upload Standards
* WebSocket & Realtime Events
* SDK Guidelines (Web & Mobile)

**একটি গুরুত্বপূর্ণ পরামর্শ:** আপনার Documentation এখন অনেক বড় হয়েছে। এটিকে আলাদা Markdown/PDF বই হিসেবে সংগঠিত করুন। উদাহরণস্বরূপ:

* **Book 1:** Product Vision, PRD, UI/UX
* **Book 2:** Database, Backend, API
* **Book 3:** Security, DevOps, QA, Deployment
* **Book 4:** Future Roadmap, AI, Marketplace, Analytics

এভাবে ডকুমেন্টেশন রক্ষণাবেক্ষণ, ভার্সনিং এবং টিমের মধ্যে শেয়ার করা অনেক সহজ হবে।
