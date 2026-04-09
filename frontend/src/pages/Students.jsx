import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

function Students() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    usn: '',
    department: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API_URL}/students`);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/students`, formData);
      setMessage('Student added successfully!');
      setFormData({ name: '', usn: '', department: '' });
      fetchStudents();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error adding student: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await axios.delete(`${API_URL}/students/${id}`);
        setMessage('Student deleted successfully!');
        fetchStudents();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('Error deleting student');
      }
    }
  };

  return (
    <div>
      <div className="card">
        <h2>Add New Student</h2>
        {message && <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>USN (University Seat Number)</label>
            <input
              type="text"
              value={formData.usn}
              onChange={(e) => setFormData({ ...formData, usn: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Department</label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Add Student</button>
        </form>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>USN</th>
                <th>Department</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.usn}</td>
                  <td>{student.department}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(student.id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Students;
