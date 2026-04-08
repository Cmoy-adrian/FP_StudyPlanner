# Study Planner REST API

A modular backend API designed to help students manage **courses, assignments, and study sessions** with secure authentication, role-based authorization (RBAC), and structured service-layer architecture.

Built using **Node.js, Express, Sequelize, and SQLite**, this project demonstrates production-style backend engineering practices including middleware pipelines, JWT authentication, centralized error handling, and integration testing.

---

## Interactive API Documentation (Postman)

https://documenter.getpostman.com/view/52069381/2sBXiokUjh#a3bde9ab-de98-4d51-8843-f484ad94a963

---

# Features

- JWT authentication
- Role-based authorization (Admin / User)
- Secure password hashing with bcrypt
- RESTful resource architecture
- Sequelize ORM relational modeling
- Structured middleware pipeline
- Centralized error handling
- Request logging middleware
- Service-layer architecture
- SQLite database test isolation
- Jest + Supertest integration tests
- Environment-based configuration via dotenv

---

# Architecture Overview

The API follows a layered backend architecture:

Routes  
↓  
Middleware (auth, RBAC, logging, error handling)  
↓  
Services Layer  
↓  
Sequelize Models  
↓  
SQLite Database

---

# Tech Stack

Backend

- Node.js
- Express.js

Database

- SQLite
- Sequelize ORM

Authentication

- JSON Web Tokens (JWT)
- bcrypt password hashing

Testing

- Jest
- Supertest

Utilities

- dotenv

---

# Authentication & Authorization

Authentication uses JWT tokens.

Users can register and login:

POST /auth/register  
POST /auth/login

Protected routes require:

Authorization: Bearer <token>

---

## Role-Based Access Control (RBAC)

Each user has a role:

user (default)  
admin (elevated privileges)

RBAC middleware restricts access to:

/admin/*

Only admins may access admin endpoints.

---

# Database Structure

Relationships:

User  
└── has many Courses  

Course  
└── has many Assignments  

Assignment  
└── belongs to Course  
└── has many StudySessions  

StudySession  
└── belongs to Assignment  

Foreign-key constraints enforce relational integrity automatically.

---

# API Routes Overview

## Auth Routes

POST /auth/register  
POST /auth/login
GET /auth/me

---

## Course Routes

GET /courses
GET /courses/:id
POST /courses
PUT /courses/:id  
DELETE /courses/:id  

Authentication required

---

## Assignment Routes

GET /assignments  
GET /assignments/:id  
POST /assignments 
PUT /assignments/:id  
DELETE /assignments/:id  

Requires valid course relationship

---

## Study Session Routes

GET /study-sessions  
GET /study-sessions/:id  
POST /study-sessions  
PUT /study-sessions/:id  
DELETE /study-sessions/:id  

Tracks structured study time per assignment

---

## Admin Routes

Accessible only by admin users

GET /admin/users
PATCH /admin/users/:id/role
DELETE /admin/users/:id

Protected using RBAC middleware

---

# Middleware Layer

Custom middleware improves modularity and security

auth.js

Verifies JWT tokens and attaches authenticated user to requests

role.js

Restricts access based on role permissions

logger.js

Logs incoming requests for debugging and monitoring

errorHandler.js

Centralized error handling middleware ensures consistent API responses

---

# Services Layer

Business logic is separated from route handlers inside the services directory

Benefits:

- improved readability
- easier maintenance
- better scalability
- cleaner testing architecture

---

# Project Structure

```
FP_StudyPlanner
│
├── database/
│ ├── db.js
│ ├── seed.js
│ └── setup.js
│
├── middleware/
│ ├── auth.js
│ ├── role.js
│ ├── logger.js
│ └── errorHandler.js
│
├── models/
│ ├── User.js
│ ├── Course.js
│ ├── Assignment.js
│ └── StudySession.js
│
├── routes/
│ ├── authRoutes.js
│ ├── adminRoutes.js
│ ├── courseRoutes.js
│ ├── assignmentRoutes.js
│ └── studySessionRoutes.js
│
├── services/
│ └── recService.js
│
├── tests/
│ ├── admin.test.js
│ ├── assignment.test.js
│ ├── auth.test.js
│ ├── course.test.js
│ ├── studySession.test.js
│ └── user.test.js
│
├── server.js
└── README.md
```

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd FP_StudyPlanner
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a `.env` file

Create a `.env` file in the project root directory:

```
PORT=3000
DB_NAME=planner.db
NODE_ENV=development
```

### 4. Run the application locally

```bash
npm start
```

Server runs at:

```
http://localhost:3000
```

---

## Running Tests

Run integration tests using:

```bash
npm test
```

Tests automatically connect to a separate database:

```
database/test.sqlite
```

This prevents tests from modifying development data.

---

# Testing Strategy

Integration tests verify:

- successful resource creation
- validation failures
- authentication enforcement
- role-based authorization
- foreign-key constraints
- error handling
- database isolation

Tests run using:
NODE_ENV=test

---

# Security Practices

Passwords hashed using:

bcrypt

Authentication handled using:

JWT tokens

Admin endpoints protected with:

role middleware

Environment variables stored in:

.env

Test database isolated from development database automatically

---

# Roadmap

Planned enhancements

- Study recommendation engine (in progress)
- Deployment (Render or Railway)
- PostgreSQL production database migration
- Rate limiting middleware
- API caching layer
- Frontend integration

---

# Author

Caden Moyer

Study Planner REST API Final Project