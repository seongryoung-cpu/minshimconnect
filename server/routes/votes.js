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

// Vote on agenda
router.post('/agenda', authenticateToken, (req, res) => {
  try {
    const { agendaId, stance } = req.body;
    const userId = req.user.userId;

    if (!agendaId || !stance) {
      return res.status(400).json({ error: '필수 필드가 누락되었습니다.' });
    }

    // Check if already voted
    const existing = db.prepare('SELECT id FROM votes WHERE user_id = ? AND agenda_id = ? AND vote_type = ?').get(userId, agendaId, 'agenda');

    if (existing) {
      return res.status(400).json({ error: '이미 투표하셨습니다.' });
    }

    // Create vote
    db.prepare(`
      INSERT INTO votes (user_id, agenda_id, vote_type, stance)
      VALUES (?, ?, ?, ?)
    `).run(userId, agendaId, 'agenda', stance);

    // Update agenda counts
    if (stance === 'agree') {
      db.prepare('UPDATE agendas SET agree_count = agree_count + 1, participants = participants + 1 WHERE id = ?').run(agendaId);
    } else {
      db.prepare('UPDATE agendas SET disagree_count = disagree_count + 1, participants = participants + 1 WHERE id = ?').run(agendaId);
    }

    // Add to user history
    const agenda = db.prepare('SELECT title FROM agendas WHERE id = ?').get(agendaId);
    db.prepare(`
      INSERT INTO user_history (user_id, type, title, detail)
      VALUES (?, ?, ?, ?)
    `).run(userId, 'vote_agenda', agenda.title, `${stance === 'agree' ? '찬성' : '반대'} 투표`);

    res.json({ message: '투표가 완료되었습니다.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vote on regional candidate
router.post('/regional', authenticateToken, (req, res) => {
  try {
    const { candidateId } = req.body;
    const userId = req.user.userId;

    if (!candidateId) {
      return res.status(400).json({ error: '후보를 선택해주세요.' });
    }

    // Get candidate info
    const candidate = db.prepare(`
      SELECT c.*, d.region_name, ci.name as city_name
      FROM candidates c
      JOIN districts d ON c.district_id = d.id
      JOIN cities ci ON d.city_id = ci.id
      WHERE c.id = ?
    `).get(candidateId);

    if (!candidate) {
      return res.status(404).json({ error: '후보를 찾을 수 없습니다.' });
    }

    // Check if already voted
    const existing = db.prepare('SELECT id FROM votes WHERE user_id = ? AND vote_type = ?').get(userId, 'regional');

    if (existing) {
      return res.status(400).json({ error: '이미 지역구 투표를 하셨습니다.' });
    }

    // Create vote
    db.prepare(`
      INSERT INTO votes (user_id, candidate_id, vote_type)
      VALUES (?, ?, ?)
    `).run(userId, candidateId, 'regional');

    // Update user
    db.prepare('UPDATE users SET has_voted_regional = 1 WHERE id = ?').run(userId);

    // Add to user history
    db.prepare(`
      INSERT INTO user_history (user_id, type, title, detail)
      VALUES (?, ?, ?, ?)
    `).run(userId, 'vote_region', `${candidate.city_name} ${candidate.region_name} 투표`, `${candidate.name} 후보 선택`);

    res.json({ message: '투표가 완료되었습니다.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
