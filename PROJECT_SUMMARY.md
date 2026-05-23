# Yellowduck Freight Systems - Project Summary

## Overview
**Yellowduck** is an Industrial Shipment Tracking Platform built with Next.js 14, React 18, Tailwind CSS, Firebase, and Lucide Icons. The application is designed for managing and tracking international freight shipments with a focus on real-time tracking, customs clearance, and facility management.

---

## Project Technology Stack

### Dependencies
- **Next.js**: 14.2.0 - React framework with App Router
- **React**: 18.3.1 - UI library
- **Firebase**: 12.13.0 - Backend database and authentication
- **Tailwind CSS**: 4 - Utility-first CSS framework
- **Lucide React**: 1.16.0 - Icon library
- **Zod**: 4.4.3 - TypeScript-first schema validation
- **clsx**: 2.1.1 - Utility for conditional CSS classes

### Dev Dependencies
- **ESLint**: 9 - Code linting
- **Babel Plugin React Compiler**: 1.0.0 - React optimization
- **Tailwind CSS PostCSS**: 4 - PostCSS integration

---

## Directory Structure

```
app/
├── layout.js                    # Root layout with Navbar
├── globals.css                  # Global styles
├── loading.js                   # Global loading state
├── (public)/                    # Public routes (no auth required)
│   ├── page.js                  # Landing/Home page
│   ├── about/page.js            # About page (template)
│   ├── contact/page.js          # Contact page (empty)
│   ├── pricing/page.js          # Pricing page (empty)
│   └── track/[id]/              # Dynamic tracking page
│       ├── page.js              # Tracking details page
│       ├── error.js             # Error boundary component
│       └── loading.js           # Loading state
├── admin/                       # Admin dashboard
│   ├── layout.js                # Admin layout
│   ├── page.js                  # Admin overview/dashboard
│   ├── analytics/page.js        # Analytics page (template)
│   ├── customs/page.js          # Customs management (template)
│   ├── drivers/                 # Drivers section (empty)
│   ├── exceptions/page.js       # Exceptions management (template)
│   ├── facilities/page.js       # Facility management
│   ├── manifests/page.js        # Manifests management (template)
│   ├── shipments/page.js        # Shipments management (template)
│   └── users/page.js            # Users management (template)
├── auth/                        # Authentication routes
│   ├── login/page.js            # Login page (template)
│   └── register/page.js         # Registration page (template)
├── dashboard/                   # User dashboard
│   ├── layout.js                # Dashboard layout
│   ├── page.js                  # Dashboard overview
│   ├── components/
│   │   └── Navbar.jsx           # Dashboard topbar component
│   ├── create/page.js           # Create shipment wizard
│   ├── shipments/page.js        # My shipments list (empty)
│   ├── invoices/page.js         # Invoices page (template)
│   ├── settings/page.js         # Settings page (empty)
│   └── tracking/page.js         # Personal tracking (empty)
└── api/                         # API routes
    ├── shipments/               # Shipments endpoints (empty)
    ├── track/                   # Tracking endpoints (empty)
    └── webhooks/                # Webhook handlers (empty)

components/
├── Logo.js                      # Yellowduck logo component
├── nav/
│   ├── Navbar.jsx               # Main navigation bar
│   ├── Sidebar.js               # Dashboard sidebar
│   ├── Testnav.jsx              # Test navigation component
│   ├── nav-item.jsx             # Navigation item component
│   ├── nav-section.jsx          # Navigation section component
│   ├── mobile-drawer.jsx        # Mobile menu drawer
│   └── use-lock-body-scroll.js  # Hook for mobile menu scroll lock
└── tracking/                    # Tracking related components

lib/
├── firebase/
│   ├── client.js                # Firebase client config
│   └── firestore.js             # Firestore helpers
├── logistics/
│   ├── statusMachine.js         # Shipment status state machine
│   └── pricing/
│       ├── calculateChargeableWeight.js
│       └── calculateVolumetricWeight.js
├── validators/
│   └── shipment.schema.js       # Zod schema for shipment validation
└── validators.js                # General validators

constants/
└── index.js                     # All application constants and data

services/
└── shipment.service.js          # Shipment business logic

public/
└── [assets]                     # Static assets

```

