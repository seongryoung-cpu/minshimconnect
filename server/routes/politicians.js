import express from 'express';
import db from '../db/database.js';

const router = express.Router();

// Get all politicians
router.get('/', (req, res) => {
  try {
    const politicians = db.prepare('SELECT * FROM politicians ORDER BY id').all();
    
    const getCareers = db.prepare('SELECT career FROM politician_careers WHERE politician_id = ?');
    const getPromises = db.prepare('SELECT promise FROM politician_promises WHERE politician_id = ?');

    const politiciansWithDetails = politicians.map(politician => ({
      ...politician,
      career: getCareers.all(politician.id).map(r => r.career),
      promises: getPromises.all(politician.id).map(r => r.promise),
    }));

    res.json(politiciansWithDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single politician
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const politician = db.prepare('SELECT * FROM politicians WHERE id = ?').get(id);

    if (!politician) {
      return res.status(404).json({ error: '정치인을 찾을 수 없습니다.' });
    }

    const careers = db.prepare('SELECT career FROM politician_careers WHERE politician_id = ?').all(id);
    const promises = db.prepare('SELECT promise FROM politician_promises WHERE politician_id = ?').all(id);

    res.json({
      ...politician,
      career: careers.map(r => r.career),
      promises: promises.map(r => r.promise),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
