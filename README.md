# 🏥 Healthcare ERP System

## Full-Stack Hospital Management Platform

A comprehensive **Healthcare Enterprise Resource Planning (ERP) System** designed to digitize and streamline hospital operations through a secure, scalable, and modular architecture. The platform integrates patient management, medical records, appointments, billing, pharmacy, laboratory, inventory, ward management, and reporting into a unified healthcare ecosystem.

Built with **Spring Boot, Next.js 14, PostgreSQL, and modern enterprise development practices**, this system provides role-based access, automated workflows, real-time operational visibility, and efficient healthcare data management.

---

# 🚀 Key Features

## 🔐 Secure Authentication & Authorization

* JWT-based authentication system

* Role-Based Access Control (RBAC)

* Supports 12+ user roles:

  * Administrator
  * Doctor
  * Nurse
  * Receptionist
  * Pharmacist
  * Laboratory Staff
  * Accountant
  * Inventory Manager
  * HR Staff
  * Patient
  * Management
  * Other healthcare roles

* Secure password handling

* Protected API endpoints

* Permission-based module access

---

# 🏗️ System Architecture

The application follows a **Full-Stack Monolithic Enterprise Architecture** with clear domain separation.

```
Healthcare ERP System

Frontend
    |
    | REST API Communication
    |
Backend
    |
    |
PostgreSQL Database
```

### Backend Architecture

Built using layered enterprise architecture:

```
Controller Layer
        |
Service Layer
        |
Repository Layer
        |
Database Layer
```

Key backend principles:

* Modular domain-driven structure
* Separation of concerns
* Reusable common components
* Centralized exception handling
* DTO-based data transfer
* Entity relationship management
* Database migration management

---

# 🛠️ Technology Stack

## Backend

| Technology      | Purpose                   |
| --------------- | ------------------------- |
| Java            | Core programming language |
| Spring Boot     | Backend framework         |
| Spring Security | Application security      |
| JWT             | Authentication            |
| Spring Data JPA | Database interaction      |
| Hibernate ORM   | Object relational mapping |
| PostgreSQL      | Primary database          |
| Flyway          | Database migration        |
| Swagger/OpenAPI | API documentation         |
| Maven           | Dependency management     |

---

## Frontend

| Technology     | Purpose                 |
| -------------- | ----------------------- |
| Next.js 14     | React framework         |
| TypeScript     | Type-safe development   |
| Tailwind CSS   | UI styling              |
| TanStack Query | Server state management |
| Zod            | Schema validation       |
| NextAuth       | Authentication handling |
| Shadcn UI      | Reusable UI components  |

---

# 📦 Core Modules

## 1. Patient Management

Features:

* Patient registration
* Patient profile management
* Contact information
* Insurance details
* Emergency contacts
* Patient search and filtering

## 2. Appointment Management

Features:

* Doctor scheduling
* Appointment booking
* Calendar management
* Time slot management
* Appointment status tracking

## 3. Staff Management

Features:

* Doctor management
* Employee records
* Department management
* Medical specialization tracking

## 4. Electronic Medical Records (EMR)

Features:

* Patient medical history
* Diagnosis management
* Prescription management
* Vital records
* Allergy tracking

## 5. Billing & Payments

Features:

* Invoice generation
* Payment processing
* Insurance claim management
* Payment reconciliation

## 6. Pharmacy Management

Features:

* Medicine inventory
* Stock monitoring
* Drug dispensing
* FEFO (First Expire First Out) stock handling
* Medicine tracking

## 7. Laboratory Management

Features:

* Lab test management
* Lab orders
* Result recording
* Medical report handling

## 8. Ward & Admission Management

Features:

* Ward management
* Bed allocation
* Admission tracking
* Real-time bed availability

## 9. Inventory Management

Features:

* Medical supply tracking
* Supplier management
* Purchase orders
* Stock movement history

## 10. Reporting & Analytics

Features:

* Hospital statistics dashboard
* Operational reports
* Financial reports
* Custom report generation

---

# 🔥 Technical Highlights

## Backend

✅ RESTful API architecture
✅ JWT authentication
✅ Role-based security model
✅ Global exception handling
✅ DTO mapping layer
✅ Database optimization
✅ Flyway version-controlled migrations
✅ Entity relationship management
✅ API documentation with Swagger

## Frontend

✅ Responsive enterprise dashboard
✅ Server-side rendering with Next.js
✅ Component-driven architecture
✅ Reusable UI components
✅ Client-side caching using TanStack Query
✅ Form validation using Zod
✅ Protected routes with middleware

---

# 🗄️ Database Design

Database:

```
PostgreSQL
```

Migration management:

```
Flyway
```

Database modules:

```
V1  Patient Tables
V2  Appointment Tables
V3  Staff Tables
V4  EMR Tables
V5  Billing Tables
V6  Pharmacy Tables
V7  Laboratory Tables
V8  Ward Tables
V9  Inventory Tables
V10 Reporting Tables
```

---

# 🔄 Automated Business Workflows

The system includes automated healthcare workflows:

### Bed Availability Tracking

* Updates bed status automatically
* Prevents duplicate allocation
* Provides real-time availability

### Pharmacy Stock Management

* FEFO inventory deduction
* Stock validation
* Medicine availability tracking

### Billing Workflow

* Automatic invoice calculation
* Payment tracking
* Outstanding balance reconciliation

---

# 📁 Project Structure

## Backend

```
backend/
 ├── config/
 ├── security/
 ├── common/
 ├── patient/
 ├── appointment/
 ├── staff/
 ├── emr/
 ├── billing/
 ├── pharmacy/
 ├── laboratory/
 ├── ward/
 ├── inventory/
 └── reports/
```

## Frontend

```
frontend/
 ├── app/
 ├── components/
 ├── hooks/
 ├── store/
 ├── lib/
 ├── types/
 ├── schemas/
 └── middleware.ts
```

---

# ⚙️ Installation & Setup

## Backend Setup

Clone repository:

```bash
git clone <repository-url>
```

Navigate:

```bash
cd backend
```

Configure database:

`application.yaml`

Example:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/healthcare_erp
    username: postgres
    password=password
```

Run migrations:

```bash
mvn clean install
```

Start backend:

```bash
mvn spring-boot:run
```

---

## Frontend Setup

Navigate:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create environment file:

```
.env.local
```

Run application:

```bash
npm run dev
```

Application:

```
http://localhost:3000
```

---

# 🔌 API Documentation

Swagger documentation available at:

```
http://localhost:8080/swagger-ui/index.html
```

---

# 🧪 Testing

Backend testing:

```
JUnit 5
Mockito
Spring Boot Test
```

Implemented tests:

* Patient Service Tests
* Appointment Service Tests
* Staff Service Tests
* EMR Service Tests
* Billing Service Tests
* Pharmacy Service Tests
* Laboratory Service Tests
* Ward Service Tests
* Inventory Service Tests
* Reporting Service Tests

---

# 🔒 Security Features

* JWT token authentication
* Role-based authorization
* Secure API endpoints
* Input validation
* Exception handling
* Protected frontend routes

---

# 📈 Future Improvements

* Microservices migration
* Cloud deployment using Azure/AWS
* AI-assisted diagnosis recommendations
* Mobile application support
* Real-time notifications
* Telemedicine integration
* Advanced analytics dashboard

---

# 👨‍💻 Development Practices

* Clean Architecture principles
* Git-based version control
* Feature-based module organization
* REST API standards
* Secure coding practices
* Scalable enterprise design

---




