import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM students ORDER BY id DESC').all();
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', (req, res) => {
  try {
    const { name, usn, department } = req.body;
    const result = db.prepare('INSERT INTO students (name, usn, department) VALUES (?, ?, ?)').run(name, usn, department);
    res.json({ id: result.lastInsertRowid, message: 'Student added successfully' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM students WHERE id = ?').run(req.params.id);
    res.json({ message: 'Student deleted successfully' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

export default router;
