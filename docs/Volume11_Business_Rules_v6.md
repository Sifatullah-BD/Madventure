# MADVENTURE / Travel Tracer

# Enterprise Software Documentation

## Volume 11 — Business Rules

**Version 6.0**

---

# Chapter 111 — Business Rules Overview

Business Rules হলো সেই Core Policies এবং Constraints যেগুলো পুরো Application-এর Business Logic নিয়ন্ত্রণ করবে।

এই Rules Backend, Frontend, Database, API, Admin Panel এবং Mobile App—সব জায়গায় একইভাবে প্রযোজ্য হবে।

সব Business Rules Server-side enforce করা বাধ্যতামূলক। Frontend Validation শুধুমাত্র User Experience উন্নত করার জন্য ব্যবহৃত হবে।

---

# Chapter 112 — General Business Policies

* সকল User-এর একটি Unique Account থাকবে।
* Email এবং Phone Number অবশ্যই Unique হতে হবে।
* Deleted Account পুনরায় একই Email দিয়ে Register করা যাবে না (Retention Policy অনুযায়ী)।
* প্রতিটি Transaction Traceable হতে হবে।
* কোনো Financial Record Hard Delete করা যাবে না।
* সমস্ত গুরুত্বপূর্ণ Action Audit Log-এ সংরক্ষণ করতে হবে।
* UTC Timezone Database-এ ব্যবহার হবে, UI-তে Local Time দেখানো হবে।

---

# Chapter 113 — User Registration Rules

Registration করার জন্য:

* Full Name Required
* Valid Email Required
* Valid Mobile Number Required
* Strong Password Required
* Terms & Conditions Accept করতে হবে।

Validation:

* Email Duplicate হলে Registration Reject হবে।
* Phone Duplicate হলে Registration Reject হবে।
* Disposable Email ব্যবহার করা যাবে না।
* Minimum Age: 13 বছর (Future Policy অনুযায়ী পরিবর্তনযোগ্য)।

---

# Chapter 114 — Authentication Rules

* Email Verify না করলে Sensitive Feature ব্যবহার করা যাবেবিধা হবে না।
* ৫ বার ভুল Password দিলে Account Temporary Lock হবে।
* Access Token Expire হলে Refresh Token ব্যবহার হবে।
* একই User একাধিক Device থেকে Login করতে পারবে।
* Admin প্রয়োজনে Active Session Revoke করতে পারবেন।

---

# Chapter 115 — Profile Rules

প্রতিটি User Profile-এ থাকতে পারবে:

* Profile Photo
* Cover Photo
* Bio
* Preferred Language
* Emergency Contact
* Travel Preferences

Restrictions:

* Offensive Content নিষিদ্ধ।
* Fake Identity অনুমোদিত নয়।
* Profile Photo সর্বোচ্চ 5 MB।

---

# Chapter 116 — Tour Business Rules

প্রতিটি Tour-এর জন্য বাধ্যতামূলক:

* Agency Owner থাকতে হবে।
* Minimum ১টি Schedule থাকতে হবে।
* Valid Price থাকতে হবে।
* Maximum Capacity নির্ধারণ করতে হবে।
* Tour Status:

  * Draft
  * Pending Review
  * Published
  * Suspended
  * Archived

Published Tour ছাড়া Booking করা যাবে না।

---

# Chapter 117 — Tour Schedule Rules

* Start Date অবশ্যই Future Date হবে।
* End Date Start Date-এর পরে হতে হবে।
* Available Seats কখনও Negative হতে পারবে না।
* Booked Seats Capacity অতিক্রম করতে পারবে না।
* Schedule Cancel হলে সকল Pending Booking Cancel হবে।

---

# Chapter 118 — Hotel Rules

Hotel Publish করার আগে:

* Trade License Verify
* Address Verify
* GPS Location
* Minimum ৩টি ছবি
* Contact Information
* Room Information

Inactive Hotel Booking গ্রহণ করতে পারবে না।

---

# Chapter 119 — Room Inventory Rules

* প্রতিদিনের Inventory আলাদা থাকবে।
* Inventory Negative হতে পারবে না।
* Blocked Room Booking করা যাবে না।
* Maintenance Room Available হিসেবে দেখানো যাবে না।
* Double Booking সম্পূর্ণ নিষিদ্ধ।

---

# Chapter 120 — Booking Rules

Booking শুধুমাত্র Available Inventory-এর উপর করা যাবে।

Booking Lifecycle:

Pending

↓

Payment Pending

↓

Confirmed

↓

Completed

↓

Archived

Cancelled Booking Inventory Release করবে।

Expired Booking Auto Cancel হবে।

---

# Chapter 121 — Payment Rules

Accepted Methods:

* SSLCommerz
* Wallet
* Card (Future)

Rules:

* Payment Verify না হওয়া পর্যন্ত Booking Confirm হবে না।
* Duplicate Transaction Reject হবে।
* Callback Signature Verify হবে।
* Payment Amount Match করতে হবে।
* Failed Payment পুনরায় Retry করা যাবে।

---

# Chapter 122 — Refund Rules

Refund শুধুমাত্র Approved Policy অনুযায়ী হবে।

Example:

* ৭ দিন আগে Cancel → 100%
* ৩ দিন আগে Cancel → 50%
* ২৪ ঘণ্টার মধ্যে → No Refund

