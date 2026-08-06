# MADVENTURE / Travel Tracer

# Enterprise Documentation v6.0

# Volume 21 — Enterprise UI/UX Design System

---

# Chapter 258 — Design Philosophy

Madventure-এর UI শুধুমাত্র সুন্দর হওয়া নয়, বরং **Fast, Accessible, Consistent, Trustworthy এবং Conversion-Oriented** হতে হবে।

### Core Principles

* Mobile First
* Human Centered Design
* Minimal Cognitive Load
* Consistent Interaction Patterns
* Accessible by Default
* Performance Optimized
* Trust Building Through Transparency

---

# Chapter 259 — Design Tokens

## Color Tokens

### Primary

| Token       | Value   | Usage           |
| ----------- | ------- | --------------- |
| Primary-50  | #EFF6FF | Background      |
| Primary-100 | #DBEAFE | Hover           |
| Primary-500 | #2563EB | Primary Buttons |
| Primary-600 | #1D4ED8 | Active          |
| Primary-700 | #1E40AF | Navigation      |

---

### Success

| Token       | Value   |
| ----------- | ------- |
| Success-500 | #16A34A |

---

### Warning

| Token       | Value   |
| ----------- | ------- |
| Warning-500 | #F59E0B |

---

### Error

| Token     | Value   |
| --------- | ------- |
| Error-500 | #DC2626 |

---

### Neutral

| Token    | Value   |
| -------- | ------- |
| Gray-50  | #F9FAFB |
| Gray-100 | #F3F4F6 |
| Gray-200 | #E5E7EB |
| Gray-400 | #9CA3AF |
| Gray-600 | #4B5563 |
| Gray-900 | #111827 |

---

# Chapter 260 — Dark Theme

Background

```text
#0F172A
```

Surface

```text
#1E293B
```

Card

```text
#334155
```

Border

```text
#475569
```

Text Primary

```text
#F8FAFC
```

Text Secondary

```text
#CBD5E1
```

---

# Chapter 261 — Typography

| Style      | Size | Weight   |
| ---------- | ---- | -------- |
| Display XL | 64px | Bold     |
| Display    | 48px | Bold     |
| H1         | 40px | Bold     |
| H2         | 32px | SemiBold |
| H3         | 28px | SemiBold |
| H4         | 24px | Medium   |
| H5         | 20px | Medium   |
| H6         | 18px | Medium   |
| Body Large | 18px | Regular  |
| Body       | 16px | Regular  |
| Small      | 14px | Regular  |
| Caption    | 12px | Regular  |

Recommended Font

* Inter
* Plus Jakarta Sans

Fallback

* system-ui
* sans-serif

---

# Chapter 262 — 8pt Spacing System

Never use random spacing.

Allowed

```text
4
8
12
16
24
32
40
48
64
80
96
128
```

---

# Chapter 263 — Border Radius

| Type        | Radius |
| ----------- | ------ |
| Small       | 6px    |
| Medium      | 10px   |
| Large       | 16px   |
| Extra Large | 24px   |
| Pill        | 999px  |

---

# Chapter 264 — Shadow System

Level 1

```text
0 1px 2px rgba(...)
```

Level 2

```text
0 4px 12px rgba(...)
```

Level 3

```text
0 8px 24px rgba(...)
```

Level 4

```text
0 20px 40px rgba(...)
```

---

# Chapter 265 — Responsive Breakpoints

| Device    | Width       |
| --------- | ----------- |
| Mobile    | 320–767px   |
| Tablet    | 768–1023px  |
| Laptop    | 1024–1439px |
| Desktop   | 1440–1919px |
| UltraWide | 1920px+     |

---

# Chapter 266 — Grid System

Desktop

```text
12 Columns
24px Gutter
```

Tablet

```text
8 Columns
20px Gutter
```

Mobile

```text
4 Columns
16px Gutter
```

---

# Chapter 267 — Icon System

Recommended

* Lucide
* Heroicons

Sizes

| Size | Use           |
| ---- | ------------- |
| 16px | Inline        |
| 20px | Buttons       |
| 24px | Navigation    |
| 32px | Cards         |
| 48px | Illustrations |

---

# Chapter 268 — Buttons

Primary

```text
Background: Blue

Text: White
```

Secondary

```text
White

Blue Border
```

Danger

```text
Red
```

Ghost

Transparent

States

* Default
* Hover
* Active
* Disabled
* Loading

---

# Chapter 269 — Inputs

Standard

```
Label

Input

Helper Text

Error Message
```

States

* Normal
* Focus
* Filled
* Error
* Disabled

---

# Chapter 270 — Cards

Every Card Includes

* Thumbnail
* Title
* Subtitle
* Actions
* Footer

States

* Hover
* Loading
* Selected

---

# Chapter 271 — Tables

Features

* Sticky Header
* Sorting
* Filtering
* Pagination
* Search
* Export

Columns Example

Bookings

* Booking ID
* Customer
* Tour
* Status
* Payment
* Date
* Actions

---

# Chapter 272 — Modal Standards

Every Modal

Header

↓

Content

↓

Footer

Buttons

Cancel

Confirm

Maximum Width

720px

---

# Chapter 273 — Drawer Standards

Right Side Drawer

Used For

* Filters
* Notifications
* Quick Details
* Edit Forms

---

