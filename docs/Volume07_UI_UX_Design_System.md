# MADVENTURE / Travel Tracer

# Enterprise Software Documentation

## Version 5.0

# Volume 07 — Enterprise UI/UX Design System

---

# Chapter 7 — Design System

---

# 7.1 Design Philosophy

Madventure-এর Design Philosophy হবে:

* Mobile First
* Clean & Minimal
* Accessibility First (WCAG 2.2 AA)
* Performance Focused
* Consistent Design Language
* Bangladesh-centric UX
* International OTA Standard
* Reusable Components
* AI-assisted User Experience

---

# 7.2 Design Principles

## 1. Consistency

একই Action-এর জন্য একই Button, Icon, Color এবং Interaction ব্যবহার করতে হবে।

---

## 2. Visibility

User সবসময় জানতে পারবে:

* এখন কোথায় আছে
* কী হচ্ছে
* পরবর্তী ধাপ কী

---

## 3. Feedback

প্রতিটি Action-এর Feedback থাকবে।

Examples

* Loading
* Success
* Error
* Warning
* Confirmation

---

## 4. Accessibility

সব Component Keyboard Accessible হবে।

Screen Reader Compatible হবে।

---

# 7.3 Design Tokens

## Primary Colors

| Token         | Value   |
| ------------- | ------- |
| Primary       | #0F766E |
| Primary Hover | #115E59 |
| Secondary     | #2563EB |
| Success       | #16A34A |
| Warning       | #F59E0B |
| Danger        | #DC2626 |
| Info          | #0284C7 |

---

## Neutral Colors

| Token    | Value   |
| -------- | ------- |
| White    | #FFFFFF |
| Gray 50  | #F9FAFB |
| Gray 100 | #F3F4F6 |
| Gray 200 | #E5E7EB |
| Gray 500 | #6B7280 |
| Gray 900 | #111827 |

---

# 7.4 Typography

| Type    | Size | Weight   |
| ------- | ---- | -------- |
| Hero    | 48px | Bold     |
| H1      | 36px | Bold     |
| H2      | 30px | SemiBold |
| H3      | 24px | SemiBold |
| H4      | 20px | Medium   |
| Body    | 16px | Regular  |
| Small   | 14px | Regular  |
| Caption | 12px | Regular  |

---

# 7.5 Spacing System

```text
4px

8px

12px

16px

24px

32px

48px

64px

96px
```

---

# 7.6 Border Radius

| Component | Radius |
| --------- | ------ |
| Button    | 10px   |
| Input     | 10px   |
| Card      | 16px   |
| Modal     | 20px   |
| Avatar    | 999px  |

---

# 7.7 Shadow System

| Level     | Usage          |
| --------- | -------------- |
| Shadow XS | Inputs         |
| Shadow SM | Cards          |
| Shadow MD | Dropdown       |
| Shadow LG | Modal          |
| Shadow XL | Floating Panel |

---

# 7.8 Grid System

Desktop

12 Columns

Tablet

8 Columns

Mobile

4 Columns

---

# 7.9 Breakpoints

| Device  | Width       |
| ------- | ----------- |
| Mobile  | <640px      |
| Tablet  | 640–1023px  |
| Laptop  | 1024–1439px |
| Desktop | ≥1440px     |

---

# 7.10 Component Library

সব Component Design System অনুসরণ করবে।

---

## Buttons

Variants

Primary

Secondary

Outline

Ghost

Danger

Success

Icon Button

Loading Button

Floating Button

---

States

Default

Hover

Pressed

Focused

Disabled

Loading

---

# 7.11 Inputs

Components

Text

Password

Textarea

Number

Currency

Phone

OTP

Search

Autocomplete

Tag Input

---

Validation

Required

Success

Error

Warning

Helper Text

---

# 7.12 Select Components

Dropdown

Multi Select

Country

District

Division

Category

Language

Date

Time

Calendar

---

# 7.13 Cards

Card Types

Destination Card

Tour Card

Hotel Card

Review Card

Booking Card

Notification Card

