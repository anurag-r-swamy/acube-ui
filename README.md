# ACubeX Marketplace — High-Fidelity UI Prototype

> **Notice:** This project is a **front-end interactive UI prototype**. All user accounts, service providers, payments, document verifications, GPS locations, chat messages, and telephony calls are **locally simulated**. No real money is charged, and no real credentials or personal data are stored or transmitted to external servers.

---

## 1. Product Identity & Branding

- **Parent Corporate Entity:** **ACubeX** (parent company branding only; not the consumer-facing app name).
- **Consumer-Facing Product Name:** Configurable placeholder `Marketplace` (configured in `src/config/branding.ts`). The final consumer brand name remains undecided.
- **Geographic Scope:** Local-services marketplace initially designed around **Bengaluru, Karnataka, India** (covering Koramangala, Indiranagar, HSR Layout, Bellandur, Whitefield, Jayanagar, Malleshwaram, etc.).
- **Currency:** Indian Rupee (`₹` / `INR`).

---

## 2. Tech Stack & Architecture

- **Framework:** React 18 with TypeScript (`react`, `react-dom`, `@types/react`)
- **Build Tool:** Vite 5
- **Styling:** Tailwind CSS with custom palette:
  - Deep Green: `#183D35`
  - Amber / Accent: `#E9A23B`
  - Charcoal: `#202724`
  - Warm Off-White / Background: `#F7F8F5`
  - Semantic Status Colors: Success (`#15803D`), Warning (`#D97706`), Danger (`#DC2626`), Info (`#2563EB`)
- **Icons:** `lucide-react`
- **State & Persistence:** Centralized typed reactive state in `src/context/AppContext.tsx` with automatic persistence in browser `localStorage` (`acubex_marketplace_prototype_v1`) and instant cross-screen reactivity.

---

## 3. Demo Personas & Role Switcher

A persistent **Demo Bar** at the top of the interface enables instant persona switching and edge-case testing:

| Persona | Role | Key Capabilities & Purpose |
|---|---|---|
| **Priya Sharma** | Customer | Consumer account; explores services, searches, books verified providers, tracks live jobs, pays via simulated gateway, reviews, and lodges disputes. |
| **Rajesh Kumar** | Worker (Dual-Capability) | Linked customer + approved electrician profile. Can toggle between **Customer View** and **Worker View** seamlessly without creating a second account. |
| **Ananya Gowda** | Customer (Onboarding Prospect) | Customer-only user with a prominent **"Become a Worker"** journey to complete partner onboarding without duplicating account. |
| **Ayesha Sen** | Super Admin | Unrestricted access across all operational, financial, verification, and staff management consoles. |
| **Vikram Rao** | Disputes & Verification Admin | Access to Worker Verification queue and Customer Complaints/Disputes desk; restricted from staff management and unrestricted finance mutation. |
| **Suresh Patel** | Accounts & Finance Admin | Access to Payments ledger, provisional commission rules, customer refund issuance, and weekly settlement payout batches. |
| **Kavita Nair** | Operations & Support Admin | Access to Category/Subcategory catalog, Bengaluru Service Area coverage, live Booking Monitor, and Support tickets desk. |

---

## 4. Complete Screen Inventory

### A. Customer App (Mobile-First 390×844 or Full Width)
- **Home / Discovery:** Selected location indicator, quick search input, service categories grid, "Post a General Request" broadcast card, recommended verified Bengaluru providers, trust & safety guarantees.
- **Search & Directory:** Keyword query, category chips, rating filter (4.0+, 4.5+, 4.8+), price slider, sort dropdown (Recommended, Rating, Price, Jobs), empty state with reset button.
- **Location Selector Modal:** GPS permission explainer (Granted, Denied states), simulated GPS locator, manual Bengaluru locality selector (Koramangala, Indiranagar, HSR, Bellandur, Whitefield, etc.).
- **Provider Profile Modal:** High-resolution avatar, verified badge, rating & review count, completed jobs, experience years, base fare & hourly rate, verified document credentials, coverage areas, customer reviews.
- **Booking & Checkout Flow:**
  - Step 1: Problem description & optional mock photo attachment.
  - Step 2: Date & time slot picker, saved Bengaluru address selector.
  - Step 3: Transparent price breakdown (Base fare, platform fee ₹49, estimated taxes, total) and cancellation policy.
  - Step 4: Simulated checkout (UPI, Card, Net Banking) with **"Demo payment — no money is charged"** notice and failure simulation edge-case toggle.
  - Step 5: Success confirmation and redirection to live tracking.
