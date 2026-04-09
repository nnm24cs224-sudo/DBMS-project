import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const emptyRow = () => ({ student_name: '', subject_name: '', status: 'Present' });

function Attendance() {
  const [rows, setRows] = useState([emptyRow()]);
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    axios.get(`${API_URL}/attendance`)
      .then((res) => setRecords(res.data))
      .catch(console.error);
  }, []);

  const showMsg = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const updateRow = (index, field, value) => {
    setRows((prev) => prev.map((r, i) => i === index ? { ...r, [field]: value } : r));
  };

  const addRow = () => setRows((prev) => [...prev, emptyRow()]);

  const removeRow = (index) => {
    setRows((prev) => {
      if (prev.length === 1) return [emptyRow()];
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const valid = rows.filter((r) => r.student_name.trim() && r.subject_name.trim());
    if (valid.length === 0) return showMsg('Please fill in at least one row.', 'error');

    try {
      const res = await axios.post(`${API_URL}/attendance/bulk`, {
        records: valid.map((r) => ({
          student_name: r.student_name.trim(),
          subject_name: r.subject_name.trim(),
          status: r.status,
        })),
      });
      showMsg(`Attendance saved for ${res.data.inserted} student(s)!`, 'success');
      setRows([emptyRow()]);
      const updated = await axios.get(`${API_URL}/attendance`);
      setRecords(updated.data);
    } catch (err) {
      showMsg('Error: ' + (err.response?.data?.error || err.message), 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await axios.delete(`${API_URL}/attendance/${id}`);
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch {
      showMsg('Error deleting record', 'error');
    }
  };

  return (
    <div>
      {/* ── FORM CARD ── */}
      <div className="card">
        <h2>Mark Attendance</h2>

        {message.text && (
          <div className={`message ${message.type}`}>{message.text}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student Name</th>
                  <th>Subject Name</th>
                  <th>Attendance</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>
                      <input
                        type="text"
                        placeholder="Student name"
                        value={row.student_name}
                        onChange={(e) => updateRow(i, 'student_name', e.target.value)}
                        style={{ width: '100%' }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        placeholder="Subject name"
                        value={row.subject_name}
                        onChange={(e) => updateRow(i, 'subject_name', e.target.value)}
                        style={{ width: '100%' }}
                      />
                    </td>
                    <td>
                      <select
                        value={row.status}
                        onChange={(e) => updateRow(i, 'status', e.target.value)}
                      >
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                      </select>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => removeRow(i)}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button type="button" className="btn btn-primary" onClick={addRow}>
              + Add Student
            </button>
            <button type="submit" className="btn btn-primary">
              Submit Attendance
            </button>
          </div>
        </form>
      </div>

      {/* ── RECORDS CARD ── */}
      <div className="card">
        <h2>Attendance Records</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Subject</th>
                <th>Attendance</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', color: '#888' }}>
                    No records found
                  </td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr key={record.id}>
                    <td>{record.student_name}</td>
                    <td>{record.subject_name}</td>
                    <td>
                      <span className={`status-badge ${record.status.toLowerCase()}`}>
                        {record.status}
                      </span>
                    </td>
                    <td>
                      <button onClick={() => handleDelete(record.id)} className="btn btn-danger">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Attendance;
