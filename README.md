# Real Estate Agent CRM — Vue 3 Frontend

A modern single-page application for a real estate agent CRM platform. Built with Vue 3, Pinia, and Tailwind CSS v4. Consumes the Laravel 11 REST API backend.

> **Portfolio project** — full SaaS frontend with Stripe billing, drag-and-drop Kanban, recurring task management, and real-time dashboard analytics.

---

## Live Demo

**Backend API:** [github.com/arafin06/real-estate-crm](https://github.com/arafin06/real-estate-crm)

| Role | Email | Password |
|---|---|---|
| Super Admin | admin@recrm.demo | Demo1234! |
| Agent (Pro Plan) | sarah@recrm.demo | Demo1234! |
| Agent (Free Plan) | marcus@recrm.demo | Demo1234! |
| Client | client@recrm.demo | Demo1234! |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Vue 3 (Composition API) |
| Build Tool | Vite |
| State Management | Pinia |
| Routing | Vue Router 4 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite` plugin) |
| HTTP Client | Axios (with interceptors) |
| Charts | Chart.js |
| Drag and Drop | Native HTML5 DnD API |

---

## Features

### Layout & Navigation
- Dark slate sidebar with SVG icons and active state indicators
- Sticky top bar with dynamic page title and subtitle per route
- Overdue task count badge on sidebar Tasks link
- Subscription plan badge (Free / Pro) in top bar
- All detail → create/edit flows pass `?back=` query param for correct return navigation

### Dashboard
- Six summary stat cards: active listings, open deals, pipeline value, commission YTD, conversion rate, overdue tasks
- Dual-axis bar chart (deals closed + commission) — last 6 months, gradient fills
- Pipeline stage breakdown with proportional progress bars
- Tasks due today widget with overdue banner
- Scrollable recent activity feed with time-ago labels
- Top clients table ranked by deal volume
- Quick-create buttons for property, client, deal, task

### Property Management
- Card grid with `aspect-[4/3]` images, listing type and status badges on photo
- Filters: search, type, listing type, status, city
- Create form with Nominatim address autocomplete (OpenStreetMap, no API key required)
- Drag-to-upload image area with preview and remove-before-submit
- Detail page with image gallery — set primary, add, delete images

### Client Management
- Detail page with hero gradient bar, avatar, clickable email/phone
- Stats bar: deals, pipeline value, open tasks, notes count, pre-approval amount
- Left sidebar: contact details, buyer profile (budget, pre-approval, timeline), lead info
- Tabbed right panel: Overview / Deals / Tasks / Notes
- Notes slide-over panel (30vw, reusable component)
- Task quick-create modal with full recurring task support

### Deal Pipeline
- List view with stage filter and search
- **Kanban board** — native HTML5 drag and drop, 7 columns, optimistic UI with revert on failure
- Detail page with 7-stage visual progress bar and inline stage update dropdown
- Financial summary bar: deal value, commission, expected close, actual close
- Linked client and property cards, activity timeline, notes slide-over

### Task Management
- Grouped list: Overdue / Today / Tomorrow / This Week / Later / Complete / Closed
- Collapsible color-coded sections
- Status cycle button: Incomplete → In Progress → Complete → Closed
- **View slide-over** with inline quick-edit, recurring occurrence timeline, notes, subtask progress
- **Task create modal** with recurring options (frequency, interval, day picker, end date, live preview)

### Subscription Billing
- Settings page: Profile / Security / Subscription tabs
- Free plan shows listing usage with progress bar
- Upgrade → Stripe Checkout hosted page
- **Global 402 interceptor** — upgrade modal appears anywhere in the app when listing limit is hit
- Stripe Customer Portal for subscription management

---

## Project Structure

```
src/
├── components/
│   ├── NoteSlideOver.vue     # Reusable notes panel (clients, deals)
│   ├── TaskModal.vue         # Task view/edit slide-over
│   ├── TaskCreateModal.vue   # Quick task creation with recurring support
│   └── UpgradeModal.vue      # Subscription upgrade prompt
├── layouts/
│   └── AppLayout.vue         # Sidebar + top bar shell
├── lib/
│   └── axios.js              # Configured instance + interceptors
├── router/
│   └── index.js              # Routes with auth guards
├── stores/
│   ├── auth.js
│   ├── property.js
│   ├── client.js
│   ├── deal.js
│   ├── task.js
│   └── subscription.js
└── views/
    ├── auth/
    ├── clients/
    ├── deals/
    ├── properties/
    ├── tasks/
    ├── settings/
    └── DashboardView.vue
```

---

## Local Setup

### Requirements
- Node.js 18+
- Backend API running at `http://localhost:8000`

### Installation

```bash
git clone https://github.com/arafin06/real-estate-crm-frontend.git
cd real-estate-crm-frontend

npm install
```

Create `.env`:
```env
VITE_API_URL=http://localhost:8000/api
```

```bash
npm run dev
```

App runs at `http://localhost:5173`

---

## Key Design Decisions

**Tailwind v4** — uses `@tailwindcss/vite` plugin. No `tailwind.config.js`. Scoped `@apply` requires `@reference 'tailwindcss';`.

**Native HTML5 Drag and Drop** — no external library. Optimistic UI reverts on API failure.

**Nominatim autocomplete** — OpenStreetMap geocoding, no API key or billing required.

**Global 402 handling** — Axios interceptor dispatches a `CustomEvent`; `App.vue` shows the upgrade modal without any per-page handling.

**Recurring task occurrences** — completing a recurring task logs the occurrence and advances the due date. The task stays in place with a growing timeline.

---

## Author

**Niaz Md. Arafin Haque**
Director of Operations — Global Softel Inc.
5+ years in U.S. real estate and commercial lending operations

[github.com/arafin06](https://github.com/arafin06)
