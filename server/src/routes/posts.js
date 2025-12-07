import { Router } from 'express';
import { query } from '../main/db.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await query(`
      SELECT p.id, p.title, p.status, p.created_at, p.updated_at, p.featured_image_url, p.tags,
             c.id AS category_id, c.name AS category_name
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `);
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await query('SELECT * FROM posts WHERE id = ?', [req.params.id]);
    const post = rows[0];
    if (!post) return res.status(404).json({ error: 'Not found' });
    res.json(post);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, content, category_id, status = 'draft', featured_image_url = null, tags = null } = req.body;
    if (!title || !content) return res.status(400).json({ error: 'Title and content are required' });
    const [result] = await query(
      'INSERT INTO posts (title, content, category_id, status, featured_image_url, tags, author_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, content, category_id || null, status, featured_image_url, tags, req.user?.id || null]
    );
    const [rows] = await query('SELECT * FROM posts WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { title, content, category_id, status, featured_image_url, tags } = req.body;
    const [result] = await query(
      'UPDATE posts SET title = ?, content = ?, category_id = ?, status = ?, featured_image_url = ?, tags = ? WHERE id = ?',
      [title, content, category_id || null, status, featured_image_url, tags, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    const [rows] = await query('SELECT * FROM posts WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const [result] = await query('DELETE FROM posts WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

export default router;