- **My Bookings:** Active / In-Progress, Completed, and Cancelled tabs.
- **Booking Details & Live Lifecycle:** Step progression tracker, audit event timeline, worker contact actions, confirm completion, rate & review, report formal dispute.
- **Interactive Chat & Masked Calling:** Real-time simulated messaging with worker, photo attachment simulation, and private masked phone call modal.
- **Customer Profile & "Become a Worker":** Account details, saved addresses, FAQ, guidelines, sign-out simulation, and prominent partner onboarding CTA.

### B. Worker App
- **Worker Onboarding Wizard ("Become a Worker"):** Trade profile headline, primary category & skills, experience years, base and hourly rates, Bengaluru localities, safe demo document upload (Aadhaar & Trade Cert), weekly settlement bank details.
- **Worker Dashboard:** Verification banner (`APPROVED`, `PENDING_REVIEW`, `RESUBMISSION_REQUIRED`, `REJECTED`), Online/Offline toggle with active-job warning, quick stats (Net Earned, Active Jobs, Rating, Completed Jobs), live job broadcast opportunities feed with Accept/Decline actions.
- **Job Lifecycle Management:** Active in-progress job actions ("Mark Arrived", "Start Work / In Progress", "Submit Completion"), customer contact & in-app chat.
- **Earnings & Payout Ledger:** Gross service value, illustrative platform commission breakdown (clearly marked provisional), net earnings, settlement batches history (Paid, Pending, Failed), and read-only transaction ledger.
- **Worker Profile View:** Editable headline, base fare, hourly rate, skills, coverage areas, and document verification status.

### C. Admin Web Dashboard (Desktop-First 1440×900)
- **Role Permission Guard:** Enforces role-based UI access. Unauthorized access triggers a designed **Access Restricted** screen with clear explanatory notices and role switcher buttons.
- **Overview & KPIs:** Gross Merchandise Value (GMV), active bookings, pending verification alerts, open dispute cases, category distribution charts, recent activity table.
- **Worker Verification Queue:** Application list with status filter, document inspection drawer, approve / reject / request-resubmission actions with mandatory reason prompt.
- **Disputes & Complaints Desk:** Active dispute queue, incident description & photo evidence viewer, staff internal notes thread, resolution/escalation determination modal.
- **Live Booking Monitor:** Full platform booking feed with status filtering, event timeline inspection, customer & partner details.
- **Finance & Commission Ledger:** Customer transaction ledger with simulated refund modal, provisional commission rules editor, weekly settlement payout batch release.
- **Customer & Worker Directories:** Searchable directories with profile inspection drawers.
- **Categories & Service Area Management:** Service category toggle/edit, Bengaluru zones and locality mapping.
- **Staff Administration & Permission Matrix:** Staff directory and role capability matrix (Super Admin only).
- **Privileged Audit Log:** Immutable event log recording simulated approvals, refunds, settlements, and rule changes.
- **Analytics & Reports:** Metric distributions, category contribution breakdown, fulfillment SLA percentages.
- **Platform Settings & Broadcast Simulation:** App branding config info, system settings, and simulated notification broadcast dispatcher.

---

## 5. Getting Started & Running Locally

### Prerequisites
- Node.js (v18 or higher recommended; developed on Node v24)
- npm

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### Production Build & Typecheck
```bash
npm run build
```
Generates production-optimized static assets in `dist/`.

### Preview Production Build
```bash
npm run preview
```

---

## 6. Verification Scenarios to Test

1. **Customer Booking & Checkout:**
   - As **Priya Sharma**, browse services on Home or Search.
   - Click **Book** on Rajesh Kumar (Electrician) or Mohammed Farooq (AC Tech).
   - Advance through Schedule, Address, and Summary to the Demo Payment screen.
   - Toggle "Simulate Payment Failure Edge Case" to test declined gateway handling, or proceed with success.
   - Observe the new booking appear in **My Bookings** with reference number and timeline.

