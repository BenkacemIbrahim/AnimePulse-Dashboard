import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = Number(process.env.DB_PORT || 3306);
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'animepulse';

export let pool;

async function createPool() {
  pool = await mysql.createPool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    connectionLimit: 10,
    namedPlaceholders: true
  });
}

export async function ensureDatabaseInitialized() {
  await createPool();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255) UNIQUE,
      password_hash VARCHAR(255),
      role VARCHAR(50),
      avatar_url VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS settings (
      id INT PRIMARY KEY,
      site_name VARCHAR(255),
      theme VARCHAR(50),
      notifications_enabled TINYINT(1) DEFAULT 1
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      slug VARCHAR(255) UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS posts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255),
      content TEXT,
      category_id INT NULL,
      status VARCHAR(50),
      featured_image_url VARCHAR(500),
      tags VARCHAR(255),
      author_id INT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS comments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      post_id INT,
      author_name VARCHAR(255),
      author_email VARCHAR(255),
      content TEXT,
      status VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS subscribers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255) UNIQUE,
      status VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // optional seeding
  const [userRows] = await pool.query('SELECT COUNT(*) AS c FROM users');
  if (userRows[0].c === 0) {
    const hash = bcrypt.hashSync('admin123', 10);
    await pool.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      ['Admin User', 'admin@example.com', hash, 'admin']
    );
  }

  const [settingsRows] = await pool.query('SELECT COUNT(*) AS c FROM settings');
  if (settingsRows[0].c === 0) {
    await pool.query(
      'INSERT INTO settings (id, site_name, theme, notifications_enabled) VALUES (?, ?, ?, ?)',
      [1, 'AnimePulse', 'light', 1]
    );
  }

  const [catRows] = await pool.query('SELECT COUNT(*) AS c FROM categories');
  if (catRows[0].c === 0) {
    await pool.query(
      'INSERT INTO categories (name, slug) VALUES (?, ?), (?, ?), (?, ?)',
      [
        'Anime Reviews', 'anime-reviews',
        'Manga News', 'manga-news',
        'Character Analysis', 'character-analysis'
      ]
    );
  }

  const [[catOne]] = await pool.query('SELECT id FROM categories ORDER BY id ASC LIMIT 1');
  const baseCategoryId = catOne?.id || null;

  const [postRows] = await pool.query('SELECT COUNT(*) AS c FROM posts');
  if (postRows[0].c === 0) {
    await pool.query(
      'INSERT INTO posts (title, content, category_id, status) VALUES (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?)',
      [
        'Latest Anime Trends 2025', 'An overview of trending anime titles in 2025.', baseCategoryId, 'published',
        'Manga Review: Death Note', 'A deep dive into the themes and storytelling of Death Note.', baseCategoryId, 'published',
        'Studio Analysis 2025', 'Analyzing top studios and their releases this year.', baseCategoryId, 'draft'
      ]
    );
  }

  const [subRows] = await pool.query('SELECT COUNT(*) AS c FROM subscribers');
  if (subRows[0].c === 0) {
    await pool.query(
      'INSERT INTO subscribers (name, email, status) VALUES (?, ?, ?), (?, ?, ?), (?, ?, ?)',
      [
        'Alex Turner', 'alex@example.com', 'active',
        'Jessica Moon', 'jessica@example.com', 'active',
        'Chris Lee', 'chris@example.com', 'inactive'
      ]
    );
  }

  const [[postOne]] = await pool.query('SELECT id FROM posts ORDER BY id ASC LIMIT 1');
  const basePostId = postOne?.id || null;

  const [commentRows] = await pool.query('SELECT COUNT(*) AS c FROM comments');
  if (commentRows[0].c === 0 && basePostId) {
    await pool.query(
      'INSERT INTO comments (post_id, author_name, author_email, content, status) VALUES (?, ?, ?, ?, ?), (?, ?, ?, ?, ?)',
      [
        basePostId, 'Deena Timmons', 'deena@example.com', 'Loved the latest review!', 'approved',
        basePostId, 'Sheila Lee', 'sheila@example.com', 'Great insights, thanks!', 'pending'
      ]
    );
  }
}

export async function query(sql, params) {
  if (!pool) await createPool();
  return pool.query(sql, params);
}
