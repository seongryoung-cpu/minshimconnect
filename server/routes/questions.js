import express from 'express';
import db from '../db/database.js';

const router = express.Router();

// Get all questions
router.get('/', (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM questions';
    const params = [];

    if (category) {
      query += ' WHERE category = ?';
      params.push(category);
    }

    query += ' ORDER BY id';

    const questions = db.prepare(query).all(...params);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single question
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const question = db.prepare('SELECT * FROM questions WHERE id = ?').get(id);

    if (!question) {
      return res.status(404).json({ error: '질문을 찾을 수 없습니다.' });
    }

    res.json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
