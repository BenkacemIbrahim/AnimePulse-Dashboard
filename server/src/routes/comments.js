import { Router } from 'express';
import { query } from '../main/db.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await query(`
      SELECT c.id, c.post_id, c.author_name, c.author_email, c.content, c.status, c.created_at,
             p.title AS post_title
      FROM comments c
      LEFT JOIN posts p ON c.post_id = p.id
      ORDER BY c.created_at DESC
    `);
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { post_id, author_name, author_email, content } = req.body;
    if (!post_id || !author_name || !content) return res.status(400).json({ error: 'Missing required fields' });
    const [result] = await query('INSERT INTO comments (post_id, author_name, author_email, content, status) VALUES (?, ?, ?, ?, ?)', [
      post_id, author_name, author_email || null, content, 'pending'
    ]);
    const [rows] = await query('SELECT * FROM comments WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { status, content } = req.body;
    const [result] = await query('UPDATE comments SET status = ?, content = ? WHERE id = ?', [status, content, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    const [rows] = await query('SELECT * FROM comments WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to update comment' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const [result] = await query('DELETE FROM comments WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

export default router;

