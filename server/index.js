import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import agendaRoutes from './routes/agendas.js';
import regionalRoutes from './routes/regional.js';
import questionRoutes from './routes/questions.js';
import politicianRoutes from './routes/politicians.js';
import authRoutes from './routes/auth.js';
import commentRoutes from './routes/comments.js';
import voteRoutes from './routes/votes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/agendas', agendaRoutes);
app.use('/api/regional', regionalRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/politicians', politicianRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/votes', voteRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '민심잇다 API 서버가 정상 작동 중입니다.' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || '서버 오류가 발생했습니다.',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 서버가 http://localhost:${PORT}에서 실행 중입니다.`);
  console.log(`📊 API 엔드포인트: http://localhost:${PORT}/api`);
});