---

## Pages & Features

### 1. **Public Pages** (`app/(public)/`)

#### Home Page (`page.js`)
- **Status**: Fully implemented
- **Features**:
  - Hero section with tracking input
  - Feature cards (Global Reach, Real-Time Tracking, Secure Handling)
  - Trusted by companies section
  - CTA banner
  - Footer with company/social links
- **Components Used**:
  - `TrackingInput()` - Form with search functionality
  - `FeatureCard()` - Reusable feature display
  - `FooterColumn()` - Footer layout helper
- **State Management**:
  - `useState` for tracking input value and loading state
- **Data**:
  - Imports from `/constants`: HERO, FEATURES_SECTION, FEATURES, TRUSTED_BY, CTA_BANNER, FOOTER_*
- **Icons**: Lucide React (Search, ArrowRight, CheckCircle2, Sparkles, Zap, Twitter, Linkedin, Github, Facebook, Mail, Phone, ChevronRight)

#### Tracking Page (`track/[id]/page.js`)
- **Status**: Fully implemented with mock data
- **Features**:
  - Dynamic shipment details display
  - Multiple status tracking steps (PICKED_UP, IN_TRANSIT, CUSTOMS_HOLD, etc.)
  - Shipment metadata (weight, dimensions, insurance, value)
  - Sender/recipient information
  - Progress visualization (65%)
  - Expandable timeline of events
  - Copy tracking ID functionality
- **Mock Data Structure** (`MOCK_SHIPMENT`):
  ```javascript
  {
    id, status, statusLabel, origin, destination, eta, etaWindow,
    service, carrier, weight, dimensions, declared_value, insurance,
    sender, recipient, progress
  }
  ```
- **Status Steps**: STEPS array with 8 tracking statuses
- **Functions**:
  - Status rendering logic
  - Timeline event display
  - Progress bar calculation
- **Icons**: Package, MapPin, Clock, CheckCircle2, AlertTriangle, Plane, Truck, Warehouse, etc.

#### Error Page (`track/[id]/error.js`)
- **Status**: Fully implemented
- **Features**:
  - User-friendly error display
  - "Try Again" button (calls `reset()`)
  - "New Search" link
  - "Back to Home" link
  - Error message display
  - Gradient background
- **Props**: `{ error, reset }`

#### Template Pages
- **About** (`about/page.js`) - Minimal template
- **Contact** (`contact/page.js`) - Empty
- **Pricing** (`pricing/page.js`) - Empty

---

### 2. **Admin Pages** (`app/admin/`)

#### Admin Dashboard (`page.js`)
- **Status**: Fully implemented with mock data
- **Features**:
  - Global metrics cards (Active Shipments, In-Flight, Customs Holds, Delays, etc.)
  - Delayed shipments list with severity indicators
  - Customs holds table
  - Facility throughput stats
- **Mock Data**:
  - `GLOBAL_METRICS[]` - 8 metric cards
  - `DELAYED[]` - 4 delayed shipment records
  - `CUSTOMS_HOLDS[]` - 3 customs hold records
  - `FACILITY_THROUGHPUT[]` - Facility performance data
- **Components**:
  - Imports Sidebar and Topbar components
- **Icons**: Package, Plane, Shield, Clock, AlertTriangle, CheckCircle2, Warehouse, Globe, Zap, MapPin, RefreshCw, XCircle, TrendingUp, TrendingDown, ChevronRight

#### Facilities Management (`facilities/page.js`)
- **Status**: Fully implemented with mock data
- **Features**:
  - Summary cards (Total, Online, Degraded, Offline facilities)
  - Facilities table with detailed information
  - Status indicators (ONLINE, DEGRADED, OFFLINE)
  - Throughput and capacity monitoring
  - Facility location details
- **Mock Data**:
  - `SUMMARY[]` - 4 summary cards
  - `FACILITIES[]` - Multiple facility records with properties:
    ```javascript
    {
      code, name, country, flag, timezone, type, status,
      throughput, inbound, outbound, capacity, managed_by, last_updated
    }
    ```
