// ===============================
// CodeCraftHub - Simple REST API
// ===============================

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json()); // Parse JSON request body

// File path for storing courses
const DATA_FILE = path.join(__dirname, 'courses.json');

// ===============================
// Helper Functions
// ===============================

// Create courses.json if it doesn't exist
function initializeFile() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
  }
}

// Read courses from file
function readCourses() {
  try {
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
  } catch (error) {
    throw new Error('Error reading courses file');
  }
}

// Write courses to file
function writeCourses(courses) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(courses, null, 2));
  } catch (error) {
    throw new Error('Error writing to courses file');
  }
}

// Validate course input
function validateCourse(data) {
  const { name, description, target_date, status } = data;

  if (!name || !description || !target_date || !status) {
    return 'All fields (name, description, target_date, status) are required';
  }

  // Validate date format YYYY-MM-DD
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(target_date)) {
    return 'target_date must be in format YYYY-MM-DD';
  }

  // Validate status
  const validStatus = ['Not Started', 'In Progress', 'Completed'];
  if (!validStatus.includes(status)) {
    return 'Invalid status value';
  }

  return null;
}

// ===============================
// Initialize file
// ===============================
initializeFile();

// ===============================
// Routes
// ===============================

// POST /api/courses → Create new course
app.post('/api/courses', (req, res) => {
  try {
    const error = validateCourse(req.body);
    if (error) {
      return res.status(400).json({ error });
    }

    const courses = readCourses();

    // Auto-generate ID starting from 1
    const newId = courses.length > 0 ? courses[courses.length - 1].id + 1 : 1;

    const newCourse = {
      id: newId,
      name: req.body.name,
      description: req.body.description,
      target_date: req.body.target_date,
      status: req.body.status,
      created_at: new Date().toISOString()
    };

    courses.push(newCourse);
    writeCourses(courses);

    res.status(201).json(newCourse);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/courses → Get all courses
app.get('/api/courses', (req, res) => {
  try {
    const courses = readCourses();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/courses/stats → Get course statistics
app.get('/api/courses/stats', (req, res) => {
  try {
    const courses = readCourses();

    // Total courses
    const total = courses.length;

    // Initialize counters
    const stats = {
      total,
      status: {
        "Not Started": 0,
        "In Progress": 0,
        "Completed": 0
      }
    };

    // Count courses by status
    courses.forEach(course => {
      if (stats.status[course.status] !== undefined) {
        stats.status[course.status]++;
      }
    });

    res.json(stats);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/courses/:id → Get one course
app.get('/api/courses/:id', (req, res) => {
  try {
    const courses = readCourses();
    const course = courses.find(c => c.id === parseInt(req.params.id));

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(course);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/courses/:id → Update a course (partial update)
app.put('/api/courses/:id', (req, res) => {
  try {
    const courses = readCourses();
    const id = parseInt(req.params.id);

    const index = courses.findIndex(c => c.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const data = req.body;

    // Allowed status values
    const validStatuses = ['Not Started', 'In Progress', 'Completed'];

    // 🔹 Validate ONLY fields that are provided

    if (data.name !== undefined && data.name.trim() === '') {
      return res.status(400).json({ error: 'Name cannot be empty' });
    }

    if (data.description !== undefined && data.description.trim() === '') {
      return res.status(400).json({ error: 'Description cannot be empty' });
    }

    if (data.target_date !== undefined) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(data.target_date)) {
        return res.status(400).json({
          error: 'target_date must be in format YYYY-MM-DD'
        });
      }
    }

    // ✅ Your requested status validation (only if provided)
    if (data.status !== undefined) {
      if (!validStatuses.includes(data.status)) {
        return res.status(400).json({
          error: `Status must be one of: ${validStatuses.join(', ')}`
        });
      }
    }

    // 🔹 Update only provided fields
    const updatedCourse = {
      ...courses[index],
      ...data
    };

    courses[index] = updatedCourse;

    writeCourses(courses);

    res.json(updatedCourse);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/courses/:id → Delete a course
app.delete('/api/courses/:id', (req, res) => {
  try {
    const courses = readCourses();
    const index = courses.findIndex(c => c.id === parseInt(req.params.id));

    if (index === -1) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const deleted = courses.splice(index, 1);
    writeCourses(courses);

    res.json({ message: 'Course deleted', course: deleted[0] });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// Start Server
// ===============================
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
