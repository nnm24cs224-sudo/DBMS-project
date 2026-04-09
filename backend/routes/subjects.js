import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM subjects ORDER BY id DESC').all();
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', (req, res) => {
  try {
    const { subject_name, subject_code } = req.body;
    const result = db.prepare('INSERT INTO subjects (subject_name, subject_code) VALUES (?, ?)').run(subject_name, subject_code);
    res.json({ id: result.lastInsertRowid, message: 'Subject added successfully' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM subjects WHERE id = ?').run(req.params.id);
    res.json({ message: 'Subject deleted successfully' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

export default router;
