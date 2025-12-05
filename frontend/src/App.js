import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/students')
      .then(response => {
        console.log("Dữ liệu nhận được:", response.data);
        setStudents(response.data);
      })
      .catch(error => console.error("Lỗi khi fetch danh sách:", error));
  }, []);

  return (
    <div className="App">
      <h1>Danh Sách Học Sinh</h1>
      
      {students.length === 0 ? (
        <p>Chưa có học sinh nào</p>
      ) : (
        <table border="1" cellPadding="10" style={{ margin: '20px auto', borderCollapse: 'collapse' }}>
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
  );
}

export default App;