# TourMe Frontend - Development Instructions

Welcome to **TourMe**, a full-stack tourist-driver ride-sharing and tour bidding platform! This guide will help you understand the project architecture, set up your development environment, and contribute effectively.

## Table of Contents

1. [Project Overview](#project-overview)
2. [System Architecture & User Flows](#system-architecture--user-flows)
3. [Data Model & Key Concepts](#data-model--key-concepts)
4. [Development Environment Setup](#development-environment-setup)
5. [Project Structure Walkthrough](#project-structure-walkthrough)
6. [Tech Stack Overview](#tech-stack-overview)
7. [Contribution Guidelines](#contribution-guidelines)
8. [Common Development Tasks](#common-development-tasks)
9. [Testing & Code Quality](#testing--code-quality)
10. [Building & Deployment](#building--deployment)
11. [FAQ & Troubleshooting](#faq--troubleshooting)

---

## Project Overview

### What is TourMe?

TourMe is a bidding platform that connects **Tourists** (travelers who need transportation and guided tours) with **Drivers** (drivers offering their services). The platform includes an **Administrator** role for account verification, dispute resolution, and system monitoring.

### Core Features

- **Tourist-centric Itinerary Creation**: Tourists create multi-destination itineraries with specific dates and overnight stays
- **Dynamic Bidding System**: Drivers view available itineraries and submit competitive price bids
- **Smart Selection**: Tourists compare bids (price, driver ratings, vehicle details) and select the best option
- **Real-time Communication**: Integrated messaging and trip status tracking
- **Rating & Feedback**: Post-trip reviews and ratings to build trust and accountability
- **Admin Dashboard**: Verify drivers, manage disputes, monitor activity, and enforce platform rules

### User Roles

| Role              | Primary Responsibility                                 |
| ----------------- | ------------------------------------------------------ |
| **Tourist**       | Create itineraries, bid selection, ratings             |
| **Driver**        | Document verification, bid submission, trip acceptance |
| **Administrator** | Account verification, dispute resolution, compliance   |

---

## System Architecture & User Flows

This section outlines the three main user journeys. Refer to the UML diagrams in `docs/uml/` for detailed visual representations.

### 1. Tourist Flow (`docs/uml/tourist-activity-diagram.puml`)

```
Register/Login
    ↓
Manage Profile
    ↓
Create Itinerary (with multiple destinations, overnight stays, dates)
    ↓
View Estimated Distance/Duration (powered by mapping service)
    ↓
Submit Itinerary for Bids
    ↓
Receive Notifications (new bids arrive)
    ↓
View & Compare Bids (price, driver details, vehicle info, ratings)
    ↓
Select Driver
    ↓
Communicate with Driver
    ↓
View Trip Status (real-time tracking)
    ↓
[Trip Completed?]
    yes → Rate Driver + Provide Feedback
    no → Cancel Trip (if allowed)
```

**Key BFF Pages to Build**:

- Dashboard (view active trips, past trips, created itineraries)
- Create/Edit Itinerary form
- Bid comparison view
- Trip details & communication
- Ratings & feedback form

---

### 2. Driver Flow (`docs/uml/driver-activity-diagram.puml`)

```
Register/Login
    ↓
Manage Profile
    ↓
Manage Vehicle Details
    ↓
Upload Verification Documents (license, vehicle registration, insurance)
    ↓
Wait for Admin Verification
    ↓
[Admin Approved?]
    yes → Update Availability + View Available Itineraries
    no → Revise Documents & Resubmit
    ↓
View Trip Details (destinations, distance, duration, tourist rating)
    ↓
Submit Bid (price quotation)
    ↓
View Bid Status (pending, accepted, rejected)
    ↓
[Bid Accepted?]
    yes → Receive Notification + Accept/Decline Trip
    ↓
Communicate with Tourist
    ↓
View Ratings & Feedback
```

**Key Pages to Build**:

- Driver profile & vehicle management
- Document verification form (upload UI)
- Available itineraries listing
- Bid submission form
- Bid tracking & notifications
- Communication interface

---

### 3. Administrator Flow (`docs/uml/admin-activity-diagram.puml`)

```
Login
    ↓
View & Manage Tourist Accounts
    ↓
View & Manage Driver Accounts
    ↓
View Driver Documents
    ↓
Verify Documents → [Valid?]
    yes → Approve Driver
    no → Reject Driver
    ↓
Ban/Suspend Users (policy violations)
    ↓
View All Trips/Bids
    ↓
Moderate Feedback/Ratings
    ↓
Monitor System Activity (logs, metrics)
    ↓
Resolve Disputes (escalation management)
```

**Key Pages to Build**:

- Admin dashboard (overview metrics)
- User account management (tourist/driver lists)
- Document verification interface
- Dispute resolution interface
- Activity monitoring & logs

---

## Data Model & Key Concepts

Refer to `docs/uml/class-diagram.puml` for the complete data model.

### Core Entities

#### **User Hierarchy** (Abstract Base Class)

```
User (abstract)
├── userId: int
├── name: string
├── email: string
├── passwordHash: string
├── login() / logout()
│
├── Tourist
│   ├── createItinerary()
│   ├── acceptBid()
│   └── implements IAuthenticable, IReviewable
│
├── Driver
│   ├── vehicleDetails: string
│   ├── placeBid()
│   ├── updateLocation()
│   └── implements IAuthenticable, IReviewable
│
└── Administrator
    ├── verifyDriver()
    ├── manageUsers()
    └── implements IAuthenticable
```

#### **Itinerary**

Represents a tourist's travel request with multiple destinations.

```
Itinerary {
  itineraryId: int (PK)
  pickupLocation: string
  destination: string (can be multiple via array)
  status: enum
  overnightStays?: array
  travelDates: date[]
  estimatedDuration?: duration
  estimatedDistance?: float
}
```

**Itinerary Lifecycle** (`docs/uml/itinerary-state-machine.puml`):

```
Draft
  ↓ (submit for bids)
Submitted
  ↓
OpenForBids
  ↓ (receive first bid)
Bidding
  ↓ (select driver + driver accepts)
Accepted
  ↓ (trip starts)
InProgress
  ↓ (trip ends)
Completed
  ↓ (tourist provides rating)
Rated
  ↓
Archived

Alternate paths:
- OpenForBids → Cancelled (before bidding start)
- Bidding → Cancelled (before selection)
- Accepted → Disputed (report issue) → Resolved → Completed/Cancelled
```

#### **Bid**

Represents a driver's price quotation for an itinerary.

```
Bid {
  bidId: int (PK)
  driverId: int (FK → Driver)
  itineraryId: int (FK → Itinerary)
  amount: decimal
  status: enum
  submitDate: timestamp
}
```

**Bid Lifecycle** (`docs/uml/bid-state-machine.puml`):

```
Submitted
  ↓ (awaiting tourist choice)
Pending
  ↓ (tourist selects this bid)
Accepted
  ↓ (driver accepts trip)
Confirmed
  ↓ (trip completed)
Completed

Alternate paths:
- Accepted → Declined (driver declines)
- Pending → Rejected (itinerary cancelled or other bid selected)
- Confirmed → Declined (driver declines late)
```

#### **Review & Rating**

```
Review {
  reviewId: int (PK)
  rating: int (1-5 stars)
  comment: string
  writerUserId: int (FK)
  targetUserId: int (FK)
}
```

Implements `IReviewable` interface:

- `getRating()` — retrieve average rating
- `addReview()` — submit new review

#### **Payment**

```
Payment {
  paymentId: int (PK)
  bidId: int (FK → Bid)
  amount: decimal
  status: enum (pending, completed, refunded)
  processPayment()
}
```

#### **BiddingSystem** (Service Layer)

Orchestrates core business logic:

- `trackItinerary()` — manage itinerary state transitions
- `processBid()` — handle bid acceptance/rejection logic

### Key Relationships

```
Tourist "1" ---creates--- "0..*" Itinerary
Itinerary "1" ---receives--- "0..*" Bid
Driver "1" ---places--- "0..*" Bid
Bid "1" ---results in--- "0..1" Payment
Tourist "1" ---writes--- "0..*" Review
Driver "1" ---receives--- "0..*" Review
```

---

## Development Environment Setup

### Prerequisites

- **Node.js** v18+ (check with `node --version`)
- **npm** v9+ (check with `npm --version`)
- **Git** (for cloning the repo)
- A code editor (VS Code recommended)

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd tourme-frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs all required packages listed in `package.json`. First-time installation may take 2-3 minutes.

### Step 3: Create Environment Variables (if needed)

If the project requires backend API URLs or configuration:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

```
VITE_API_BASE_URL=http://localhost:3000
VITE_API_TIMEOUT=5000
# Add other env vars as needed
```

_Note: Check with project maintainers for required environment variables._

### Step 4: Verify Setup

Run the development server:

```bash
npm run dev
```

You should see output like:

```
VITE v7.3.1 ready in 123 ms

➜  Local:   http://localhost:8011/
➜  press h + enter to show help
```

**✅ Success!** Open `http://localhost:8011/` in your browser.

### Step 5: Stop the Server

Press `Ctrl+C` in the terminal to stop the development server.

---

## Project Structure Walkthrough

```
tourme-frontend/
├── .github/
│   ├── INSTRUCTIONS.md (← You are here!)
│   └── WORKFLOWS/ (CI/CD configs, if any)
│
├── src/
│   ├── routes/ (← Routed pages/layouts)
│   │   ├── __root.tsx (← Root layout, wraps all pages)
│   │   ├── index.tsx (← Home page)
│   │   ├── about.tsx (← About page)
│   │   └── [other route files]
│   │
│   ├── components/ (← Reusable UI components)
│   │   ├── Header.tsx (← Navigation, logo, user menu)
│   │   ├── Footer.tsx (← Footer content)
│   │   ├── ThemeToggle.tsx (← Dark/light mode switcher)
│   │   └── [feature components - to be built]
│   │
│   ├── lib/
│   │   ├── utils.ts (← Utility functions, helpers)
│   │   └── [API client, formatters, etc.]
│   │
│   ├── router.tsx (← Route configuration, app structure)
│   ├── routeTree.gen.ts (← Auto-generated route tree; do NOT edit)
│   └── styles.css (← Global Tailwind CSS)
│
├── public/ (← Static assets: favicon, manifest, etc.)
│   ├── manifest.json (← PWA manifest)
│   └── robots.txt (← SEO robots instruction)
│
├── docs/
│   └── uml/ (← UML diagrams: reference for architecture)
│       ├── use-case-diagram.puml
│       ├── class-diagram.puml
│       ├── itinerary-state-machine.puml
│       ├── bid-state-machine.puml
│       ├── tourist-activity-diagram.puml
│       ├── driver-activity-diagram.puml
│       ├── admin-activity-diagram.puml
│       └── [other diagrams]
│
├── package.json (← Dependencies & scripts)
├── tsconfig.json (← TypeScript configuration)
├── vite.config.ts (← Build config & plugins)
├── eslint.config.js (← Linting rules)
├── prettier.config.js (← Code formatting rules)
└── README.md (← Quick start readme)
```

### Key Files Explained

| File               | Purpose                                                                   |
| ------------------ | ------------------------------------------------------------------------- |
| `src/router.tsx`   | Defines all routes and navigation; start here to understand app structure |
| `src/routes/`      | Each file is a page/layout. Use TanStack Router conventions               |
| `src/components/`  | Reusable UI blocks (buttons, forms, cards, modals, etc.)                  |
| `src/lib/utils.ts` | Helper functions (formatting dates, API calls, validation, etc.)          |
| `tsconfig.json`    | TypeScript compiler options; defines `#/*` alias for `src/*`              |
| `vite.config.ts`   | Build tool config; runs React, Tailwind, routing plugins                  |
| `docs/uml/`        | **Reference!** Start here to understand features before building          |

---

## Tech Stack Overview

### Frontend Framework & Routing

**React 19** with **TanStack Start**

- Modern component-based UI library
- TanStack React Start: Full-stack framework layering on React, preconfigured Vite, SSR-ready
- TanStack React Router: Enterprise-grade file-based routing
- Enables features like static generation, server functions, data fetching out-of-box

### Styling

**Tailwind CSS v4**

- Utility-first CSS framework
- Responsive design with breakpoints (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`)
- Dark mode support built-in
- `@tailwindcss/vite` plugin for zero-config integration

### Type Safety

**TypeScript 5.7**

- Static type checking at build time
- Catches errors before runtime
- Powerful IDE autocomplete

### Testing

**Vitest 3**

- Fast unit test runner (compatible with Jest syntax)
- Uses jsdom for DOM testing
- React Testing Library for component testing

### Code Quality

- **ESLint**: Catches bugs and enforces consistent code style
- **Prettier**: Auto-formats code to consistent style

### Development Tools

- **Vite 7**: Ultra-fast bundler and dev server
- **@tanstack/devtools**: React debugging tools
- **@tanstack/react-router-devtools**: Router debugging tools
- **Lucide React**: Icon library (1000+ icons)

---

## Contribution Guidelines

### 1. Workflow Overview

```
1. Pick an issue/feature from project board
   ↓
2. Create a feature branch
   ↓
3. Write code + tests
   ↓
4. Run linting & formatting
   ↓
5. Commit with descriptive message
   ↓
6. Push branch + open Pull Request
   ↓
7. Wait for code review
   ↓
8. Address feedback (if any)
   ↓
9. Merge to main
```

### 2. Branch Naming Convention

Use descriptive, kebab-case branch names:

```
Feature:        feat/tourist-itinerary-creation
Bug fix:        fix/bid-state-validation
Refactor:       refactor/bid-service-abstraction
Documentation:  docs/setup-instructions
Testing:        test/bid-submission-form
```

### 3. Commit Message Structure

```
<type>(<scope>): <subject>

<body (optional)>
```

**Examples:**

```
feat(tourist): add itinerary creation form
fix(bid): correct status transition in pending state
docs(setup): add environment variable examples
test(driver-profile): add unit tests for vehicle form
refactor(auth): extract login logic to custom hook
```

**Types:**

- `feat` — New feature
- `fix` — Bug fix
- `docs` — Documentation
- `test` — Adding or updating tests
- `refactor` — Code restructuring (no feature change)
- `style` — Formatting, missing semicolons, etc. (shouldn't happen with Prettier)
- `perf` — Performance improvement
- `chore` — Non-code changes (deps, config, etc.)

### 4. Before Submitting a PR

**Run these commands to ensure your code is ready:**

```bash
# Run tests
npm run test

# Check and fix linting issues
npm run lint --fix  (or: npm run check)

# Verify code formatting
npm run format

# Build to catch TypeScript errors
npm run build
```

All of these should pass before pushing.

### 5. Pull Request Checklist

Before requesting review:

- [ ] Branch is up-to-date with `main`
- [ ] All tests pass (`npm run test`)
- [ ] Code is formatted (`npm run check`)
- [ ] No TypeScript errors (`npm run build`)
- [ ] Commit messages are descriptive
- [ ] PR title matches the feature (e.g., "Add tourist itinerary creation")
- [ ] PR description explains the "why" (references issue #123)
- [ ] No console errors or warnings in browser
- [ ] Responsive design tested (mobile, tablet, desktop)

### 6. Code Review Expectations

- Reviews typically happen within 24-48 hours
- Be open to feedback; reviewers are helping you improve
- Address all feedback before re-requesting review
- Small, focused PRs get reviewed faster than large ones
- Aim for PR size: 200-400 lines max

---

## Common Development Tasks

### Creating a New Page/Route

**Example**: Add a new "Driver Dashboard" page

1. Create file `src/routes/driver-dashboard.tsx`:

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/driver-dashboard')({
  component: DriverDashboard,
})

function DriverDashboard() {
  return (
    <div className="container mx-auto p-4">
      <h1>Driver Dashboard</h1>
      {/* Your content here */}
    </div>
  )
}
```

2. The route is **automatically registered** — visit `/driver-dashboard` in your browser.

3. Link to it from Navigation:

```tsx
import { Link } from '@tanstack/react-router'

;<Link to="/driver-dashboard">My Dashboard</Link>
```

### Building a Form (e.g., Bid Submission)

1. Create component `src/components/BidSubmissionForm.tsx`:

```tsx
import { useState } from 'react'

export function BidSubmissionForm({ itineraryId }: { itineraryId: number }) {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/bids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itineraryId, amount: parseFloat(amount) }),
      })

      if (response.ok) {
        alert('Bid submitted successfully!')
        setAmount('')
      }
    } catch (error) {
      console.error('Failed to submit bid:', error)
      alert('Failed to submit bid')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="amount" className="block text-sm font-medium">
          Bid Amount ($)
        </label>
        <input
          id="amount"
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1 w-full border rounded px-3 py-2"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit Bid'}
      </button>
    </form>
  )
}
```

2. Use in a route:

```tsx
import { BidSubmissionForm } from '../components/BidSubmissionForm'

function BidPage() {
  return <BidSubmissionForm itineraryId={123} />
}
```

### Styling Components with Tailwind

Tailwind uses **utility classes** instead of CSS files:

```tsx
// ❌ Don't do this (would require CSS):
<div className="my-card">...</div>

// ✅ Do this (use Tailwind utilities):
<div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
  ...
</div>
```

**Common Patterns:**

```tsx
// Container with padding & max-width
<div className="container mx-auto px-4">

// Responsive grid (3 cols on desktop, 1 on mobile)
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">

// Flexbox: space items, center align
<div className="flex justify-between items-center">

// Dark mode: different styles for dark theme
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
```

### Accessing Route Parameters

Example: Get the itinerary ID from URL `/itinerary/:itineraryId`

```tsx
import { useParams } from '@tanstack/react-router'

function ItineraryDetail() {
  const { itineraryId } = useParams({ from: '/itinerary/:itineraryId' })

  return <div>Viewing itinerary: {itineraryId}</div>
}
```

### Fetching Data from Backend

```tsx
import { useState, useEffect } from 'react'

function ItineraryList() {
  const [itineraries, setItineraries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/itineraries')
      .then((res) => res.json())
      .then((data) => {
        setItineraries(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <ul>
      {itineraries.map((it) => (
        <li key={it.id}>{it.destination}</li>
      ))}
    </ul>
  )
}
```

### Adding Custom Hooks

Create reusable logic in `src/lib/hooks.ts`:

```tsx
import { useState, useEffect } from 'react'

export function useFetch(url: string) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch((e) => setError(e))
      .finally(() => setLoading(false))
  }, [url])

  return { data, loading, error }
}
```

Usage:

```tsx
function MyComponent() {
  const { data: itineraries, loading } = useFetch('/api/itineraries')
  if (loading) return <p>Loading...</p>
  return <div>{/* render itineraries */}</div>
}
```

---

## Testing & Code Quality

### Running Tests

```bash
npm run test
```

Runs all `.test.ts` or `.test.tsx` files using Vitest.

### Example Test File `src/components/BidSubmissionForm.test.tsx`

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BidSubmissionForm } from './BidSubmissionForm'

describe('BidSubmissionForm', () => {
  it('renders the bid form', () => {
    render(<BidSubmissionForm itineraryId={1} />)
    expect(screen.getByLabelText(/Bid Amount/i)).toBeInTheDocument()
  })

  it('submits form with correct data', async () => {
    const mockFetch = vi.fn()
    global.fetch = mockFetch

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    })

    render(<BidSubmissionForm itineraryId={1} />)

    const input = screen.getByLabelText(/Bid Amount/i)
    const button = screen.getByText(/Submit Bid/i)

    fireEvent.change(input, { target: { value: '150' } })
    fireEvent.click(button)

    expect(mockFetch).toHaveBeenCalledWith(
      '/api/bids',
      expect.objectContaining({ method: 'POST' }),
    )
  })
})
```

### Linting & Formatting

**Check for issues:**

```bash
npm run lint
```

**Auto-fix issues:**

```bash
npm run lint --fix
```

**Check formatting:**

```bash
npm run format
```

**Auto-format code:**

```bash
npm run check
```

### Common Issues & Fixes

| Issue                   | Cause                      | Solution                      |
| ----------------------- | -------------------------- | ----------------------------- |
| Unused variable warning | Imported but not used      | Delete import or use variable |
| Missing closing brace   | Syntax error               | Check matching `{}`           |
| Type mismatch           | TypeScript error           | Cast type or fix actual type  |
| Missing `await`         | Async function not awaited | Add `await` keyword           |

---

## Backend Integration Points

### Expected API Endpoints

The frontend will consume the following backend endpoints. Refer to `docs/uml/class-diagram.puml` for data model details.

#### **Authentication**

- `POST /api/auth/register` — Register user (tourist/driver)
- `POST /api/auth/login` — User login
- `POST /api/auth/logout` — User logout
- `GET /api/auth/me` — Get current user

#### **Itineraries**

- `GET /api/itineraries` — List all itineraries (paginated)
- `GET /api/itineraries/:id` — Get itinerary details
- `POST /api/itineraries` — Create new itinerary
- `PATCH /api/itineraries/:id` — Update itinerary
- `DELETE /api/itineraries/:id` — Delete itinerary (if draft)

#### **Bids**

- `GET /api/itineraries/:itineraryId/bids` — Get bids for an itinerary
- `POST /api/bids` — Submit a bid (driver)
- `PATCH /api/bids/:id` — Update bid
- `DELETE /api/bids/:id` — Cancel bid

#### **Users**

- `GET /api/users/:id` — Get user profile
- `PATCH /api/users/:id` — Update user profile
- `GET /api/drivers/:id/rating` — Get driver average rating
- `POST /api/documents` — Upload verification documents (driver)
- `GET /api/documents/:id` — Get document (admin)

#### **Reviews**

- `POST /api/reviews` — Submit review/rating
- `GET /api/users/:id/reviews` — Get user reviews

#### **Admin**

- `GET /api/admin/users` — List all users
- `GET /api/admin/drivers/pending` — List drivers awaiting verification
- `PATCH /api/admin/drivers/:id/verify` — Approve/reject driver
- `POST /api/admin/disputes` — Resolve dispute
- `GET /api/admin/activity` — Get system activity logs

### API Client Setup

Create `src/lib/api.ts` for centralized API calls:

```tsx
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`)
  }

  return response.json()
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      apiCall('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    register: (user: any) =>
      apiCall('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(user),
      }),
  },

  itineraries: {
    list: () => apiCall('/api/itineraries'),
    get: (id: number) => apiCall(`/api/itineraries/${id}`),
    create: (data: any) =>
      apiCall('/api/itineraries', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  bids: {
    get: (itineraryId: number) =>
      apiCall(`/api/itineraries/${itineraryId}/bids`),
    create: (data: any) =>
      apiCall('/api/bids', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },
}
```

Usage in components:

```tsx
import { api } from '../lib/api'

const itineraries = await api.itineraries.list()
const bid = await api.bids.create({ itineraryId: 1, amount: 150 })
```

---

## Building & Deployment

### Local Production Build

Test the production build locally:

```bash
npm run build
npm run preview
```

Then open the preview URL (typically `http://localhost:4173`).

### Build Output

The `npm run build` command creates:

- Optimized JavaScript bundles (code splitting)
- Minified CSS
- Optimized images
- SourceMaps for debugging (optional, can disable in `vite.config.ts`)

Output is in the `dist/` directory.

### Deployment Strategies

The built app (`dist/` folder) can be deployed to:

- **Vercel** (recommended for TanStack Start): Zero-config, automatic SSR
- **Netlify**: Static hosting with serverless functions
- **AWS S3 + CloudFront**: Object storage + CDN
- **Docker** (custom): Build image with Node, serve with Nginx

For each platform, follow their documentation for connecting your GitHub repo.

### Environment Variables for Production

Create `.env.production`:

```
VITE_API_BASE_URL=https://api.tourme.com
VITE_LOG_LEVEL=warn
```

These override development values during `npm run build`.

---

## FAQ & Troubleshooting

### Q: "npm install" fails with permission errors

**A:** Try clearing npm cache:

```bash
npm cache clean --force
npm install
```

If still failing, you may need to use `sudo npm install` (not recommended). Better: check npm documentation for proper setup.

### Q: Dev server runs but pages show blank

**A:** Clear browser cache:

1. Open DevTools (F12)
2. Right-click refresh button, select "Empty cache and hard refresh"
3. Or press Ctrl+Shift+Delete to open cache clearing options

### Q: TypeScript errors about missing types

**A:** Install missing type definitions:

```bash
npm install --save-dev @types/node
```

### Q: "Module not found" error for `#/...` imports

**A:** The `#/*` alias is configured in `tsconfig.json` and should work automatically. If not:

1. Restart your IDE
2. Run `npm run build` to check for real errors
3. Verify `tsconfig.json` has correct `paths` configuration

### Q: Tests fail but code works in browser

**A:** Tests may need environment setup. Check:

1. Mock data is correct
2. Vitest config includes `environment: 'jsdom'` (in `vite.config.ts`)
3. Dependencies are installed

### Q: How do I debug in VS Code?

**A:** Add to `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:8011",
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
```

Then press F5 to start debugging.

### Q: How do I connect to the backend?

**A:** The backend API base URL is configured via environment variables:

1. Set `VITE_API_BASE_URL` in `.env.local` or `.env.production`
2. Use the `api` helper functions in `src/lib/api.ts`
3. If backend is not running, Frontend will still load but API calls will fail

---

## Additional Resources

- **TanStack React Router**: https://tanstack.com/router/latest
- **TanStack React Start**: https://tanstack.com/start/latest
- **React Documentation**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Vitest**: https://vitest.dev
- **TypeScript**: https://www.typescriptlang.org/docs

---

## Contact & Support

For questions or issues:

1. Check the [FAQ & Troubleshooting](#faq--troubleshooting) section above
2. Review the UML diagrams in `docs/uml/` for architecture clarification
3. Open an issue on GitHub with a clear description
4. Reach out to the project maintainers

---

**Welcome to the TourMe team! Great to have you here. Happy coding! 🚀**
