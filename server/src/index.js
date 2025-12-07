import dotenv from 'dotenv';
dotenv.config();

import app from './main/app.js';
import { ensureDatabaseInitialized } from './main/db.js';

const PORT = process.env.PORT || 3000;

console.log('DB config', {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  name: process.env.DB_NAME
});

await ensureDatabaseInitialized();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