# Chapter 274 — Navigation

Desktop

```text
Logo

Explore

Tours

Hotels

Community

Planner

Wallet

Profile
```

---

Mobile

Bottom Navigation

```text
Home

Explore

Planner

Wallet

Profile
```

---

# Chapter 275 — Empty States

Example

Wishlist

```
❤️

No Wishlist Yet

Explore destinations and save your favorites.

[Explore Now]
```

---

# Chapter 276 — Loading States

Never show blank page.

Use

* Skeleton Loader
* Spinner
* Progress Bar

---

# Chapter 277 — Error States

Example

```
⚠️

Something went wrong.

Retry Button
```

---

# Chapter 278 — Toast Notifications

Position

Top Right

Types

Success

Info

Warning

Error

Duration

4 Seconds

---

# Chapter 279 — Animation Guidelines

Duration

150ms

200ms

300ms

Allowed

Fade

Slide

Scale

Opacity

Avoid

Bounce

Flash

Large Rotation

---

# Chapter 280 — Accessibility

Minimum

WCAG AA

Required

* Keyboard Navigation
* Screen Reader
* Visible Focus
* ARIA Labels
* Proper Contrast
* Semantic HTML

---

# Chapter 281 — Dashboard Layout

```
Sidebar

↓

Topbar

↓

Page Header

↓

Statistics

↓

Charts

↓

Tables
```

---

# Chapter 282 — Dashboard Widgets

Traveler

* Upcoming Trips
* Wallet
* Notifications
* AI Planner
* Recent Activity

Agency

* Revenue
* Active Tours
* Bookings
* Ratings

Hotel

* Occupancy
* Revenue
* Reservations

Admin

* Users
* Payments
* Reports
* Fraud Alerts
* Analytics

---

# Chapter 283 — Search UX

Features

* Instant Search
* Suggestions
* Recent Searches
* Popular Searches
* Voice Search (Future)

---

# Chapter 284 — Filter UX

Use

* Chips
* Range Slider
* Date Picker
* Multi Select
* Toggle

Never use long dropdown lists for large datasets.

---

# Chapter 285 — Data Visualization

Recommended Charts

* Line Chart
* Area Chart
* Bar Chart
* Pie Chart
* Heatmap
* Geo Map

Avoid

* 3D Charts
* Overcrowded Labels

---

# Chapter 286 — Form Validation

Validation should occur

* On Blur
* On Submit
* Real-Time (where appropriate)

Error messages must be specific.

✅ "Password must contain at least 8 characters."

❌ "Invalid Input"

---

# Chapter 287 — Mobile UX Standards

Minimum Touch Target

48×48 px

Bottom Sheet

Preferred over Modal on Mobile

Support

* Swipe
* Pull to Refresh
* Haptic Feedback (Future)

---

# Chapter 288 — Design QA Checklist

Before Release

* Consistent Spacing
* Correct Typography
* Accessible Contrast
* Responsive Layout
* Dark Mode Verified
* Keyboard Navigation
* Empty State
* Loading State
* Error State
* Localization Ready

---

# Chapter 289 — Enterprise Component Library (Core)

## Navigation

* Navbar
* Sidebar
* Bottom Navigation
* Breadcrumb
* Tabs
* Mega Menu

## Forms

* Text Input
* Password Input
* Textarea
* Select
* Multi Select
* Date Picker
* Time Picker
* OTP Input
* Search Input
* File Upload
* Image Cropper

## Data Display

* Card
* Table
* Timeline
* Badge
* Avatar
* Tag
* Tooltip
* Accordion
* Carousel
* Map Card

## Feedback

* Alert
* Toast
* Snackbar
* Progress Bar
* Skeleton Loader
* Empty State
* Error State
* Confirmation Dialog

## Booking Components

* Availability Calendar
* Seat Selector
* Price Breakdown
* Booking Timeline
* Invoice Viewer
* QR Ticket Card

## AI Components

* Prompt Input
* AI Response Card
* Itinerary Timeline
* Budget Breakdown
* AI Suggestion Card

---

# Chapter 290 — Design System Governance

## Rules

* Every new UI component must be reusable.
* No duplicate components with the same purpose.
* Design Tokens are the single source of truth.
* Every component must support:

  * Light Theme
  * Dark Theme
  * Loading State
  * Disabled State
  * Error State
  * Responsive Layout
  * Accessibility

---

# 📌 Volume 21 Complete

## 🔜 Next: **Volume 22 — Enterprise Database Dictionary, ERD, Relationships & SQL Migration Guide**

এটি পুরো Madventure-এর সবচেয়ে গুরুত্বপূর্ণ টেকনিক্যাল ডকুমেন্ট হবে এবং এতে থাকবে:

* 80–120টি Production Tables
* Complete ER Diagram
* Data Dictionary (প্রতিটি Table ও Column-এর ব্যাখ্যা)
* Foreign Key Relationships
* Index Strategy
* Partitioning Strategy
* SQL Migration Order
* Triggers & Stored Procedures
* Row Level Security (RLS) Policies
* Views & Materialized Views
* Database Naming Conventions
* Backup & Archiving Rules
* PostgreSQL Performance Optimization Guide

এটি Backend Developer, Database Engineer এবং DevOps টিমের জন্য Master Database Blueprint হিসেবে কাজ করবে।
