# Study Planner REST API

**Interactive API Documentation (Postman):**  
https://documenter.getpostman.com/view/52069381/2sBXiokUjh#a3bde9ab-de98-4d51-8843-f484ad94a963

## Project Overview

The Study Planner REST API is a backend service designed to help students organize courses, assignments, and study sessions efficiently. It allows users to create structured study plans, track coursework, and log study time through a RESTful interface.

This API supports CRUD operations for:

- Courses
- Assignments
- Study Sessions

Technologies used:

- Node.js
- Express.js
- Sequelize ORM
- SQLite
- Jest
- Supertest
- dotenv


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


## Database Structure

Relationships:

```
Course
 └── has many Assignments

Assignment
 └── belongs to Course
 └── has many StudySessions

StudySession
 └── belongs to Assignment
```


## API Endpoint Documentation


# Courses

## Create Course

**POST /courses**

Required parameters:

```json
{
  "name": "Calculus II"
}
```

Success response:

Status: **201 Created**

```json
{
  "id": 1,
  "name": "Calculus II"
}
```


## Get Course by ID

**GET /courses/:id**

Example:

```
/courses/1
```

Success response:

Status: **200 OK**

```json
{
  "id": 1,
  "name": "Calculus II"
}
```

Error response:

Status: **404 Not Found**

```json
{
  "error": "Course not found"
}
```


## Update Course

**PUT /courses/:id**

Example request:

```json
{
  "name": "Advanced Calculus II"
}
```

Success response:

Status: **200 OK**

```json
{
  "id": 1,
  "name": "Advanced Calculus II"
}
```


## Delete Course

**DELETE /courses/:id**

Success response:

Status: **200 OK**



# Assignments

## Create Assignment

**POST /assignments**

Required parameters:

```json
{
  "title": "Homework 3",
  "courseId": 1
}
```

Success response:

Status: **201 Created**

```json
{
  "id": 1,
  "title": "Homework 3",
  "courseId": 1
}
```

Error response:

Status: **400 Bad Request**

```json
{
  "error": "Invalid courseId"
}
```


## Get Assignment by ID

**GET /assignments/:id**

Success response:

Status: **200 OK**

```json
{
  "id": 1,
  "title": "Homework 3",
  "courseId": 1
}
```


## Update Assignment

**PUT /assignments/:id**

Example request:

```json
{
  "title": "Homework 3 Updated"
}
```

Success response:

Status: **200 OK**

```json
{
  "id": 1,
  "title": "Homework 3 Updated",
  "courseId": 1
}
```


## Delete Assignment

**DELETE /assignments/:id**

Success response:

Status: **200 OK**



# Study Sessions

## Create Study Session

**POST /study-sessions**

Required parameters:

```json
{
  "assignmentId": 1,
  "startTime": "2026-04-01T10:00:00Z",
  "endTime": "2026-04-01T11:00:00Z",
  "durationMinutes": 60
}
```

Success response:

Status: **201 Created**

```json
{
  "id": 1,
  "assignmentId": 1,
  "startTime": "2026-04-01T10:00:00Z",
  "endTime": "2026-04-01T11:00:00Z",
  "durationMinutes": 60
}
```

Error response:

Status: **400 Bad Request**

```json
{
  "error": "assignmentId, startTime, and endTime are required"
}
```


## Get Study Session by ID

**GET /study-sessions/:id**

Success response:

Status: **200 OK**

```json
{
  "id": 1,
  "assignmentId": 1,
  "startTime": "2026-04-01T10:00:00Z",
  "endTime": "2026-04-01T11:00:00Z",
  "durationMinutes": 60
}
```


## Update Study Session

**PUT /study-sessions/:id**

Example request:

```json
{
  "durationMinutes": 90
}
```

Success response:

Status: **200 OK**

```json
{
  "id": 1,
  "durationMinutes": 90
}
```


## Delete Study Session

**DELETE /study-sessions/:id**

Success response:

Status: **200 OK**



## Testing Strategy

Integration tests verify:

- successful resource creation
- validation failures
- foreign-key constraints
- error handling
- database isolation

Tests run using:

```
NODE_ENV=test
```

and connect automatically to:

```
database/test.sqlite
```

instead of the development database.


## Future Improvements

Possible enhancements include:

- user authentication
- study analytics dashboard
- assignment priority scoring
- deadline reminders
- frontend integration


## Author

Caden Moyer  
Study Planner REST API Final Project