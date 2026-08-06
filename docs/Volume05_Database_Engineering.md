# MADVENTURE / Travel Tracer

# Enterprise Software Documentation

## Version 5.0

# Volume 05 — Enterprise Database Engineering Guide

---

# Chapter 5 — Enterprise Database Architecture

---

# 5.1 Database Design Principles

Madventure Database নিম্নলিখিত Enterprise Principles অনুসরণ করবে।

## Standards

* PostgreSQL 16+
* UUID Primary Keys
* Third Normal Form (3NF), যেখানে প্রয়োজন BCNF
* Foreign Key Constraints
* Check Constraints
* Transactions (ACID)
* Soft Delete
* Audit Trail
* Row Level Security (RLS)
* Optimistic Locking (যেখানে প্রযোজ্য)
* UTC Timestamp

---

# 5.2 Database Architecture Overview

```text
                    PostgreSQL Database

                           │
 ┌────────────┬────────────┬──────────────┬──────────────┐
 │            │            │              │              │
 Users     Travel       Booking      Financial      Community
 │            │            │              │              │
 └────────────┴────────────┴──────────────┴──────────────┘
                     │
               Analytics Layer
```

---

# 5.3 Database Modules

Database মোট ১৪টি Domain-এ ভাগ করা হবে।

| Domain         | Tables |
| -------------- | ------ |
| Authentication | 6      |
| User           | 10     |
| Destination    | 8      |
| Tours          | 12     |
| Hotels         | 15     |
| Booking        | 12     |
| Payment        | 10     |
| Wallet         | 6      |
| Community      | 8      |
| Reviews        | 4      |
| Notifications  | 5      |
| Analytics      | 8      |
| CMS            | 6      |
| Security       | 8      |

মোট আনুমানিক **১০০+ Table**।

---

# 5.4 Naming Convention

## Tables

```text
plural_snake_case
```

Examples

```text
users

tour_schedules

hotel_rooms

wallet_transactions
```

---

## Columns

```text
snake_case
```

Example

```text
created_at

updated_at

booking_status

payment_status
```

---

## Primary Key

সব Table

```text
id UUID
```

---

## Foreign Key

```text
user_id

hotel_id

tour_id

booking_id
```

---

# 5.5 Common Columns

প্রতিটি Master Table-এ থাকবে:

| Column     | Purpose         |
| ---------- | --------------- |
| id         | UUID            |
| created_at | Record Creation |
| updated_at | Last Update     |
| deleted_at | Soft Delete     |
| created_by | User ID         |
| updated_by | User ID         |
| version    | Optimistic Lock |

---

# 5.6 Authentication Domain

Tables

```text
users

user_profiles

user_sessions

user_devices

user_login_history

password_reset_tokens
```

---

## Relationships

```text
users

↓

1 : 1

↓

user_profiles
```

---

```text
users

↓

1 : N

↓

sessions
```

---

```text
users

↓

1 : N

↓

devices
```

---

# 5.7 User Domain

Tables

```text
travel_preferences

travel_badges

travel_statistics

wishlists

saved_itineraries

favorite_places

emergency_contacts

user_documents

notification_preferences

privacy_settings
```

---

# 5.8 Destination Domain

Tables

```text
divisions

districts

upazilas

places

place_categories

place_images

travel_guides

seasonal_information
```

---

Relationships

```text
Division

↓

District

↓

Upazila

↓

Place
```

---

# 5.9 Tour Domain

Tables

```text
tour_agencies

agency_staff

agency_documents

tours

tour_categories

tour_schedules

tour_itineraries

tour_images

tour_prices

tour_availability

tour_discounts

tour_coupons
```

---

Relationship

```text
Agency

↓

Tours

↓

Schedules

↓

Bookings
```

---

# 5.10 Hotel Domain

Tables

```text
hotels

hotel_branches

hotel_rooms

room_types

room_images

room_inventory

room_rates

hotel_facilities

hotel_policies

hotel_staff

hotel_documents

hotel_reviews

hotel_photos

maintenance_logs

housekeeping_logs
```

---

# 5.11 Booking Domain

সবচেয়ে গুরুত্বপূর্ণ Domain।

Tables

```text
bookings

booking_items

booking_travelers

booking_history

booking_logs

booking_status_history

booking_cancellations

booking_refunds

booking_documents

booking_invoices

booking_notes

booking_payments
```

---

Relationship

```text
Booking

↓

Booking Items

↓

Traveler

↓

Payments

↓

Invoice
```

---

# 5.12 Payment Domain

Tables

```text
payment_transactions

payment_gateways

payment_callbacks

refund_requests

refund_transactions

gateway_logs

gateway_errors

payment_methods

payment_reconciliation

commission_settlements
```

---

# 5.13 Wallet Domain

Tables

```text
wallets

wallet_ledger

wallet_limits

wallet_transfers

cashback_rewards

wallet_audit
```

---

Ledger Rule

```text
Balance

=

Credits

-

Debits
```

---

# 5.14 Community Domain

Tables

```text
forum_threads

forum_replies

thread_votes

thread_reports

saved_threads

user_followers

activity_feed

media_uploads
```

---

# 5.15 Notification Domain

Tables

```text
notifications

notification_queue

email_logs

sms_logs

push_logs
```

---

# 5.16 Analytics Domain

