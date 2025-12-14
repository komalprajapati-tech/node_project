// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');              // ⭐ ADDED
const Student = require('./studentModel');

const app = express();

// =============================
// MIDDLEWARE
// =============================
app.use(cors());
app.use(express.json());

// =============================
// 🔗 MONGODB CONNECTION
// =============================
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
    console.log("Connected DB:", mongoose.connection.db.databaseName);
  })
  .catch((err) => console.log("MongoDB Connection Failed:", err));

// =============================
// ⭐ API ROUTES (KEEP ABOVE)
// =============================

// POST - Save student
app.post('/api/student', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json({ message: "Data Saved Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error saving data", error });
  }
});

// GET - Fetch all students
app.get('/api/student', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Error fetching data", error: err });
  }
});

// DELETE student
app.delete('/api/student/:id', async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting student", error: err });
  }
});

// UPDATE student
app.put('/api/student/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      message: "Student updated successfully",
      data: updatedStudent
    });

  } catch (err) {
    res.status(500).json({ message: "Error updating student", error: err });
  }
});

// =============================
// ⭐ SERVE ANGULAR (Node 22 SAFE)
// =============================
// ⭐ Serve Angular (browser build)
const angularPath = path.join(__dirname, 'dist/project10/browser');

app.use(express.static(angularPath));

// Angular fallback
app.use((req, res) => {
  res.sendFile(path.join(angularPath, 'index.html'));
});

// =============================
// START SERVER
// =============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
