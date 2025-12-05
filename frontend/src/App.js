import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [stuClass, setStuClass] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    axios.get('http://localhost:5000/api/students')
      .then(response => setStudents(response.data))
      .catch(error => console.error("Lỗi khi fetch danh sách:", error));
  };

  const handleAddStudent = (e) => {
    e.preventDefault();
    
    const newStudent = { 
      name, 
      age: Number(age), 
      class: stuClass 
    };

    axios.post('http://localhost:5000/api/students', newStudent)
      .then(res => {
        setStudents(prev => [...prev, res.data]);
        setName("");
        setAge("");
        setStuClass("");
      })
      .catch(err => console.error("Lỗi khi thêm:", err));
  };

  return (
    <div className="App">
      <h1>Quản Lý Học Sinh</h1>
      
      <div className="form-container">
        <h2>Thêm Học Sinh Mới</h2>
        <form onSubmit={handleAddStudent}>
          <input 
            type="text" 
            placeholder="Họ tên" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            required 
          />
          <input 
            type="number" 
            placeholder="Tuổi" 
            value={age} 
            onChange={e => setAge(e.target.value)} 
            required 
          />
          <input 
            type="text" 
            placeholder="Lớp" 
            value={stuClass} 
            onChange={e => setStuClass(e.target.value)} 
            required 
          />
          <button type="submit">Thêm Học Sinh</button>
        </form>
      </div>

      <div className="table-container">
        <h2>Danh Sách Học Sinh</h2>
        {students.length === 0 ? (
          <p>Chưa có học sinh nào</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Họ Tên</th>
                <th>Tuổi</th>
                <th>Lớp</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student._id}>
                  <td>{student.name}</td>
                  <td>{student.age}</td>
                  <td>{student.class}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;