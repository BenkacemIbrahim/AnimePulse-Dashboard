import { Router } from 'express';
import { query } from '../main/db.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const [rows] = await query('SELECT * FROM settings WHERE id = 1');
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

router.put('/', requireAuth, async (req, res) => {
  try {
    const { site_name, theme, notifications_enabled } = req.body;
    await query('UPDATE settings SET site_name = ?, theme = ?, notifications_enabled = ? WHERE id = 1', [
      site_name, theme, notifications_enabled ? 1 : 0
    ]);
    const [rows] = await query('SELECT * FROM settings WHERE id = 1');
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

export default router;

