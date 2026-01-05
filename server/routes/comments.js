import express from 'express';
import db from '../db/database.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'minshim-secret-key-change-in-production';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: '인증 토큰이 필요합니다.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: '유효하지 않은 토큰입니다.' });
    }
    req.user = user;
    next();
  });
}

const router = express.Router();

// Get comments for an agenda
router.get('/agenda/:agendaId', (req, res) => {
  try {
    const { agendaId } = req.params;
    const comments = db.prepare(`
      SELECT c.*, u.nickname as author
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.agenda_id = ?
      ORDER BY c.created_at DESC
    `).all(agendaId);

    res.json(comments.map(comment => ({
      id: comment.id,
      author: comment.author,
      content: comment.content,
      date: formatDate(comment.created_at),
      likes: comment.likes,
      stance: comment.stance,
      isLiked: false,
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create comment
router.post('/', authenticateToken, (req, res) => {
  try {
    const { agendaId, content, stance } = req.body;
    const userId = req.user.userId;

    if (!agendaId || !content || !stance) {
      return res.status(400).json({ error: '필수 필드가 누락되었습니다.' });
    }

    const result = db.prepare(`
      INSERT INTO comments (agenda_id, user_id, content, stance)
      VALUES (?, ?, ?, ?)
    `).run(agendaId, userId, content, stance);

    const comment = db.prepare(`
      SELECT c.*, u.nickname as author
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `).get(result.lastInsertRowid);

    res.status(201).json({
      id: comment.id,
      author: comment.author,
      content: comment.content,
      date: formatDate(comment.created_at),
      likes: 0,
      stance: comment.stance,
      isLiked: false,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Like comment
router.post('/:id/like', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Check if already liked
    const existing = db.prepare('SELECT id FROM comment_likes WHERE comment_id = ? AND user_id = ?').get(id, userId);

    if (existing) {
      // Unlike
      db.prepare('DELETE FROM comment_likes WHERE comment_id = ? AND user_id = ?').run(id, userId);
      db.prepare('UPDATE comments SET likes = likes - 1 WHERE id = ?').run(id);
      res.json({ liked: false });
    } else {
      // Like
      db.prepare('INSERT INTO comment_likes (comment_id, user_id) VALUES (?, ?)').run(id, userId);
      db.prepare('UPDATE comments SET likes = likes + 1 WHERE id = ?').run(id);
      res.json({ liked: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 7) return `${days}일 전`;
  return date.toLocaleDateString('ko-KR');
}

export default router;
