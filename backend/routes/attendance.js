import express from 'express';
import db from '../db.js';

const router = express.Router();

// Get all records
router.get('/', (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT a.id, a.date, a.status,
             s.name as student_name, s.usn,
             sub.subject_name, sub.subject_code
      FROM attendance a
      JOIN students s ON a.student_id = s.id
      JOIN subjects sub ON a.subject_id = sub.id
      ORDER BY a.id DESC
    `).all();
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Bulk insert — { records: [{ student_name, subject_name, status }] }
router.post('/bulk', (req, res) => {
  try {
    const { records } = req.body;
    if (!Array.isArray(records) || records.length === 0)
      return res.status(400).json({ error: 'records array is required' });

    const today = new Date().toISOString().split('T')[0];
    let inserted = 0;

    const insertAll = db.transaction(() => {
      for (const { student_name, subject_name, status } of records) {
        if (!student_name?.trim() || !subject_name?.trim()) continue;

        // find or create student
        let student = db.prepare('SELECT id FROM students WHERE name = ? LIMIT 1').get(student_name.trim());
        if (!student) {
          const r = db.prepare('INSERT INTO students (name, usn, department) VALUES (?, ?, ?)').run(student_name.trim(), 'USN-' + Date.now(), 'General');
          student = { id: r.lastInsertRowid };
        }

        // find or create subject
        let subject = db.prepare('SELECT id FROM subjects WHERE subject_name = ? LIMIT 1').get(subject_name.trim());
        if (!subject) {
          const r = db.prepare('INSERT INTO subjects (subject_name, subject_code) VALUES (?, ?)').run(subject_name.trim(), 'SUB-' + Date.now());
          subject = { id: r.lastInsertRowid };
        }

        db.prepare('INSERT INTO attendance (student_id, subject_id, date, status) VALUES (?, ?, ?, ?)').run(student.id, subject.id, today, status || 'Present');
        inserted++;
      }
    });

    insertAll();
    res.json({ inserted, message: 'Attendance saved successfully' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Delete
router.delete('/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM attendance WHERE id = ?').run(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

export default router;
