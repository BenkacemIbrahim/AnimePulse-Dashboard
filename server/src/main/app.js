import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routes from '../routes/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', routes);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const staticDir = path.resolve(__dirname, '../../../project');
app.use(express.static(staticDir));
app.get('/', (req, res) => {
  res.sendFile(path.join(staticDir, 'login.html'));
});

export default app;