Forum Card

Wallet Card

Analytics Card

---

সব Card-এ থাকবে

Image

Title

Subtitle

CTA

Hover Animation

---

# 7.14 Navigation

Desktop

Navbar

Sidebar

Breadcrumb

Tabs

Mega Menu

Footer

---

Mobile

Bottom Navigation

Drawer

Floating Search

Sticky CTA

---

# 7.15 Modal Standards

সব Modal-এ থাকবে

Title

Close Button

ESC Support

Overlay

Primary Action

Secondary Action

---

# 7.16 Tables

Features

Sorting

Filtering

Search

Pagination

Bulk Selection

CSV Export

Responsive Collapse

---

# 7.17 Form Standards

Multi Step Form

Auto Save

Validation

Progress Indicator

Required Marker

Unsaved Changes Warning

---

# 7.18 Loading States

Skeleton Loader

Progress Bar

Spinner

Inline Loader

Card Loader

Table Loader

---

# 7.19 Empty States

প্রতিটি Module-এর Empty State থাকবে।

Examples

No Bookings

No Wishlist

No Reviews

No Planner

No Notifications

প্রতিটি Empty State-এ CTA থাকবে।

---

# 7.20 Error States

Network Error

Permission Denied

404

500

Payment Failed

Booking Failed

AI Failed

Retry Button বাধ্যতামূলক।

---

# 7.21 Toast Notifications

Types

Success

Error

Warning

Info

Auto Hide

Undo Action (যেখানে সম্ভব)

---

# 7.22 Animation Guidelines

Use

Fade

Slide

Scale

Skeleton Pulse

Progress Transition

Avoid

Heavy Animation

Long Delays

---

# 7.23 Icons

Standard

Lucide Icons

Rules

24px

Consistent Stroke

Accessible Label

---

# 7.24 Image Guidelines

Format

WebP Preferred

Fallback JPEG

Responsive Sizes

Lazy Loading

Blur Placeholder

---

# 7.25 Dashboard Design

সব Dashboard-এ থাকবে

Header

Statistics Cards

Charts

Recent Activity

Quick Actions

Shortcuts

---

# 7.26 Charts

Supported

Line

Bar

Pie

Area

Heatmap

Donut

---

# 7.27 Mobile UX Rules

Sticky Bottom Navigation

Swipe Support

Pull To Refresh

One Thumb Reach

Large Touch Targets

Offline Indicator

---

# 7.28 Accessibility Standards

Mandatory

* Keyboard Navigation
* Focus Indicator
* Screen Reader Labels
* Color Contrast ≥ 4.5:1
* Form Labels
* ARIA Attributes
* Reduced Motion Support

---

# 7.29 Internationalization (i18n)

Supported Languages

* বাংলা (Default)
* English

Requirements

* Date Format Locale-aware
* Currency Formatting (BDT)
* RTL-ready Layout (Future)
* Text Expansion Safe

---

# 7.30 Branding Guidelines

Logo Usage

* Minimum Clear Space
* Light/Dark Variants
* Favicon Set

Illustration Style

* Flat + Modern
* Travel-focused
* Bangladesh Identity

Photography

* High Resolution
* Authentic Locations
* Optimized for Web

---

# 7.31 Design QA Checklist

প্রতিটি Screen Release-এর আগে যাচাই করতে হবে:

* Responsive Layout ঠিক আছে
* Contrast Standard পূরণ করছে
* All Interactive Elements Focusable
* Loading State আছে
* Empty State আছে
* Error State আছে
* Hover/Pressed States আছে
* Mobile Tested
* Dark Mode Supported

---

# 7.32 Component Inventory (Recommended)

প্রকল্পে প্রায় **১২০+ Reusable Components** থাকবে।

প্রধান বিভাগগুলো:

* Navigation Components
* Form Components
* Feedback Components
* Data Display Components
* Booking Components
* Payment Components
* Wallet Components
* Community Components
* Admin Components
* Analytics Components
* AI Planner Components
* Map Components
* Media Components
* Layout Components
* Utility Components
