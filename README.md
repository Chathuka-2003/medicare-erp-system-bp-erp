# Healthcare ERP System

A comprehensive, full-stack Hospital Enterprise Resource Planning (ERP) system built to digitize and streamline the complete patient care lifecycle — from registration and appointments through billing, pharmacy, laboratory, ward management, and inventory control.

![Java](https://img.shields.io/badge/Java-25-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.1.0-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)
![License](https://img.shields.io/badge/license-Academic-lightgrey)

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Modules](#modules)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [API Overview](#api-overview)
- [Authentication & Roles](#authentication--roles)
- [Deployment](#deployment)
- [CI/CD Pipeline](#cicd-pipeline)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [Team & Contributions](#team--contributions)
- [License](#license)

---

## Overview

The **Healthcare ERP System** is a monolithic, module-based hospital management platform designed to replace fragmented, paper-based, or siloed hospital administration processes with a single, unified digital system. It covers ten interconnected functional domains — Patient Management, Appointments, Staff, Electronic Medical Records (EMR), Billing, Pharmacy, Laboratory, Ward Management, Inventory, and Reporting — all built on a shared, secured, role-based backend and a modern, responsive frontend.

The system was built with a real-world hospital workflow in mind: a patient is registered, scheduled for an appointment with a doctor, examined and diagnosed (EMR), prescribed medication (Pharmacy), sent for lab tests (Laboratory), billed for services (Billing), and — where necessary — admitted to a ward (Ward Management), all while hospital inventory and staffing are tracked in the background (Inventory, Staff).

---

## Key Features

- **Ten fully integrated hospital modules** sharing a single patient and staff identity across the system
- **Role-based access control** for 12 distinct hospital staff roles (Super Admin, Hospital Admin, Doctor, Nurse, Pharmacist, Lab Technician, Receptionist, Cashier, Inventory Manager, HR Manager, Accountant, Patient)
- **JWT-based stateless authentication** with Spring Security
- **Automated business logic**, including:
  - Real-time bed availability synchronization across admissions and discharges
  - FEFO (First-Expiry-First-Out) pharmacy stock deduction on drug dispensing
  - Automatic invoice balance tracking on payment recording
  - Automatic purchase order stock updates on goods receipt
- **RESTful API** with consistent, predictable response contracts (`ApiResponse<T>`, `PageResponse<T>`)
- **Type-safe frontend** built with Next.js 14, TypeScript, React Hook Form, and Zod validation
- **Server-state management** via TanStack Query for automatic caching, refetching, and invalidation
- **Responsive, accessible UI** built on shadcn/ui and Tailwind CSS
- **Database schema versioning** for reliable, repeatable deployments
- **CI/CD pipeline** via GitHub Actions, deploying to Azure App Service on every push

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Browser)                      │
└───────────────────────────┬───────────────────────────────────┘
                             │ HTTPS
┌───────────────────────────▼───────────────────────────────────┐
│                Frontend — Next.js 14 (App Router)             │
│   NextAuth (JWT Session) · TanStack Query · React Hook Form   │
│              shadcn/ui · Tailwind CSS · Zod                   │
└───────────────────────────┬───────────────────────────────────┘
                             │ REST (Bearer JWT)
┌───────────────────────────▼───────────────────────────────────┐
│               Backend — Spring Boot 4 (Java 25)                │
│  Spring Security + JWT · Spring Data JPA · Bean Validation     │
│         10 Modular Domains · Layered Architecture              │
│    (Controller → Service → Repository → Entity)                │
└───────────────────────────┬───────────────────────────────────┘
                             │ JDBC
┌───────────────────────────▼───────────────────────────────────┐
│                    MySQL 8.0 Database                          │
│              (Azure Database for MySQL — Flexible Server)      │
└─────────────────────────────────────────────────────────────┘
```

Both the frontend and backend are deployed independently as **Azure App Service** instances, with the database hosted on **Azure Database for MySQL (Flexible Server)**. Deployments are automated via **GitHub Actions**, triggered on every push to the main development branch.

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Java 25 | Core language |
| Spring Boot 4.1.0 | Application framework |
| Spring Data JPA / Hibernate | ORM and persistence |
| Spring Security | Authentication & authorization |
| JJWT (io.jsonwebtoken) | JWT generation and validation |
| MySQL Connector/J | Database driver |
| Lombok | Boilerplate reduction |
| Maven | Build and dependency management |

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 14 (App Router) | React framework, SSR/routing |
| TypeScript | Type safety |
| NextAuth.js | Authentication/session management |
| TanStack Query (React Query) | Server-state management |
| React Hook Form + Zod | Form state and schema validation |
| shadcn/ui + Tailwind CSS | Component library and styling |
| Axios | HTTP client |
| Recharts | Data visualization |
| Zustand | Lightweight client state |

### Infrastructure
| Technology | Purpose |
|---|---|
| Azure App Service | Hosting (frontend & backend) |
| Azure Database for MySQL | Managed relational database |
| GitHub Actions | CI/CD pipeline |

---

## Modules

| # | Module | Description |
|---|--------|-------------|
| 1 | **Patient Management** | Patient registration, demographic and contact records, insurance details, next-of-kin, search |
| 2 | **Appointments** | Doctor-patient appointment scheduling, status tracking (Scheduled, Confirmed, Completed, Cancelled, etc.) |
| 3 | **Staff Management** | Doctor and staff records, departments, specializations, role assignment |
| 4 | **EMR (Electronic Medical Records)** | Medical visit records, vitals, diagnoses, prescriptions, allergies |
| 5 | **Billing** | Invoicing, itemized billing, payment recording with automatic balance tracking, insurance claims |
| 6 | **Pharmacy** | Medicine catalog, batch-tracked stock, drug dispensing with automatic FEFO deduction |
| 7 | **Laboratory** | Lab test catalog, test ordering, result recording and verification |
| 8 | **Ward Management** | Ward and bed inventory, patient admission/discharge with real-time bed availability sync |
| 9 | **Inventory** | Hospital supply items, suppliers, purchase orders with automated stock receipt |
| 10 | **Reports & Dashboard** | Cross-module operational dashboard, saved report generation |

---

## Project Structure

```
healthcare-erp-system/
├── backend/
│   └── src/main/java/com/healthcare/backend/
│       ├── common/              # Shared base classes, DTOs, exceptions, enums
│       ├── security/            # JWT, Spring Security config, Auth controller
│       ├── patient/             # Patient module
│       ├── appointment/         # Appointment module
│       ├── staff/               # Staff/Doctor module
│       ├── emr/                 # Electronic Medical Records module
│       ├── billing/             # Billing/Invoicing module
│       ├── pharmacy/            # Pharmacy module
│       ├── laboratory/          # Laboratory module
│       ├── ward/                # Ward Management module
│       ├── inventory/           # Inventory module
│       └── reports/             # Reports & Dashboard module
│
└── frontend/
    └── src/
        ├── app/                 # Next.js App Router pages
        │   ├── (auth)/          # Login, register, forgot-password
        │   └── (dashboard)/     # All protected module pages
        ├── components/          # Reusable UI components, per module
        ├── hooks/               # TanStack Query hooks, per module
        ├── lib/
        │   ├── api/             # Axios API service layer, per module
        │   ├── auth/            # NextAuth config, session helpers
        │   ├── constants/       # Routes, roles
        │   └── utils/           # Formatting, status-color helpers
        ├── schemas/             # Zod validation schemas, per module
        ├── types/               # TypeScript types, per module
        └── middleware.ts        # Route protection
```

Each backend module follows a consistent layered structure: `controller/ → service/ → repository/ → entity/ → dto/ → mapper/ → enums/`.

---

## Getting Started

### Prerequisites

- **Java 25** (JDK)
- **Node.js 20+** and npm
- **MySQL 8.0** (local instance, or Azure Database for MySQL)
- **Maven** (or use the included wrapper `mvnw`)
- Git

### Clone the Repository

```bash
git clone https://github.com/<your-username>/healthcare-erp-system.git
cd healthcare-erp-system
```

---

## Environment Configuration

### Backend — `backend/src/main/resources/application.yaml`

```yaml
spring:
  application:
    name: backend
  datasource:
    url: jdbc:mysql://localhost:3306/healthcare_erp
    username: root
    password: your_local_password
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true

jwt:
  secret: ${JWT_SECRET:a-32-character-minimum-secret-key}
  expiration: 86400000
```

> For production/cloud deployment, override `spring.datasource.*` and `jwt.secret` via environment variables rather than committing real credentials.

### Frontend — `frontend/.env.local`

```
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=a-32-character-minimum-random-secret
```

---

## Running the Application

### 1. Create the database

```sql
CREATE DATABASE healthcare_erp;
```

### 2. Run the backend

```bash
cd backend
./mvnw spring-boot:run
```

The backend starts on **`http://localhost:8080`**. On first run, a `DataSeeder` automatically creates a default administrator account:

```
Email:    admin@healthcare.local
Password: Admin@123
```

> Change this password immediately after first login in a real deployment.

### 3. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend starts on **`http://localhost:3000`**.

### 4. Log in

Navigate to `http://localhost:3000/login` and sign in with the seeded admin credentials above.

---

## API Overview

All endpoints are prefixed with `/api/v1`. Responses follow a consistent envelope:

```json
{
  "success": true,
  "message": "Patient retrieved successfully",
  "data": { "...": "..." },
  "timestamp": "2026-07-12T10:00:00"
}
```

Paginated endpoints return:

```json
{
  "content": [ "..." ],
  "pageNumber": 0,
  "pageSize": 10,
  "totalElements": 42,
  "totalPages": 5,
  "first": true,
  "last": false
}
```

### Sample Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/auth/login` | Authenticate and receive a JWT |
| `GET` | `/api/v1/patients` | Paginated list of patients |
| `POST` | `/api/v1/patients` | Create a new patient |
| `GET` | `/api/v1/appointments` | Paginated list of appointments |
| `POST` | `/api/v1/medical-records` | Create a medical record |
| `POST` | `/api/v1/invoices` | Create an invoice |
| `POST` | `/api/v1/payments` | Record a payment against an invoice |
| `POST` | `/api/v1/drug-dispenses` | Dispense medication (auto-deducts stock) |
| `PATCH` | `/api/v1/admissions/{id}/discharge` | Discharge a patient (auto-frees bed) |
| `PATCH` | `/api/v1/purchase-orders/{id}/receive` | Receive a purchase order (auto-updates stock) |
| `GET` | `/api/v1/dashboard` | Aggregated cross-module statistics |

---

## Authentication & Roles

Authentication is handled via **JWT (JSON Web Tokens)**. On login, the backend issues a signed token containing the staff member's ID, email, and role, which the frontend attaches as a `Bearer` token on every subsequent request via an Axios interceptor.

### Supported Roles

`SUPER_ADMIN` · `HOSPITAL_ADMIN` · `DOCTOR` · `NURSE` · `PHARMACIST` · `LAB_TECHNICIAN` · `RECEPTIONIST` · `CASHIER` · `INVENTORY_MANAGER` · `HR_MANAGER` · `ACCOUNTANT` · `PATIENT`

Staff accounts are created by an administrator via the Staff module — there is no public self-registration, consistent with real-world hospital access control policy.

---

## Deployment

The system is designed for deployment on **Microsoft Azure**:

| Component | Azure Service |
|---|---|
| Backend | Azure App Service (Java SE runtime) |
| Frontend | Azure App Service (Node.js runtime) |
| Database | Azure Database for MySQL – Flexible Server |

### Frontend build requirement

`next.config.ts` must include the standalone output mode for App Service compatibility:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
};

export default nextConfig;
```

### Required Azure App Service environment variables

**Backend:**
```
SPRING_DATASOURCE_URL=jdbc:mysql://<server>.mysql.database.azure.com:3306/healthcare_erp?useSSL=true&requireSSL=false
SPRING_DATASOURCE_USERNAME=<admin-username>
SPRING_DATASOURCE_PASSWORD=<admin-password>
JWT_SECRET=<production-secret>
```

**Frontend:**
```
NEXT_PUBLIC_API_URL=https://<backend-app-name>.azurewebsites.net/api/v1
NEXTAUTH_URL=https://<frontend-app-name>.azurewebsites.net
NEXTAUTH_SECRET=<production-secret>
```

---

## CI/CD Pipeline

Deployment is automated using **GitHub Actions**. Two workflows independently build and deploy the backend and frontend whenever changes are pushed to their respective directories:

- `.github/workflows/backend-deploy.yml` — builds the Spring Boot JAR with Maven and deploys to Azure App Service
- `.github/workflows/frontend-deploy.yml` — builds the Next.js application and deploys to Azure App Service

Both use Azure App Service **publish profiles**, stored securely as GitHub repository secrets (`AZURE_BACKEND_PUBLISH_PROFILE`, `AZURE_FRONTEND_PUBLISH_PROFILE`).

---

## Database Schema

The system defines 10 relational domains sharing common keys (`Patient`, `Doctor`, `Staff`) across module boundaries. All primary keys use **UUID** identifiers. Key cross-module relationships:

- `Appointment` → `Patient`, `Doctor`
- `MedicalRecord` → `Patient`, `Doctor`; owns `Vitals`, `Diagnosis`, `Prescription`
- `Invoice` → `Patient`, `Appointment`; owns `InvoiceItem`, `Payment`
- `DrugDispense` → `Patient`, `Prescription`, `Staff` (pharmacist); owns `DrugDispenseItem`
- `LabOrder` → `Patient`, `Doctor`; owns `LabOrderItem` → `LabResult`
- `Admission` → `Patient`, `Doctor`, `Bed` → `Ward`
- `PurchaseOrder` → `Supplier`; owns `PurchaseOrderItem` → `Item`

---

## Contributing

1. Create a feature branch from the base development branch
2. Follow the existing layered architecture (`controller → service → repository → entity`) when adding backend functionality
3. Follow the existing module structure (`types → schema → api → hooks → components → pages`) when adding frontend functionality
4. Ensure `mvn clean package` (backend) and `npx tsc --noEmit` (frontend) pass before opening a pull request
5. Open a pull request against the appropriate base branch for review

---

## Team & Contributions

| Module | Responsibility |
|--------|-----------------|
| Architecture, Security & Integration | Authentication, role-based access control, deployment pipeline, cross-module integration |
| Patient Management | Patient records, search, and demographics |
| Appointments | Scheduling and appointment lifecycle |
| Staff Management | Doctors, staff, departments, specializations |
| EMR | Medical records, vitals, diagnoses, prescriptions |
| Billing | Invoicing, payments, insurance claims |
| Pharmacy | Medicine catalog, stock, dispensing |
| Laboratory | Lab tests, orders, results |
| Ward Management | Wards, beds, admissions |
| Inventory | Items, suppliers, purchase orders |
| Reports & Dashboard | Cross-module analytics and reporting |

---

## License

This project was developed for academic purposes as part of a university coursework submission. All rights reserved by the contributing team members.
