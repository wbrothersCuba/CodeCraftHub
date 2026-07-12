# CodeCraftHub 🚀

## 📖 Project Overview

CodeCraftHub is a simple REST API built with **Node.js** and **Express** that allows developers to track courses they want to learn and monitor their progress.

The project is designed for beginners who want to practice REST API concepts without using a database.

Course data is stored locally in a JSON file called `courses.json`.

---

## ✨ Features

- Create, read, update, and delete courses (CRUD)
- Store course data in a JSON file (no database required)
- Automatically create `courses.json` if it does not exist
- Auto-generated course IDs
- Track course completion dates
- Track course status:
  - Not Started
  - In Progress
  - Completed
- Partial course updates supported
- Course statistics endpoint
- Input validation
- Error handling for:
  - Missing required fields
  - Invalid status values
  - Course not found
  - File read/write errors

---

# ⚙️ Installation

## 1. Clone the repository

```bash
git clone <your-repo-url>
cd codecrafthub
````

## 2. Install dependencies

```bash
npm install
```

---

# ▶️ Running the Application

Start the server:

```bash
npm start
```

The API will run on:

```
http://localhost:5000
```

---

# 🌐 API Documentation

Base URL:

```
http://localhost:5000/api/courses
```

---

# ➕ Create a Course

## POST `/api/courses`

Creates a new learning course.

### Request Body

```json
{
  "name": "Node.js Basics",
  "description": "Learn Express and REST APIs",
  "target_date": "2026-08-01",
  "status": "Not Started"
}
```

### Response

```json
{
  "id": 1,
  "name": "Node.js Basics",
  "description": "Learn Express and REST APIs",
  "target_date": "2026-08-01",
  "status": "Not Started",
  "created_at": "2026-07-12T12:00:00.000Z"
}
```

---

# 📄 Get All Courses

## GET `/api/courses`

Returns all available courses.

Example:

```
GET http://localhost:5000/api/courses
```

---

# 🔍 Get a Single Course

## GET `/api/courses/:id`

Returns one course by ID.

Example:

```
GET http://localhost:5000/api/courses/1
```

Response:

```json
{
  "id": 1,
  "name": "Node.js Basics",
  "description": "Learn Express and REST APIs",
  "target_date": "2026-08-01",
  "status": "In Progress",
  "created_at": "2026-07-12T12:00:00.000Z"
}
```

---

# ✏️ Update a Course

## PUT `/api/courses/:id`

Updates an existing course.

Partial updates are supported.

You only need to send the fields you want to change.

---

## Example: Update only status

Request:

```
PUT http://localhost:5000/api/courses/1
```

Body:

```json
{
  "status": "Completed"
}
```

---

## Example: Update multiple fields

```json
{
  "name": "Advanced Node.js",
  "status": "In Progress",
  "target_date": "2026-10-01"
}
```

---

# ❌ Delete a Course

## DELETE `/api/courses/:id`

Deletes a course by ID.

Example:

```
DELETE http://localhost:5000/api/courses/1
```

---

# 📊 Course Statistics

## GET `/api/courses/stats`

Returns statistics about all courses.

Includes:

* Total number of courses
* Number of courses grouped by status

Example:

```
GET http://localhost:5000/api/courses/stats
```

Response:

```json
{
  "total": 5,
  "status": {
    "Not Started": 2,
    "In Progress": 2,
    "Completed": 1
  }
}
```

---

# ⚠️ Validation Rules

## Creating Courses

The following fields are required:

* `name`
* `description`
* `target_date`
* `status`

---

## Updating Courses

Updates are partial.

Only provided fields are validated.

### Status

Allowed values:

```
Not Started
In Progress
Completed
```

### Target Date

Must use:

```
YYYY-MM-DD
```

Example:

```
2026-08-01
```

---

# 🛠️ Troubleshooting

## Server does not start

Check Node.js installation:

```bash
node -v
```

Check installed dependencies:

```bash
npm install
```

---

## Port 5000 already in use

Stop the running application or change the port in `app.js`.

---

## courses.json is missing

The application automatically creates it.

If needed, create manually:

```bash
touch courses.json
```

---

## JSON parsing errors

Make sure requests send valid JSON:

Example header:

```
Content-Type: application/json
```

---

## Course not found error

Verify the course ID exists:

Example:

```
GET /api/courses/1
```

---

# 🚀 Future Improvements

Possible improvements:

* Add user authentication
* Replace JSON storage with MongoDB
* Add frontend dashboard
* Add course search and filtering
* Add progress charts

---

# 👨‍💻 Author

CodeCraftHub Project

