# Vision79 Shipment Inventory & Warehouse Management (SIWM)

Vision79 SIWM is a modern, full-stack web application for managing shipments, inventory, and warehouse operations. It features a React-based frontend, a Node.js backend with a PostgreSQL database, and AI-powered insights via the Gemini API.

---

## 🚀 Feature Overview

- **Role-Based Authentication:** Secure login and permissions for different user roles (Admin, Manager, Warehouse, Broker, Finance, Technician, Requester).
- **Dashboard:** Real-time metrics, AI insights, and system health at a glance.
- **Incoming Shipments (ASNs):** Track, receive, and process shipments with a financial approval workflow.
- **Inventory Management:** Manage stock, serialized/non-serialized items, and aged inventory. Real-time updates and smart intake.
- **Warehouse Orders:** Internal requests, picking, packing, and fulfillment workflows.
- **Dispatch & Logistics:** Outbound shipments, route planning, and delivery tracking with AI-powered optimization.
- **Vendor & Asset Management:** Supplier and equipment tracking with maintenance logs.
- **Reporting & Analytics:** Custom reports, exports, and AI-powered natural language queries.
- **Notifications:** Real-time alerts and user-configurable preferences.
- **VisionBot AI Chatbot:** In-app assistant for help, logistics questions, and workflow guidance.

---

## 🤖 AI-Powered Features

- **VisionBot Chatbot:** Ask logistics, inventory, or app usage questions. Try "How do I receive a shipment?" or "Show me items below reorder point."
- **AI Analytics:** Use the reporting module to enter natural language queries (e.g., "Show inventory by category for last month").
- **Route Optimization:** In Dispatch & Logistics, use AI to suggest optimal shipping routes based on constraints.
- **Inventory Forecasting:** Predict stock needs and reorder points using historical data and trends.
- **Supplier Performance Analysis:** AI-driven supplier evaluation and recommendations.
- **Warehouse Layout Optimization:** Intelligent space utilization and pick path suggestions.

---

## 📋 Best Practices & Tips

- Use filters and search bars to quickly find records in large tables.
- Check notifications regularly for important system or workflow updates.
- Admins should review user permissions after onboarding new users.
- Use the export feature in reports to save data as PDF or CSV for audits.
- For serialized items, scan barcodes where possible to avoid manual entry errors.
- Consult the in-app Help page for step-by-step guides and workflow explanations.

---

## 🛠️ Troubleshooting & FAQ

- **Failed to fetch dynamically imported module?** Reload the page. If the issue persists, clear your browser cache and ensure you are accessing the app via the correct URL (not file://).
- **Missing permissions?** Contact your admin to review your assigned role and page permissions.
- **Can’t see a module in the sidebar?** You may not have permission. Ask your admin to update your access.
- **Receiving errors on shipment or order actions?** Double-check required fields and ensure you have the correct role for the action.
- **How do I reset my password?** Use the "Forgot Password" link on the login page or ask an admin to reset it for you.

---

## 🔒 Security & Compliance

- All data is encrypted in transit (HTTPS/SSL required in production).
- Role-based access ensures users only see and do what they are permitted.
- Audit logs track all critical actions for compliance and troubleshooting.
- Regularly update your password and never share credentials.
- Admins should periodically review user access and audit logs.

---

## 💬 Support & Feedback

- For technical support, contact your system administrator or IT helpdesk.
- For feature requests or bug reports, use the in-app feedback form or email the support team.
- Consult the in-app Help page and tooltips for additional guidance.

---

## 📖 User Guide

For a detailed, step-by-step user guide, see the in-app **Help** page (accessible from the sidebar) or review `src/pages/HelpPage.tsx` for the latest documentation on workflows, permissions, and best practices.

---

## Tech Stack

- **Frontend:** React, TypeScript, [Vite](https://vite.dev/guide/), Tailwind CSS, Recharts
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL with `node-pg-migrate` for schema management.
- **AI:** Google Gemini API

---


## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose
- A Google Gemini API key (optional, only needed for AI features)

---

## Deployment (Docker)

This app runs as two containers behind a single published port:

- **frontend** — nginx serving the built React app, published on host port **3050**. It also proxies any `/api/` request to the backend container internally, so the browser only ever talks to port 3050.
- **backend** — the Express API, not published to the host; only reachable from `frontend` over the internal Docker network.
- **postgres** / **redis** — internal only, no host ports published.

### 1. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and set `DB_PASSWORD`, `JWT_SECRET` (generate one with `node generate-secrets.cjs`), and optionally `GEMINI_API_KEY` / email settings.

### 2. Build and start

```bash
docker compose up -d --build
```

### 3. Access the app

Visit `http://<your-server>:3050`. If you're running this behind Nginx Proxy Manager, point the proxy host's "Forward Port" at **3050** (or whichever host port you chose in `docker-compose.yml`).

Users can be created via the "Register" link on the login page.

### Changing the port

To use a different host port than 3050, edit the `frontend.ports` line in `docker-compose.yml`:

```yaml
ports:
  - "YOUR_PORT:80"
```

The container always listens on 80 internally — only the left-hand side (host port) needs to change.

### Database migrations

Run once after the first `docker compose up`:

```bash
docker compose exec backend npm run migrate:up
```

---

## Local development (without Docker)

For active development, you can still run the frontend and backend directly with Node.js (v20+) and a local/accessible PostgreSQL instance:

```bash
npm install
cd backend && npm install && cd ..
cp backend/.env.example backend/.env   # fill in DB/JWT values
npm run dev   # runs frontend (Vite, :5176) and backend (:3000) concurrently
```
