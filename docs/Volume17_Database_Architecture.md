# MADVENTURE / Travel Tracer

# Enterprise Documentation v6.0

# Volume 17 — Enterprise Production Database Architecture

---

# Chapter 164 — Database Overview

## Database Engine

| Item      | Value                                 |
| --------- | ------------------------------------- |
| Database  | PostgreSQL 16                         |
| Schema    | public                                |
| Extension | pgcrypto, uuid-ossp, postgis, pg_trgm |
| Encoding  | UTF-8                                 |
| Timezone  | UTC                                   |
| ORM       | Drizzle ORM                           |

---

# Chapter 165 — Database Schemas

Production-এ সব Table `public` schema-তে না রেখে Logical Schema ব্যবহার করা উচিত।

```text
auth
core
travel
booking
payment
wallet
community
analytics
notification
audit
admin
cms
system
```

---

# Chapter 166 — Authentication Module

```text
auth.users
auth.user_profiles
auth.user_sessions
auth.user_devices
auth.refresh_tokens
auth.password_resets
auth.email_verifications
auth.phone_verifications
auth.login_history
auth.roles
auth.permissions
auth.role_permissions
auth.user_roles
auth.oauth_accounts
auth.api_keys
auth.mfa_settings
auth.mfa_backup_codes
```

---

# Chapter 167 — Traveler Module

```text
core.travelers
core.traveler_documents
core.traveler_medical_info
core.traveler_preferences
core.emergency_contacts
core.travel_history
core.favorite_categories
core.languages
core.user_languages
```

---

# Chapter 168 — Geography Module

```text
travel.countries
travel.divisions
travel.districts
travel.upazilas
travel.places
travel.place_categories
travel.place_images
travel.place_opening_hours
travel.place_faq
travel.place_weather
travel.place_tags
travel.place_transport
travel.place_entry_fee
travel.place_rules
travel.place_gallery
travel.place_reviews
```

---

# Chapter 169 — Tour Module

```text
travel.agencies
travel.agency_branches
travel.agency_documents
travel.agency_staff
travel.tours
travel.tour_categories
travel.tour_images
travel.tour_itinerary
travel.tour_schedule
travel.tour_inventory
travel.tour_pricing
travel.tour_reviews
travel.tour_faq
travel.tour_policies
travel.tour_inclusions
travel.tour_exclusions
travel.tour_guides
travel.tour_tags
```

---

# Chapter 170 — Hotel Module

```text
travel.hotels
travel.hotel_images
travel.hotel_facilities
travel.hotel_policies
travel.hotel_room_types
travel.hotel_rooms
travel.hotel_inventory
travel.hotel_pricing
travel.hotel_reviews
travel.hotel_staff
travel.hotel_services
travel.hotel_gallery
travel.hotel_nearby_places
```

---

# Chapter 171 — Local Guide Module

```text
travel.guides
travel.guide_languages
travel.guide_certifications
travel.guide_services
travel.guide_schedule
travel.guide_reviews
travel.guide_documents
travel.guide_verification
```

---

# Chapter 172 — Transport Module

```text
travel.transport_companies
travel.vehicles
travel.vehicle_types
travel.routes
travel.route_stops
travel.trip_schedule
travel.transport_booking
travel.driver_profiles
```

---

# Chapter 173 — Booking Module

```text
booking.bookings
booking.booking_items
booking.booking_travelers
booking.booking_logs
booking.booking_history
booking.booking_status_history
booking.booking_documents
booking.booking_notes
booking.booking_refunds
booking.booking_cancellation
booking.booking_checklist
booking.booking_qr_codes
booking.booking_checkin
booking.booking_checkout
```

---

# Chapter 174 — Payment Module

```text
payment.transactions
payment.payment_methods
payment.payment_gateways
payment.gateway_callbacks
payment.gateway_logs
payment.refunds
payment.refund_logs
payment.invoices
payment.invoice_items
payment.tax_configuration
payment.tax_records
payment.commissions
payment.vendor_settlement
payment.payouts
```

---

# Chapter 175 — Wallet Module

```text
wallet.wallets
wallet.wallet_ledger
wallet.wallet_transfers
wallet.wallet_deposit
wallet.wallet_withdraw
wallet.cashback
wallet.reward_points
wallet.loyalty_levels
wallet.reward_history
```

---

# Chapter 176 — Community Module

```text
community.posts
community.post_images
community.comments
community.comment_replies
community.likes
community.saved_posts
community.followers
community.user_feed
community.hashtags
community.post_reports
community.badges
community.achievements
```

---

# Chapter 177 — Lost & Found Module

```text
community.lost_items
community.found_items
community.claim_requests
community.claim_evidence
community.claim_history
community.location_history
```

---

# Chapter 178 — AI Module

```text
system.ai_prompts
system.ai_conversations
system.ai_messages
system.ai_trip_plans
system.ai_memory
system.ai_feedback
system.ai_usage
system.ai_embeddings
```

---

# Chapter 179 — Notification Module

```text
notification.notifications
notification.notification_templates
notification.push_notifications
notification.email_queue
notification.sms_queue
notification.device_tokens
notification.broadcasts
notification.notification_logs
```