2. **Dual-Capability Role Switching:**
   - As **Rajesh Kumar**, click **"Switch to Customer View"** on the top demo banner.
   - Experience the consumer interface as Rajesh. Click **"Switch to Worker View"** to return to the Worker Dashboard.

3. **"Become a Worker" Onboarding:**
   - Switch persona to **Ananya Gowda** (Customer).
   - Go to Profile -> click **"Start Worker Onboarding"**.
   - Fill in trade details, select skills and Bengaluru localities, attach demo docs, submit.
   - Observe that Ananya's account now has dual roles (`CUSTOMER` and `WORKER`) with status `PENDING_REVIEW`.

4. **Admin Verification Review:**
   - Switch persona to **Vikram Rao** (Disputes & Verification) in the Admin portal.
   - Open **Worker Verification** -> select Ananya Gowda or Karthik Reddy.
   - Inspect submitted documents -> click **Approve Worker Profile**.
   - Switch back to Ananya's worker view: the dashboard immediately reflects `APPROVED` status.

5. **Job Lifecycle Progression:**
   - Switch to **Rajesh Kumar** (Worker).
   - Look at the active job on the dashboard: click **"Start Service / In Progress"**, then **"Submit Job Completion"**.
   - Switch to **Priya Sharma** (Customer): open the booking in My Bookings -> click **"Confirm Work Done"**.
   - The booking moves to `COMPLETED`. Click **"Rate Pro"** to submit a 5-star review.
   - Check Rajesh's profile: rating and completed job counts update instantly.

6. **Filing & Resolving a Dispute:**
   - As Priya Sharma, open an active booking -> click **"Report Dispute"**.
   - Select reason ("Property Damage"), enter incident details, attach mock photo, submit.
   - Switch to **Vikram Rao** in Admin -> open **Disputes & Complaints Desk**.
   - Investigate the case, add an internal staff note, and click **"Resolve & Issue Determination"**.

7. **Finance Refund & Settlement:**
   - As **Suresh Patel** (Accounts & Finance), open **Finance & Settlements**.
   - On an unpaid/cancelled transaction, click **"Issue Refund"** -> provide reason -> confirm.
   - On the Settlements tab, click **"Release Payout"** for a pending batch.
   - Check **Privileged Audit Log**: all actions are logged with timestamp and staff actor.

8. **Role Permission Boundary Testing:**
   - As **Kavita Nair** (Operations & Support), click **"Payments & Settlements"** or **"Staff Administration"** in Admin.
   - A designed **Access Restricted** screen appears, preventing unauthorized mutation.

9. **Reset Demo State:**
   - Click **"Reset Demo Data"** on the top demo banner at any time to restore the seed dataset in `localStorage`.

---

## 7. Static Deployment Instructions

Because this prototype is a pure frontend application with simulated client-side state, it can be deployed to any static web hosting service:

- **Vercel:** Run `vercel` or link repository. (Build command: `npm run build`, Output directory: `dist`)
- **Netlify:** Run `netlify deploy --prod --dir=dist`
- **GitHub Pages:** Deploy the contents of the `dist/` directory.
- **AWS S3 / CloudFront:** Sync the `dist/` folder to an S3 bucket configured for static website hosting.

---

## 8. Future Backend & API Integration Points

When moving from this UI prototype to a production deployment, the following services should replace the mock state:

1. **Authentication & Identity:**
   - Integration with Supabase Auth, Firebase Auth, or Auth0 for SMS OTP phone authentication and RBAC claims.
   - DigiLocker Sandbox API for Aadhaar / PAN e-KYC.
2. **Database & API:**
   - PostgreSQL (with PostGIS for geospatial radius matching of nearby workers in Bengaluru).
   - GraphQL or REST endpoints matching the data models defined in `src/types/index.ts`.
3. **Payments & Escrow:**
   - Razorpay / Cashfree Marketplace API for Split Payments, Escrow holds, and automated Payouts/UPI transfers to partner bank accounts.
4. **Maps & Geospatial:**
   - Google Maps Platform / Mapbox SDK for live location autocomplete, reverse geocoding, and route calculation.
5. **Real-time Messaging & Telephony:**
   - WebSockets / Socket.io / Twilio Conversations for live chat.
   - Exotel / Knowlarity for masked telephony calling proxies.
6. **Push Notifications:**
   - Firebase Cloud Messaging (FCM) / Apple APNs for native mobile push alerts.

