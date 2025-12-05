const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Student = require('./Student');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/student_db')
  .then(() => console.log("Đã kết nối MongoDB thành công"))
  .catch(err => console.error("Lỗi kết nối MongoDB:", err));

app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/students', async (req, res) => {
  try {
    const newStudent = await Student.create(req.body);
    res.status(201).json(newStudent);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});