---

# Chapter 180 — CMS Module

```text
cms.pages
cms.blogs
cms.blog_categories
cms.blog_comments
cms.banners
cms.faq
cms.terms
cms.privacy
cms.about
cms.contact_messages
cms.newsletters
```

---

# Chapter 181 — Analytics Module

```text
analytics.events
analytics.page_views
analytics.search_history
analytics.booking_funnel
analytics.revenue_daily
analytics.revenue_monthly
analytics.user_retention
analytics.device_statistics
analytics.country_statistics
analytics.ai_usage
```

---

# Chapter 182 — Admin Module

```text
admin.admin_users
admin.admin_roles
admin.admin_permissions
admin.admin_activity_logs
admin.system_settings
admin.feature_flags
admin.maintenance_mode
admin.announcements
admin.audit_review
admin.fraud_cases
```

---

# Chapter 183 — Audit Module

```text
audit.audit_logs
audit.security_logs
audit.api_logs
audit.database_logs
audit.error_logs
audit.login_logs
audit.export_logs
audit.deleted_records
```

---

# Chapter 184 — File Storage Module

```text
system.files
system.file_versions
system.upload_sessions
system.storage_usage
system.file_access_logs
```

---

# Chapter 185 — Search Module

```text
system.search_index
system.search_keywords
system.popular_searches
system.search_history
```

---

# Chapter 186 — Marketing Module

```text
marketing.coupons
marketing.campaigns
marketing.referrals
marketing.referral_rewards
marketing.promotions
marketing.email_campaigns
marketing.push_campaigns
marketing.discount_rules
```

---

# Chapter 187 — Enterprise Relationships

```text
User
├── Profile
├── Sessions
├── Wallet
│   ├── Ledger
│   ├── Cashback
│   └── Rewards
├── Bookings
│   ├── Booking Items
│   ├── Travelers
│   ├── Payments
│   └── QR Check-in
├── Reviews
├── Notifications
├── AI Plans
├── Community
└── Audit Logs

District
├── Places
├── Hotels
├── Tours
├── Guides
└── Transport Routes

Agency
├── Tours
├── Staff
├── Documents
├── Revenue
└── Settlements

Hotel
├── Rooms
├── Inventory
├── Pricing
├── Reviews
└── Bookings
```

---

# Chapter 188 — PostgreSQL ENUM Types

```sql
CREATE TYPE booking_status AS ENUM (
'draft',
'pending',
'confirmed',
'completed',
'cancelled',
'refunded'
);

CREATE TYPE payment_status AS ENUM (
'pending',
'processing',
'paid',
'failed',
'refunded'
);

CREATE TYPE user_role AS ENUM (
'traveler',
'agency',
'hotel_owner',
'guide',
'partner',
'moderator',
'admin',
'super_admin'
);

CREATE TYPE notification_type AS ENUM (
'booking',
'payment',
'promotion',
'security',
'system',
'community'
);
```

---

# Chapter 189 — Recommended Database Features

### Performance

* UUID Primary Keys
* Composite Indexes
* Partial Indexes
* Full Text Search (`pg_trgm`)
* Materialized Views
* Connection Pooling
* Query Optimization

### Scalability

* Read Replica Support
* Table Partitioning
* Background Jobs
* Redis Cache Layer
* Event Queue Integration

### Security

* Row Level Security (RLS)
* Encrypted Sensitive Fields
* Audit Trigger on Critical Tables
* Soft Delete Pattern
* Immutable Ledger Tables

---

# Chapter 190 — Production Database Statistics

| Item               | Count |
| ------------------ | ----: |
| Schemas            |    12 |
| Tables             |  120+ |
| ENUM Types         |   25+ |
| Foreign Keys       |  300+ |
| Indexes            |  450+ |
| Views              |   30+ |
| Materialized Views |   15+ |
| Stored Procedures  |   40+ |
| Triggers           |   80+ |
| RLS Policies       |  150+ |

---

# 📌 Volume 17 Complete

## 🔜 Next: **Volume 18 — Enterprise DevOps, CI/CD, Monitoring & Infrastructure**

এখানে থাকবে একটি সম্পূর্ণ Production Deployment Guide:

* System Architecture Diagram
* Vercel + Supabase Production Setup
* GitHub Actions CI/CD
* Docker Configuration
* Nginx Reverse Proxy
* CDN Strategy
* Redis Caching
* Queue System
* Cron Jobs
* Background Workers
* Monitoring (Prometheus/Grafana)
* Error Tracking (Sentry)
* Logging (Loki/ELK)
* Backup & Disaster Recovery
* Secrets Management
* SSL/TLS
* Auto Scaling
* Production Security Hardening
* Environment Variables Strategy
* Blue-Green Deployment
* Rollback Strategy
* Cost Estimation (Monthly Infrastructure Budget)

এই Volume-এর পর Madventure-এর Documentation শুধুমাত্র Application Documentation থাকবে না—এটি একটি **Enterprise-grade Software Architecture & Operations Manual**-এ পরিণত হবে।
