import { Router } from 'express';
import { query } from '../main/db.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const [rows] = await query('SELECT id, name, email, role, avatar_url FROM users WHERE id = ?', [req.user.id]);
    const user = rows[0];
    res.json(user);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

router.put('/', requireAuth, async (req, res) => {
  try {
    const { name, avatar_url } = req.body;
    await query('UPDATE users SET name = ?, avatar_url = ? WHERE id = ?', [name, avatar_url, req.user.id]);
    const [rows] = await query('SELECT id, name, email, role, avatar_url FROM users WHERE id = ?', [req.user.id]);
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export default router;