- **Icons**: Warehouse, Globe, Plane, TrendingUp, CheckCircle2, AlertTriangle, XCircle, MapPin, Clock, BarChart3, Plus, Search, ChevronRight, Filter

#### Template Admin Pages (Minimal)
- **Analytics** (`analytics/page.js`) - Empty template
- **Customs** (`customs/page.js`) - Empty template
- **Exceptions** (`exceptions/page.js`) - Empty template
- **Manifests** (`manifests/page.js`) - Empty template
- **Shipments** (`shipments/page.js`) - Empty template
- **Users** (`users/page.js`) - Empty template

#### Admin Layout (`layout.js`)
- Clean layout with children render
- No additional styling applied

---

### 3. **Dashboard Pages** (`app/dashboard/`)

#### Dashboard Overview (`page.js`)
- **Status**: Fully implemented with mock data
- **Features**:
  - User metrics (Total Shipments, In Transit, Delivered, Returns)
  - Recent activity/shipments list
  - Quick action links
  - Performance trends
- **Mock Data**:
  - `METRICS[]` - Performance indicators
  - `SHIPMENTS[]` - Recent shipment records
  - `QUICK_ACTIONS[]` - Action links
- **Components**:
  - Sidebar and Topbar imports
- **Icons**: Package, TrendingUp, TrendingDown, Clock, CheckCircle2, AlertTriangle, ArrowRight, Plane, Truck, Warehouse, Shield, Plus, BarChart3, MapPin, ChevronRight

#### Create Shipment (`create/page.js`)
- **Status**: Fully implemented multi-step form
- **Features**:
  - 7-step wizard form:
    1. Sender information
    2. Recipient information
    3. Package details
    4. Customs declaration
    5. Pricing options
    6. Payment method
    7. Order confirmation
  - Step progress indicator
  - Form validation
  - Navigation between steps
- **Form Components**:
  - `Label()` - for form labels with required indicator
  - `Input()` - styled input field
  - Step-specific forms for each section
- **Steps Configuration**:
  ```javascript
  STEPS = [
    { id: 1, label: "Sender", icon: User },
    { id: 2, label: "Recipient", icon: MapPin },
    { id: 3, label: "Package", icon: Package },
    { id: 4, label: "Customs", icon: Shield },
    { id: 5, label: "Pricing", icon: DollarSign },
    { id: 6, label: "Payment", icon: CreditCard },
    { id: 7, label: "Confirm", icon: CheckCircle2 }
  ]
  ```
- **Icons**: User, MapPin, Package, Shield, DollarSign, CreditCard, CheckCircle2, ChevronRight, ChevronLeft, Check, Plane, AlertCircle

#### Template Dashboard Pages
- **Shipments** (`shipments/page.js`) - Empty
- **Invoices** (`invoices/page.js`) - Template
- **Settings** (`settings/page.js`) - Empty
- **Tracking** (`tracking/page.js`) - Empty

#### Dashboard Components
- **Navbar** (`components/Navbar.jsx`) - Dashboard topbar component

#### Dashboard Layout (`layout.js`)
- Basic layout structure

---

### 4. **Authentication Pages** (`app/auth/`)

#### Login Page (`login/page.js`)
- **Status**: Template with placeholder
- Simple template structure

#### Register Page (`register/page.js`)
- **Status**: Template with placeholder
- Simple template structure

---

## Global Components

### 1. **Logo Component** (`components/Logo.js`)
- **Type**: Utility component
- **Props**:
  - `size`: "sm" | "md" | "lg" (default: "md")
  - `variant`: "full" | "mark" (default: "full")
  - `theme`: "dark" | "light" (default: "dark")
