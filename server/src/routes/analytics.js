import { Router } from 'express';
import { query } from '../main/db.js';

const router = Router();

router.get('/summary', async (req, res) => {
  try {
    const [[postsCount]] = await query('SELECT COUNT(*) AS c FROM posts');
    const [[commentsCount]] = await query('SELECT COUNT(*) AS c FROM comments');
    const [[subscribersCount]] = await query('SELECT COUNT(*) AS c FROM subscribers');
    const [[categoriesCount]] = await query('SELECT COUNT(*) AS c FROM categories');

    const [rows] = await query(
      `SELECT DATE(created_at) AS d, COUNT(*) AS c
       FROM posts
       WHERE created_at >= CURDATE() - INTERVAL 6 DAY
       GROUP BY DATE(created_at)
       ORDER BY d ASC`
    );
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().slice(0, 10);
    });
    const map = Object.fromEntries(rows.map(r => [r.d.toISOString ? r.d.toISOString().slice(0,10) : r.d, Number(r.c)]));
    const timeseries = days.map(d => ({ date: d, count: map[d] || 0 }));

    res.json({
      counts: {
        posts: postsCount.c || 0,
        comments: commentsCount.c || 0,
        subscribers: subscribersCount.c || 0,
        categories: categoriesCount.c || 0
      },
      timeseries
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch analytics summary' });
  }
});

export default router;