Tables

```text
events

daily_reports

monthly_reports

dashboard_cache

user_statistics

agency_statistics

hotel_statistics

ai_usage_logs
```

---

# 5.17 CMS Domain

Tables

```text
pages

blogs

banners

faq

seo_settings

media_library
```

---

# 5.18 Security Domain

Tables

```text
audit_logs

api_logs

security_events

blocked_ips

device_blacklist

role_permissions

system_settings

feature_flags
```

---

# 5.19 Index Strategy

Mandatory Indexes

```sql
users(email)

users(phone)

bookings(user_id)

bookings(status)

payments(transaction_id)

wallet_ledger(wallet_id)

notifications(user_id)

tours(destination_id)

hotel_rooms(hotel_id)
```

Composite Index

```sql
(user_id,status)

(tour_id,start_date)

(room_id,date)
```

---

# 5.20 Partitioning Strategy

বড় Table-গুলোর জন্য Partition ব্যবহার করতে হবে।

Examples

```text
audit_logs

payment_transactions

events

notifications
```

Partition

Monthly

---

# 5.21 Materialized Views

Performance বৃদ্ধির জন্য:

```text
top_destinations

agency_monthly_revenue

hotel_occupancy

daily_booking_summary

popular_tours
```

---

# 5.22 Stored Procedures

Mandatory Procedures

```text
CreateBooking()

ConfirmPayment()

RefundBooking()

WalletTransfer()

CloseExpiredBooking()

GenerateInvoice()
```

---

# 5.23 Database Triggers

Triggers

```text
Update updated_at

Audit Changes

Wallet Balance Update

Inventory Update

Booking Status Update

Notification Creation
```

---

# 5.24 Row Level Security (RLS)

সব Sensitive Table-এ RLS Enable করতে হবে।

Examples

```sql
bookings

wallets

payments

notifications

reviews
```

Policy Example

User শুধুমাত্র নিজের Booking দেখতে পারবে।

Agency শুধুমাত্র নিজের Tour-এর Booking দেখতে পারবে।

Admin সব দেখতে পারবে।

---

# 5.25 Data Retention Policy

| Data          | Retention |
| ------------- | --------- |
| Login Logs    | 1 Year    |
| Payment Logs  | 7 Years   |
| Audit Logs    | 5 Years   |
| Notifications | 180 Days  |
| AI Logs       | 90 Days   |
| Booking       | Permanent |
| Invoice       | 10 Years  |

---

# 5.26 Backup Strategy

Daily Incremental Backup

Weekly Full Backup

Monthly Archive

Point-in-Time Recovery (PITR)

---

# 5.27 Performance Targets

| Query          | Target  |
| -------------- | ------- |
| User Login     | <100 ms |
| Booking Search | <200 ms |
| Tour Search    | <300 ms |
| Payment Lookup | <150 ms |
| Wallet Balance | <100 ms |

---

# 5.28 Database Health Monitoring

Monitor

* Slow Queries
* Deadlocks
* Index Usage
* Table Bloat
* Connection Pool
* Disk Usage
* Replication Lag

---

# 5.29 Migration Strategy

Versioned Migrations

```text
V001

V002

V003
```

Never modify old migrations.

Always create new migration scripts.

---

# 5.30 Database Review Checklist

Production-এর আগে নিশ্চিত করতে হবে:

* সব Foreign Keys যুক্ত
* Orphan Records নেই
* Cascading Rules যাচাই করা হয়েছে
* RLS Policies Test করা হয়েছে
* Composite Indexes Optimize করা হয়েছে
* Query Plan Review সম্পন্ন
* Backup Restore সফল
* Migration Rollback পরীক্ষিত

---

# 🚀 Volume 05 শেষ হওয়ার পর আমার সবচেয়ে বড় Recommendation

বর্তমান Documentation **Enterprise Level** হলেও, এটিকে সত্যিকারের **Airbnb / Booking.com / Expedia Grade** করতে এখনো **৮টি অত্যন্ত গুরুত্বপূর্ণ Volume** যোগ করা উচিত:

1. **Volume 06 — Complete REST API Specification (300+ Endpoints)**
2. **Volume 07 — UI/UX Design System & Component Library**
3. **Volume 08 — Security Architecture (OWASP, JWT, RLS, Threat Model)**
4. **Volume 09 — DevOps, CI/CD & Infrastructure (Docker, GitHub Actions, Monitoring)**
5. **Volume 10 — Testing Strategy (Unit, Integration, E2E, Load, Security)**
6. **Volume 11 — AI Module Design (Prompt Engineering, AI Memory, Recommendation Engine)**
7. **Volume 12 — Operations Manual (SOP, Incident Response, Monitoring, Support)**
8. **Volume 13 — Product Roadmap & Release Management (Versioning, Changelog, Feature Lifecycle)**

এই ১৩টি Volume সম্পূর্ণ হলে Madventure-এর Documentation বাস্তব Enterprise Software Project-এর মতো ৮০০–১৫০০+ পৃষ্ঠার সমমানের Technical Documentation-এ পরিণত হবে, যা Development Team, QA, DevOps, DBA, Security Team এবং Product Team—সবার জন্য পূর্ণাঙ্গ Implementation Blueprint হিসেবে ব্যবহারযোগ্য হবে।
