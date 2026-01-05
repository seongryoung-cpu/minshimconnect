import express from 'express';
import db from '../db/database.js';

const router = express.Router();

// Get all agendas
router.get('/', (req, res) => {
  try {
    const { status, category } = req.query;
    let query = 'SELECT * FROM agendas WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY created_at DESC';

    const agendas = db.prepare(query).all(...params);

    // Get comments for each agenda
    const getComments = db.prepare(`
      SELECT c.*, u.nickname as author
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.agenda_id = ?
      ORDER BY c.created_at DESC
      LIMIT 10
    `);

    const agendasWithComments = agendas.map(agenda => {
      const comments = getComments.all(agenda.id).map(comment => ({
        id: comment.id,
        author: comment.author,
        content: comment.content,
        date: formatDate(comment.created_at),
        likes: comment.likes,
        stance: comment.stance,
        isLiked: false, // TODO: Check if current user liked
      }));

      return {
        ...agenda,
        comments,
      };
    });

    res.json(agendasWithComments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single agenda
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const agenda = db.prepare('SELECT * FROM agendas WHERE id = ?').get(id);

    if (!agenda) {
      return res.status(404).json({ error: '안건을 찾을 수 없습니다.' });
    }

    // Get all comments
    const comments = db.prepare(`
      SELECT c.*, u.nickname as author
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.agenda_id = ?
      ORDER BY c.created_at DESC
    `).all(id);

    res.json({
      ...agenda,
      comments: comments.map(comment => ({
        id: comment.id,
        author: comment.author,
        content: comment.content,
        date: formatDate(comment.created_at),
        likes: comment.likes,
        stance: comment.stance,
        isLiked: false,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create agenda (admin only)
router.post('/', (req, res) => {
  try {
    const { category, title, description, end_date } = req.body;

    if (!category || !title || !description || !end_date) {
      return res.status(400).json({ error: '필수 필드가 누락되었습니다.' });
    }

    const result = db.prepare(`
      INSERT INTO agendas (category, title, description, end_date)
      VALUES (?, ?, ?, ?)
    `).run(category, title, description, end_date);

    res.status(201).json({ id: result.lastInsertRowid, message: '안건이 생성되었습니다.' });
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
