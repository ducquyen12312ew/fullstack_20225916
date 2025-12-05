import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [stuClass, setStuClass] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    axios.get('http://localhost:5000/api/students')
      .then(response => setStudents(response.data))
      .catch(error => console.error("Lỗi khi fetch danh sách:", error));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const studentData = { 
      name, 
      age: Number(age), 
      class: stuClass 
    };

    if (editingId) {
      axios.put(`http://localhost:5000/api/students/${editingId}`, studentData)
        .then(res => {
          setStudents(prev => prev.map(s => s._id === editingId ? res.data : s));
          resetForm();
        })
        .catch(err => console.error("Lỗi khi cập nhật:", err));
    } else {
      axios.post('http://localhost:5000/api/students', studentData)
        .then(res => {
          setStudents(prev => [...prev, res.data]);
          resetForm();
        })
        .catch(err => console.error("Lỗi khi thêm:", err));
    }
  };

  const handleEdit = (student) => {
    setName(student.name);
    setAge(student.age);
    setStuClass(student.class);
    setEditingId(student._id);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa học sinh này?")) return;
    
    axios.delete(`http://localhost:5000/api/students/${id}`)
      .then(res => {
        console.log(res.data.message);
        setStudents(prevList => prevList.filter(s => s._id !== id));
      })
      .catch(err => console.error("Lỗi khi xóa:", err));
  };

  const resetForm = () => {
    setName("");
    setAge("");
    setStuClass("");
    setEditingId(null);
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    if (nameA < nameB) return sortAsc ? -1 : 1;
    if (nameA > nameB) return sortAsc ? 1 : -1;
    return 0;
  });

  return (
    <div className="App">
      <h1>Quản Lý Học Sinh</h1>
      
      <div className="form-container">
        <h2>{editingId ? 'Chỉnh Sửa Học Sinh' : 'Thêm Học Sinh Mới'}</h2>
        <form onSubmit={handleSubmit}>
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
          <div className="button-group">
            <button type="submit">
              {editingId ? 'Cập Nhật' : 'Thêm Học Sinh'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="btn-cancel">
                Hủy
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="table-container">
        <h2>Danh Sách Học Sinh</h2>
        
        <div className="controls-container">
          <input 
            type="text"
            placeholder="Tìm kiếm theo tên..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="search-input"
          />
          
          <button 
            onClick={() => setSortAsc(prev => !prev)}
            className="btn-sort"
          >
            Sắp xếp: {sortAsc ? 'A → Z' : 'Z → A'}
          </button>
        </div>

        {sortedStudents.length === 0 ? (
          <p>{searchTerm ? 'Không tìm thấy học sinh nào' : 'Chưa có học sinh nào'}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Họ Tên</th>
                <th>Tuổi</th>
                <th>Lớp</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {sortedStudents.map(student => (
                <tr key={student._id}>
                  <td>{student.name}</td>
                  <td>{student.age}</td>
                  <td>{student.class}</td>
                  <td>
                    <button 
                      onClick={() => handleEdit(student)}
                      className="btn-edit"
                    >
                      Sửa
                    </button>
                    <button 
                      onClick={() => handleDelete(student._id)}
                      className="btn-delete"
                    >
                      Xóa
                    </button>
                  </td>
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