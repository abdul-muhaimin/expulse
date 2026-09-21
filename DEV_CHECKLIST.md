# Expulse — Development Checklist

> This document is the source of truth for Expulse development.
> Update it whenever a major decision is made or a feature is completed.
>
> Do not assume a feature exists unless it is marked complete here.

---

## Product

Expulse is a simple customer-experience platform initially targeting
Maldivian businesses.

Core purpose:

1. Tell businesses whether customers had a good experience.
2. Tell businesses whether customers would recommend them.
3. Help businesses understand negative experiences.
4. Eventually help businesses recover unhappy customers.
5. Eventually create trusted public business profiles and leaderboards.

Initial target price:

**MVR 99/month**

---

## Product Principles

- Mobile first.
- Responsive on all screen sizes.
- Simple enough for a small business owner.
- Customer feedback should take roughly 10–20 seconds.
- No customer account required to submit feedback.
- Feedback is anonymous by default.
- Do not turn Expulse into a general survey builder.
- Do not add features simply because competitors have them.
- AI/code agents implement our decisions; they do not decide the product.

---

# Technology

## Frontend

- [x] Next.js 16
- [x] App Router
- [x] TypeScript
- [x] Tailwind CSS v4
- [x] shadcn/ui
- [x] Selected shadcn preset
- [x] Lucide icons
- [x] Inter typography
- [ ] PWA — later, only if useful

## Backend

Planned:

- [ ] Firebase project
- [ ] Firebase Authentication
- [ ] Cloud Firestore
- [ ] Firebase Storage
- [ ] Firebase Security Rules
- [ ] Cloud Functions where required

Do not configure backend until the initial UI/data model is agreed.

## Hosting

Planned:

- [ ] Vercel
- [ ] Production domain
- [ ] Environment variables

---

# Project Structure

Current intended structure:

app/

- marketing/public routes
- dashboard routes
- customer feedback routes

components/

- ui/
- dashboard/
- feedback/
- shared/

lib/

- utilities
- mock data
- Firebase later

---

# Design System

- [x] shadcn preset initialized
- [x] Keep preset theme as base
- [x] Mobile-first approach
- [x] Responsive desktop layout
- [x] Lucide icon system

Rules:

- Use shadcn components when appropriate.
- Use existing semantic theme tokens.
- Do not create a second design system.
- No unnecessary gradients.
- No glassmorphism.
- No giant rounded SaaS cards.
- Keep business UI clean and compact.
- Status colors may be used meaningfully for positive/warning/negative states.

---

# Dashboard Shell

- [x] Application header
- [x] Desktop sidebar
- [x] Mobile bottom navigation
- [x] Dashboard shell
- [x] Dashboard route group
- [ ] Real navigation links
- [ ] Active route detection
- [ ] Mobile user/settings menu
- [ ] Business switcher — decide later

Navigation:

1. Overview
2. Feedback
3. Reports
4. QR Code
5. Settings

---

# Overview

Currently being implemented.

Required components:

- [ ] Overview header
- [ ] Customer Pulse summary
- [ ] Experience score
- [ ] Recommendation percentage
- [ ] NPS
- [ ] Response count
- [ ] Experience trend
- [ ] Needs Attention
- [ ] Recent feedback
- [ ] Period selector
- [ ] Mobile responsive
- [ ] Desktop responsive

Current data is MOCK DATA.

Do not connect Overview to Firebase yet.

---

# Mock Data

- [ ] Create central mock-data file
- [ ] Business mock data
- [ ] Overview mock data
- [ ] Feedback mock data
- [ ] Trend mock data
- [ ] Negative issue mock data

Goal:

UI components should eventually consume structured mock data rather than
containing random values throughout JSX.

This makes replacing mock data with Firestore easier later.

---

# Customer Feedback Flow

NOT STARTED.

Current agreed concept:

Customer scans QR.

↓

Business feedback page opens.

↓

Question 1:

**How was your experience?**

Expected scale:

Very bad → Great

↓

Question 2:

**Would you recommend this business to friends or family?**

Expected scale:

0–10

↓

Optional comment.

↓

Submit.

↓

Thank-you screen.

Requirements:

- [ ] No login
- [ ] Mobile-first
- [ ] Very fast
- [ ] Business branding
- [ ] Experience question
- [ ] Recommendation question
- [ ] Optional comment
- [ ] Submit
- [ ] Thank-you state

Exact UX still needs final design before implementation.

---

# Negative Feedback / Recovery

PLANNED — NOT MVP IMPLEMENTED.

Possible flow:

Low experience score

↓

Ask what went wrong.

Possible reasons:

- Service
- Quality
- Waiting time
- Staff
- Cleanliness
- Price/value
- Other

↓

Ask:

**Would you like the business to contact you?**

If yes, customer voluntarily provides contact information.

Decisions still required:

- [ ] What score triggers recovery?
- [ ] What contact methods?
- [ ] How recovery status works
- [ ] Privacy requirements

Do not implement until decisions are finalized.

---

# QR System

PLANNED.

- [ ] Unique business feedback URL
- [ ] QR generation
- [ ] QR download
- [ ] Printable QR card
- [ ] Business branding

Later:

- [ ] Multiple QR sources
- [ ] Branch QR
- [ ] Table QR
- [ ] Delivery QR

Do not build advanced QR tracking in V1.

---

# Reports

PLANNED.

Main concept:

Every business receives a simple monthly customer experience report.

Expected metrics:

