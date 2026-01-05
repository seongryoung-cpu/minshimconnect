import express from 'express';
import db from '../db/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'minshim-secret-key-change-in-production';

// Register
router.post('/signup', async (req, res) => {
  try {
    const { email, password, nickname } = req.body;

    if (!email || !password || !nickname) {
      return res.status(400).json({ error: '모든 필드를 입력해주세요.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: '비밀번호는 최소 6자 이상이어야 합니다.' });
    }

    // Check if user exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ error: '이미 사용 중인 이메일입니다.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userId = 'user_' + Date.now();
    db.prepare(`
      INSERT INTO users (id, email, password, nickname)
      VALUES (?, ?, ?, ?)
    `).run(userId, email, hashedPassword, nickname);

    // Generate token
    const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '30d' });

    // Get user data
    const user = db.prepare('SELECT id, email, nickname, city_id, district_name, has_voted_regional, political_type FROM users WHERE id = ?').get(userId);

    res.status(201).json({
      token,
      user: {
        ...user,
        hasVotedRegional: user.has_voted_regional === 1,
        cityId: user.city_id,
        districtName: user.district_name,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: '이메일과 비밀번호를 입력해주세요.' });
    }

    // Find user
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }

    // Generate token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        cityId: user.city_id,
        districtName: user.district_name,
        hasVotedRegional: user.has_voted_regional === 1,
        politicalType: user.political_type,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user
router.get('/me', authenticateToken, (req, res) => {
  try {
    const user = db.prepare('SELECT id, email, nickname, city_id, district_name, has_voted_regional, political_type, created_at FROM users WHERE id = ?').get(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    res.json({
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      cityId: user.city_id,
      districtName: user.district_name,
      hasVotedRegional: user.has_voted_regional === 1,
      politicalType: user.political_type,
      createdAt: user.created_at,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/me', authenticateToken, (req, res) => {
  try {
    const { nickname, cityId, districtName, politicalType } = req.body;
    const updates = [];
    const params = [];

    if (nickname !== undefined) {
      updates.push('nickname = ?');
      params.push(nickname);
    }
    if (cityId !== undefined) {
      updates.push('city_id = ?');
      params.push(cityId);
    }
    if (districtName !== undefined) {
      updates.push('district_name = ?');
      params.push(districtName);
    }
    if (politicalType !== undefined) {
      updates.push('political_type = ?');
      params.push(politicalType);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: '업데이트할 필드가 없습니다.' });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(req.user.userId);

    db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...params);

    const user = db.prepare('SELECT id, email, nickname, city_id, district_name, has_voted_regional, political_type FROM users WHERE id = ?').get(req.user.userId);

    res.json({
      ...user,
      hasVotedRegional: user.has_voted_regional === 1,
      cityId: user.city_id,
      districtName: user.district_name,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Middleware to authenticate token
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

export default router;
