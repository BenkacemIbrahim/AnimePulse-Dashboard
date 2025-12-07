import { Router } from 'express';
import { query } from '../main/db.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await query('SELECT id, name, email, status, created_at FROM subscribers ORDER BY created_at DESC');
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch subscribers' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    const [result] = await query('INSERT INTO subscribers (name, email, status) VALUES (?, ?, ?)', [name || null, email, 'active']);
    const [rows] = await query('SELECT * FROM subscribers WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to create subscriber' });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { name, status } = req.body;
    const [result] = await query('UPDATE subscribers SET name = ?, status = ? WHERE id = ?', [name || null, status, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    const [rows] = await query('SELECT * FROM subscribers WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to update subscriber' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const [result] = await query('DELETE FROM subscribers WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to delete subscriber' });
  }
});

export default router;