- Responses
- Average experience
- Positive experience %
- Recommendation %
- NPS
- Change from previous month
- Most common negative issue
- Recovery requests

- [ ] Report UI
- [ ] Monthly calculation
- [ ] Previous-month comparison
- [ ] Email delivery
- [ ] PDF — decide whether actually necessary

---

# Rewards / Feedback Incentives

IDEA — NOT DECIDED.

Potential options:

- Monthly prize draw
- Business-provided coupon
- Platform-wide prize later

Important rule:

Rewards must be for submitting honest feedback.

Rewards must NEVER depend on giving a positive score.

Repeat customers may submit feedback on different visits.

Need abuse prevention before reward system is implemented.

---

# Public Business Profiles

FUTURE.

Potential information:

- Business name
- Category
- Location
- Experience score
- Recommendation %
- Number of experiences
- Recent trend

Private customer comments must NOT automatically become public reviews.

- [ ] Finalize public/private data policy
- [ ] Public profile design
- [ ] Business search
- [ ] Categories
- [ ] Island/location filtering

---

# Leaderboard

FUTURE.

Possible examples:

- Most Recommended Cafés
- Best Customer Experience
- Top Guesthouses
- Most Improved

Do NOT rank solely by raw average rating.

Future ranking should consider:

- response volume
- recency
- consistency
- minimum response threshold
- suspicious submissions
- recommendation score
- experience score

Ranking algorithm must be explicitly designed before implementation.

---

# Abuse Prevention

NOT DESIGNED YET.

Need protection against:

- repeated rapid submissions
- bots
- businesses submitting their own feedback
- competitors attacking businesses
- reward farming

Possible signals:

- rate limiting
- session/device identifier
- IP signals
- timestamps
- abnormal submission patterns

Do not collect unnecessary personal data.

---

# Authentication

NOT STARTED.

Business users require authentication.

Customers submitting feedback do NOT.

Planned:

- [ ] Firebase Auth
- [ ] Email/password
- [ ] Google login — decide before implementation
- [ ] Forgot password
- [ ] Protected dashboard routes

---

# Firestore Data Model

DO NOT IMPLEMENT YET.

Expected concepts:

- users
- businesses
- feedback
- reports
- recovery requests
- subscriptions

Possible locations/branches later.

Before creating collections:

- [ ] Define entities
- [ ] Define relationships
- [ ] Define ownership
- [ ] Define required indexes
- [ ] Define security rules
- [ ] Define public vs private fields

---

# Payments

NOT STARTED.

Target:

**MVR 99/month**

Need research before implementation:

- [ ] Maldives-compatible payment providers
- [ ] Recurring payment support
- [ ] Payment fees
- [ ] Cards
- [ ] Local payment methods
- [ ] Subscription lifecycle
- [ ] Failed payments

Do not build Stripe assumptions before investigating Maldives payment reality.

---

# Marketing / Validation

## First 5 businesses

Goal:

Get QR physically displayed inside real businesses.

Possible initial categories:

- Café
- Restaurant
- Salon/service
- Guesthouse
- Other high-traffic business

Offer:

Free test period.

Personally onboard them.

At the end, show their real customer report.

Then ask whether they would continue for MVR 99/month.

## Validation metrics

Track:

- QR views/scans
- Feedback starts
- Feedback completions
- Completion rate
- Comments
- Negative feedback
- Recovery requests
- Repeat feedback
- Owner dashboard usage
- Owner interest in monthly report
- Willingness to pay MVR 99

---

# Development Phases

## Phase 1 — UI Foundation

- [x] Next.js project
- [x] shadcn setup
- [x] Base dashboard shell
- [ ] Finish Overview UI
- [ ] Central mock data

## Phase 2 — Customer Experience

- [ ] Design customer feedback journey
- [ ] Build feedback UI
- [ ] Build thank-you state
- [ ] Test mobile UX

## Phase 3 — Data Architecture

- [ ] Finalize Firestore schema
- [ ] Create Firebase project
- [ ] Configure Firebase
- [ ] Security rules
- [ ] Replace mock data with real data

## Phase 4 — Business Accounts

- [ ] Authentication
- [ ] Business onboarding
- [ ] Business profile
- [ ] Protected dashboard

## Phase 5 — Feedback Collection

- [ ] Public feedback URLs
- [ ] Store feedback
- [ ] Calculate metrics
- [ ] Dashboard real data
- [ ] Basic abuse protection

## Phase 6 — QR

- [ ] Generate QR
- [ ] Download QR
- [ ] Printable business card/poster

## Phase 7 — Reports

- [ ] Monthly report
- [ ] Comparison
- [ ] Delivery

## Phase 8 — Pilot

- [ ] First real business
- [ ] First real QR displayed
- [ ] First 100 real responses
- [ ] Five pilot businesses
- [ ] Collect owner feedback

## Phase 9 — Monetization

Only after pilot validation.

- [ ] Payment provider
- [ ] MVR 99 subscription
- [ ] Billing UI
- [ ] Subscription state

## Later

- [ ] Recovery workflow
- [ ] Rewards
- [ ] Public profiles
- [ ] Search
- [ ] Leaderboards
- [ ] Multi-location
- [ ] Referral system

---

# Current Development State

**CURRENT TASK:**

Build and review the responsive Overview dashboard using mock data and shadcn.

**DO NOT START YET:**

Firebase  
Authentication  
Payments  
Public profiles  
Leaderboard  
Rewards

**NEXT TASK AFTER OVERVIEW APPROVAL:**

Centralize mock data and design the customer-facing QR feedback experience.