- **Features**:
  - SVG-based minimalist duck mark
  - Wordmark text
  - Responsive scaling
  - Color theming (Dark Navy #0F172A + Electric Amber #FFB800)
- **Rendering**: Returns both DuckMark SVG and Wordmark text

### 2. **Navbar Component** (`components/nav/Navbar.jsx`)
- **Type**: Navigation header
- **Features**:
  - Sticky header with scroll detection
  - Backdrop blur effect on scroll
  - Responsive design (desktop & mobile)
  - Mobile menu drawer
  - Logo branding
  - Desktop navigation links
  - Track package CTA button
  - Auth links (Login/Sign up)
- **State**:
  - `mobileOpen` - Mobile menu visibility
  - `scrolled` - Scroll position state
- **Features Used**:
  - Logo component
  - Constants from `/constants` (PUBLIC_NAV_LINKS, PUBLIC_NAV_CTA, PUBLIC_NAV_AUTH)
  - Lucide Icons (Menu, X, Package)
- **Responsive Behavior**:
  - Desktop: Full horizontal navbar with all options
  - Mobile: Hamburger menu with drawer navigation
  - Body scroll lock when mobile menu open

### 3. **Sidebar Component** (`components/nav/Sidebar.js`)
- Used in admin and dashboard layouts
- Type: Navigation sidebar

### 4. **Logo Component**
- SVG-based branding element
- Scalable and themeable

---

## Constants & Data (`constants/index.js`)

### Navigation Constants
- **PUBLIC_NAV_LINKS**: Array of public page links (Solutions, Pricing, Enterprise, Developers, Blog)
- **PUBLIC_NAV_CTA**: Track Package button link
- **PUBLIC_NAV_AUTH**: Login/Sign up links
- **SIDEBAR_MAIN_LINKS**: Dashboard navigation (Overview, Shipments, Create, Tracking, Invoices, etc.)
- **SIDEBAR_SECONDARY_LINKS**: Dashboard secondary actions (Notifications, Team, Billing, Settings, Help)
- **SIDEBAR_ADMIN_LINKS**: Admin panel navigation

### Content Constants
- **HERO**: Home page hero section
  - Headline, subheadline, tracking placeholder
  - Stats (180+ countries, 2.4M packages monthly, 99.97% on-time, <1s latency)
- **FEATURES_SECTION**: Features section metadata
- **FEATURES**: Array of 3 main features (Global Reach, Real-Time Tracking, Secure Handling)
- **TRUSTED_BY**: Social proof companies
- **CTA_BANNER**: Call-to-action section

### Footer Constants
- **FOOTER_COLUMNS**: 3 column groups (Company, Services, Support)
- **FOOTER_SOCIALS**: Social media links (Twitter, LinkedIn, GitHub, Facebook)
- **FOOTER_CONTACT**: Contact info (Email, Phone)
- **FOOTER_LEGAL**: Legal links (Privacy, Terms, Cookies, GDPR)
- **FOOTER_META**: Tagline and copyright

---

## Services & Business Logic

### Shipment Service (`services/shipment.service.js`)
```javascript
async createShipment(data)
```
- Creates new shipment in Firestore
- Adds `createdAt` and `updatedAt` timestamps server-side
- Returns document reference

---

## Validation & Schemas

### Validation Schema (`lib/validators/shipment.schema.js`)
- **shipmentSchema** (Zod):
  - `receiverName`: string, min 2 chars
  - `weightKg`: positive number
  - `length`, `width`, `height`: positive numbers

### General Validators (`lib/validators.js`)
- Contains utility validation functions

---

## Library & Utilities

### Firebase Integration (`lib/firebase/`)
- **client.js**: Firebase client configuration
- **firestore.js**: Firestore database helpers
  - Collection references
  - Query utilities

### Logistics Module (`lib/logistics/`)
- **statusMachine.js**: Shipment status state machine logic
- **pricing/**:
  - `calculateChargeableWeight.js`: Weight calculation for billing
  - `calculateVolumetricWeight.js`: Volumetric weight calculation

---

## Root Layout (`app/layout.js`)

- Imports Navbar component
- Global CSS stylesheet
- Metadata configuration:
  - Title: "Yellowduck Freight Systems"
  - Description: "Industrial Shipment Tracking Platform"
- Structure:
  - Navbar at top
  - Children component for page content
  - Footer placeholder location

---

## API Routes (`app/api/`)

### Endpoints (Currently Empty/Placeholder)
- **shipments/**: Shipment API endpoints
- **track/**: Tracking API endpoints
- **webhooks/**: Webhook handlers for external integrations

---

## Key Features & Functionality

### 1. **Real-Time Tracking**
- Dynamic tracking page with shipment status
- 8-step tracking timeline
- Progress visualization
- Mock data implementation

### 2. **Shipment Management**
- Create multi-step shipment form
- 7-step wizard with validation
- Dashboard overview of shipments
- Admin shipment monitoring

### 3. **Facility Management**
- Monitor 44 global facilities
- Track facility status (Online, Degraded, Offline)
- Throughput and capacity management
- Location-based organization

### 4. **Customs Management**
- Hold tracking and monitoring
- Commodity classification
- Country-specific regulations
- Document management

### 5. **Analytics & Reporting**
- Global metrics dashboard
- Facility performance stats
- Delayed shipment tracking
- Exception management

### 6. **User Account Management**
- Login/Register pages (templates)
- Dashboard for users
- Settings management
- Billing and invoicing

---

## State Management & Hooks

- **useState**: Used throughout pages for form inputs, toggles, and UI state
- **useEffect**: Used in Navbar for scroll detection and body scroll locking
- **Custom Hooks**: `useLockBodyScroll()` for mobile menu

---

## Styling Approach

- **Tailwind CSS v4**: Primary styling framework
- **Class Utilities**: clsx for conditional styling
- **Design System**:
  - Color Palette:
    - Primary: Electric Amber (#FFB800)
    - Dark Navy: (#0F172A)
    - Grays: (#0B1120, #1E293B, #334155, #475569, #64748B, #94A3B8, #CBD5E1, #E2E8F0, #F8FAFC)
  - Spacing: Tailwind standard rem-based system
  - Rounded corners: Consistent use of `rounded-lg` and `rounded-xl`
  - Shadows: Subtle shadows on interactive elements

---

## Data Flow & Architecture

```
┌─────────────────────┐
│   Root Layout       │
│  • Navbar           │
│  • Page Content     │
│  • Footer (planned) │
└─────────────────────┘
         │
         ├─ Public Routes (/)
         │  ├─ Home Page (Landing)
         │  ├─ About
         │  ├─ Contact
         │  ├─ Pricing
         │  └─ Track/[id]
         │
         ├─ Admin Routes (/admin)
         │  ├─ Dashboard
         │  ├─ Facilities
         │  ├─ Customs
         │  ├─ Users
         │  └─ Analytics
         │
         ├─ Dashboard Routes (/dashboard)
         │  ├─ Overview
         │  ├─ Create Shipment
         │  ├─ My Shipments
         │  └─ Invoices
         │
         └─ Auth Routes (/auth)
            ├─ Login
            └─ Register

Data Sources:
• Mock Data (in-page CONST)
• Firestore (via Firebase SDK)
• Constants (/constants/index.js)
• Form Inputs (useState)
```

---

## Development Status

### Fully Implemented Pages
- ✅ Home/Landing (Public)
- ✅ Tracking Details (Public)
- ✅ Error Boundary (Tracking)
- ✅ Admin Dashboard
- ✅ Facilities Management
- ✅ Dashboard Overview
- ✅ Create Shipment Wizard (7-step form)
- ✅ Navbar (Global)

### Template/Placeholder Pages
- ⚠️ About, Contact, Pricing (Public)
- ⚠️ Analytics, Customs, Exceptions, Manifests, Shipments, Users (Admin)
- ⚠️ Settings, Shipments, Invoices, Tracking (Dashboard)
- ⚠️ Login, Register (Auth)

### Empty/Pending Implementation
- 🔲 API Routes (shipments, track, webhooks)
- 🔲 Mobile Drawer Navigation
- 🔲 Dashboard Components Library

---

## Future Implementation Priorities

1. **API Endpoints**: Implement REST/GraphQL API for shipment operations
2. **Authentication**: Complete login/register flows with Firebase Auth
3. **Backend Integration**: Replace mock data with Firestore queries
4. **Webhook System**: Set up webhook handlers for external integrations
5. **Component Library**: Create reusable tracking/shipment components
6. **Testing**: Add unit and integration tests
7. **Performance**: Optimize images, implement lazy loading
8. **Accessibility**: Add ARIA labels and keyboard navigation

