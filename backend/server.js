const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas Connected"))
  .catch((err) => console.log(err));

const studentSchema = new mongoose.Schema({
  name: String,
  email: String
});

const Student = mongoose.model("Student", studentSchema);

// CREATE
app.post("/students", async (req, res) => {
  console.log("POST /students received:", req.body);
  try {
    const student = await Student.create(req.body);
    console.log("Student created:", student);
    res.status(201).json(student);
  } catch (error) {
    console.error("POST /students error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// READ
app.get("/students", async (req, res) => {
  try {
    console.log("GET /students requested");
    const students = await Student.find();
    console.log("Students retrieved:", students.length);
    res.json(students);
  } catch (error) {
    console.error("GET /students error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// UPDATE
app.put("/students/:id", async (req, res) => {
  try {
    console.log("PUT /students/:id received:", req.params.id, req.body);
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(student);
  } catch (error) {
    console.error("PUT /students/:id error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// DELETE
app.delete("/students/:id", async (req, res) => {
  try {
    console.log("DELETE /students/:id received:", req.params.id);
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted Successfully" });
  } catch (error) {
    console.error("DELETE /students/:id error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server Running`);
});