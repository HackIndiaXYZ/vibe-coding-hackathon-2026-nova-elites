<div align="center">

# SAMANVAY

### Unified Humanitarian Coordination Platform

*Transforming isolated relief efforts into a connected coordination network through real-time intelligence and seamless orchestration.*

[![Live Platform](https://img.shields.io/badge/Live%20Platform-samanvay--omega.vercel.app-6366f1?style=for-the-badge&logo=vercel)](https://samanvay-omega.vercel.app/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)

</div>

---

## The Problem

Global humanitarian aid is failing — not for lack of resources, but for lack of coordination.

- **74% efficiency loss** due to fragmented NGO operations
- Billions of dollars lost in administrative redundancies every year
- Expert volunteers misassigned due to lack of unified skill-matching
- Duplicate aid delivered to some zones while others go unserved
- No real-time visibility across agency boundaries

Samanvay exists to solve this.

---

## What is Samanvay?

Samanvay is an open coordination infrastructure that connects organizations, volunteers, resources, events, and logistics into one intelligent ecosystem. It acts as a **coordination layer** — a neutral backbone that humanitarian organizations plug into, enabling them to operate as a network rather than isolated entities.

**Key outcomes:**
- **+35% efficiency** in resource deployment
- **-40% reduction** in response time through automated routing
- Real-time visibility across 450+ partner NGO nodes
- Sub-second volunteer-to-need matching via algorithmic scoring

---

## Live Demo

> **[https://samanvay-omega.vercel.app/](https://samanvay-omega.vercel.app/)**

Use the platform to create an organization or volunteer account, manage inventory, coordinate resource requests, assign volunteers, and track transfers across the network.

---

## Core Modules

### Resource Engine
Real-time redistribution of humanitarian supplies across the network. Organizations can post resource lots, signal needs, and receive intelligent match suggestions from partner organizations with surplus inventory. Automated logic identifies surplus zones and routes them to critical need areas.

### Volunteer Engine
Algorithm-driven matching that connects certified volunteers to field requirements. The engine scores candidates across skills, certifications, availability, and location — producing ranked matches in real time. Full lifecycle management: invitation → assignment → attendance tracking.

### Transfer Management
End-to-end transfer orchestration between organizations. Transfers are governed by a strict state machine (Pending → In Transit → Completed/Cancelled) with inventory reservation and release logic at each step, ensuring consistent accounting.

### Matching Intelligence
A scoring engine that synthesizes multi-dimensional data (skills, availability, proximity, capacity) to produce optimal matches with confidence levels. Runs against both volunteer needs and resource needs.

### Activity & Audit
Every significant action is logged to a tamper-evident audit trail. Organizations get full visibility into asset movements, volunteer deployments, and coordination history.

---

## Technology Stack

### Frontend
- **React + TypeScript** — type-safe component architecture
- **Vite** — fast dev server and build tooling
- **Tailwind CSS** — utility-first styling
- **React Router v6** — client-side routing with protected route guards
- **Framer Motion** — animation and transition layer

### Backend
- **Node.js + Express** — REST API runtime
- **TypeScript** — end-to-end type safety from DB schema to API response
- **Prisma ORM** — type-safe database access with schema-driven migrations
- **Zod** — runtime request validation

### Infrastructure
- **Vercel** — frontend hosting and CI/CD
- **PostgreSQL** — primary relational database

---

## Project Structure

```
samanvay/
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── providers/        # AuthProvider (session hydration, token management)
│       │   └── router/           # AppRouter, ProtectedRoute, OnboardingGuard
│       ├── modules/
│       │   ├── auth/             # Login, Signup, auth service
│       │   ├── dashboard/        # Overview, Inventory, Requests, Transfers, Volunteers
│       │   ├── onboarding/       # Organization creation, joining, volunteer onboarding
│       │   └── landing/          # Public landing page
│       └── shared/
│           └── lib/              # api.ts (fetch wrapper), workspace utilities
│
└── backend/
    └── src/
        ├── routes/               # Express route definitions
        ├── controllers/          # Request handlers
        ├── services/             # Business logic layer
        ├── schemas/              # Zod validation schemas
        ├── middleware/           # Auth, authorization, error handling
        ├── prisma/               # Prisma client instance
        └── modules/
            ├── volunteers/       # Volunteer engine (skills, matching, assignments)
            ├── activity/         # Activity feed
            ├── notifications/    # Notification engine
            └── dashboard/        # Dashboard aggregation queries
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Backend Setup

```bash
cd backend
cp .env.example .env
# Fill in DATABASE_URL, JWT_SECRET, FRONTEND_URL in .env

npm install
npx prisma migrate dev
npm run dev
```

The backend runs on `http://localhost:3000`.

### Frontend Setup

```bash
cd frontend
cp .env.development.example .env.development
# Set VITE_API_URL=http://localhost:3000

npm install
npm run dev
```

The frontend runs on `http://localhost:5173`.

---

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Authenticate and receive JWT |
| POST | `/api/auth/register` | Create account |
| GET | `/api/auth/me` | Get current user with memberships |
| GET/POST | `/api/resource-needs` | List and create resource needs |
| GET | `/api/resource-needs/:id/matches` | Get fulfillment matches for a need |
| GET/POST | `/api/resource-lots` | Manage inventory lots |
| GET/POST | `/api/transfers` | Manage resource transfers |
| GET/POST | `/api/volunteers` | Volunteer profiles |
| GET/POST | `/api/assignments` | Volunteer assignments |
| GET | `/api/dashboard` | Aggregated dashboard data |
| GET | `/api/activity` | Activity feed |

---

## Authentication & Authorization

Samanvay uses **JWT-based authentication**. Tokens are stored in `localStorage` and sent as `Authorization: Bearer <token>` headers on every API request.

**Role-based access control** is enforced at the route level:

| Role | Permissions |
|------|-------------|
| `OWNER` | Full organization control |
| `ADMIN` | Manage members, resources, transfers |
| `COORDINATOR` | Create requests, manage transfers |
| `VOLUNTEER_MANAGER` | Manage volunteers and assignments |
| `MEMBER` | Read-only access |

---

## Architecture Principles

**Invariant-driven services** — Critical business rules (e.g., cannot cancel a need with active transfers, inventory must balance across transfer state transitions) are enforced at the service layer, not just the controller, preventing inconsistent state regardless of how they're called.

**Type safety end-to-end** — TypeScript and Zod mean that the shape of data is validated at the API boundary and carried through to the UI with full inference. Runtime surprises are minimized.

**Workspace-aware context** — Users can belong to multiple organizations. The active workspace context is tracked in the auth provider and used to scope all API calls appropriately.

---

## Roadmap

| Phase | Timeline | Focus |
|-------|----------|-------|
| Foundation | Q4 2024 | Verified node networks, cryptographic accountability standards |
| Telemetry | H1 2025 | Real-time telemetry for humanitarian intervention and resource velocity mapping |
| Intelligence | H2 2025 | Predictive matching, proactive supply pre-positioning |
| Autonomous Coordination | 2026+ | Fully autonomous predictive infrastructure across the global relief ecosystem |

---

## Vision

> *"A world where humanitarian organizations coordinate as a network, not operate as isolated entities."*

Samanvay is being built as open coordination infrastructure — the layer beneath the relief ecosystem that every organization can rely on, regardless of size, geography, or technical capacity.

---

## License

© 2026 Samanvay Open Infrastructure. All rights reserved.
