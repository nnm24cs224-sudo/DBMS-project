import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({
    subject_name: '',
    subject_code: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/subjects`);
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/subjects`, formData);
      setMessage('Subject added successfully!');
      setFormData({ subject_name: '', subject_code: '' });
      fetchSubjects();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error adding subject: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await axios.delete(`${API_URL}/subjects/${id}`);
        setMessage('Subject deleted successfully!');
        fetchSubjects();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('Error deleting subject');
      }
    }
  };

  return (
    <div>
      <div className="card">
        <h2>Add New Subject</h2>
        {message && <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Subject Name</label>
            <input
              type="text"
              value={formData.subject_name}
              onChange={(e) => setFormData({ ...formData, subject_name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Subject Code</label>
            <input
              type="text"
              value={formData.subject_code}
              onChange={(e) => setFormData({ ...formData, subject_code: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Add Subject</button>
        </form>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Subject Name</th>
                <th>Subject Code</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => (
                <tr key={subject.id}>
                  <td>{subject.id}</td>
                  <td>{subject.subject_name}</td>
                  <td>{subject.subject_code}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(subject.id)}
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

export default Subjects;