সব Refund Ledger-এ সংরক্ষিত হবে।

---

# Chapter 123 — Wallet Rules

Wallet Balance কখনও Negative হবে না।

সব Wallet Transaction Ledger-based হবে।

Transaction Types:

* Deposit
* Withdrawal
* Refund
* Cashback
* Bonus
* Booking Payment

Wallet Balance Manual Edit করা যাবে না।

---

# Chapter 124 — Wishlist Rules

একই Item একাধিকবার Wishlist-এ যোগ করা যাবে না।

Supported:

* Tours
* Hotels
* Places

Deleted Item Wishlist থেকে Auto Remove হবে।

---

# Chapter 125 — Review Rules

Review শুধুমাত্র Verified Booking-এর পর করা যাবে।

Rules:

* Rating: 1–5
* এক Booking-এর জন্য একটি Review
* Spam Review Remove হবে।
* Owner নিজের Tour Review করতে পারবেন না।

---

# Chapter 126 — Community Rules

নিষিদ্ধ:

* Spam
* Hate Speech
* Adult Content
* Fake News
* Illegal Promotion

Reported Post Moderator Review করবে।

Repeated Violation Account Suspend হতে পারে।

---

# Chapter 127 — Lost & Found Rules

Item Report করার সময়:

* Title
* Category
* Description
* Location
* Date
* Contact

Claim করার আগে Verification Required।

Closed Item পুনরায় Claim করা যাবে না।

---

# Chapter 128 — AI Planner Rules

AI শুধুমাত্র Recommendation প্রদান করবে।

AI Output:

* Budget Estimate
* Suggested Places
* Suggested Hotels
* Suggested Tours

AI Generated Information Human Verification ছাড়া Official Information হিসেবে গণ্য হবে না।

---

# Chapter 129 — Notification Rules

Notification Types:

* Booking
* Payment
* Refund
* Reminder
* Community
* Promotional
* Security

High Priority Notification Delete করা যাবে না।

---

# Chapter 130 — Admin Rules

Admin করতে পারবেন:

* User Suspend
* Tour Approve
* Hotel Verify
* Refund Approve
* Content Moderate
* Reports Generate

Admin কোনো User-এর Password দেখতে পারবেন না।

---

# Chapter 131 — Agency Rules

Agency Create করার জন্য:

* Verified Account
* Trade License
* Business Address
* Contact Number
* Bank Information

Agency শুধুমাত্র নিজের Tour Edit করতে পারবে।

---

# Chapter 132 — Hotel Owner Rules

Hotel Owner শুধুমাত্র নিজের Hotel Manage করতে পারবেন।

তিনি পারবেন:

* Room Add
* Inventory Update
* Booking View
* Reports Export

---

# Chapter 133 — Emergency Module Rules

Emergency Contact সবসময় Visible থাকবে।

SOS Button Press করলে:

* GPS সংগ্রহ হবে।
* Emergency Contact Notify হবে।
* ভবিষ্যতে Local Authority Integration করা যাবে।

---

# Chapter 134 — Analytics Rules

Track হবে:

* Tour View
* Hotel View
* Booking Started
* Booking Completed
* Payment Success
* Wishlist Added
* AI Planner Used

Analytics Data কখনও Personally Identifiable Information (PII) প্রকাশ করবে না।

---

# Chapter 135 — Search Rules

Search Support করবে:

* Destination
* Place
* Tour
* Hotel
* Guide

Search Ranking বিবেচনা করবে:

* Popularity
* Rating
* Distance
* Relevance

---

# Chapter 136 — Security Rules

* RBAC Mandatory
* RLS Mandatory
* Audit Logging Mandatory
* HTTPS Only
* MFA for Admin
* Rate Limiting Enabled
* SQL Injection Protection
* XSS Protection

---

# Chapter 137 — Data Retention Rules

| Data Type         | Retention       |
| ----------------- | --------------- |
| Audit Logs        | 7 Years         |
| Payments          | 10 Years        |
| Bookings          | Permanent       |
| Notifications     | 180 Days        |
| AI History        | User Controlled |
| Community Reports | 2 Years         |

---

# Chapter 138 — Compliance Rules

Platform অবশ্যই:

* Privacy Policy অনুসরণ করবে।
* User Consent সংরক্ষণ করবে।
* Cookie Consent পরিচালনা করবে।
* Data Export ও Account Deletion Request সমর্থন করবে।

---

# Chapter 139 — Business Rule Violations

Violation হলে:

1. Validation Error
2. Transaction Rollback
3. Audit Log
4. Notification
5. Admin Review (যদি প্রয়োজন হয়)

---

# Chapter 140 — Business Rules Summary

এই Volume-এর সকল Rules Backend-এর Single Source of Truth হিসেবে Implement করতে হবে।

কোনো Business Rule শুধুমাত্র Frontend-এ Implement করা যাবে না।

সমস্ত Validation, Authorization, Financial Calculation, Booking Logic এবং Inventory Management Server-side Enforce করা বাধ্যতামূলক।

এই Business Rules অনুসরণ করলে Madventure একটি Production-Ready, Secure, Consistent এবং Enterprise-Grade Travel Management Platform হিসেবে পরিচালিত হতে পারবে।
