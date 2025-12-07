import { Router } from 'express';
import { query } from '../main/db.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await query('SELECT id, name, slug, created_at FROM categories ORDER BY name ASC');
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { name, slug } = req.body;
    if (!name || !slug) return res.status(400).json({ error: 'Name and slug are required' });
    const [result] = await query('INSERT INTO categories (name, slug) VALUES (?, ?)', [name, slug]);
    const [rows] = await query('SELECT * FROM categories WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { name, slug } = req.body;
    const [result] = await query('UPDATE categories SET name = ?, slug = ? WHERE id = ?', [name, slug, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    const [rows] = await query('SELECT * FROM categories WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const [result] = await query('DELETE FROM categories WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

export default router;

