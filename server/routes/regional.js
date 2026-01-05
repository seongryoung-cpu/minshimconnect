import express from 'express';
import db from '../db/database.js';

const router = express.Router();

// Get all cities
router.get('/cities', (req, res) => {
  try {
    const cities = db.prepare('SELECT * FROM cities ORDER BY name').all();
    res.json(cities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get districts by city
router.get('/cities/:cityId/districts', (req, res) => {
  try {
    const { cityId } = req.params;
    const districts = db.prepare(`
      SELECT d.*, 
             (SELECT COUNT(*) FROM candidates WHERE district_id = d.id) as candidate_count
      FROM districts d
      WHERE d.city_id = ?
      ORDER BY d.region_name
    `).all(cityId);

    res.json(districts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get district with candidates
router.get('/districts/:districtId', (req, res) => {
  try {
    const { districtId } = req.params;
    
    const district = db.prepare(`
      SELECT d.*, c.name as city_name
      FROM districts d
      JOIN cities c ON d.city_id = c.id
      WHERE d.id = ?
    `).get(districtId);

    if (!district) {
      return res.status(404).json({ error: '지역구를 찾을 수 없습니다.' });
    }

    // Get candidates
    const candidates = db.prepare(`
      SELECT * FROM candidates
      WHERE district_id = ?
      ORDER BY number
    `).all(districtId);

    // Get careers and promises for each candidate
    const getCareers = db.prepare('SELECT career FROM candidate_careers WHERE candidate_id = ?');
    const getPromises = db.prepare('SELECT promise FROM candidate_promises WHERE candidate_id = ?');

    const candidatesWithDetails = candidates.map(candidate => ({
      ...candidate,
      career: getCareers.all(candidate.id).map(r => r.career),
      promises: getPromises.all(candidate.id).map(r => r.promise),
    }));

    // Get stats
    const stats = db.prepare(`
      SELECT stat_type, data FROM district_stats
      WHERE district_id = ?
    `).all(districtId);

    const statsObj = {};
    stats.forEach(stat => {
      statsObj[stat.stat_type] = JSON.parse(stat.data);
    });

    res.json({
      ...district,
      candidates: candidatesWithDetails,
      generationData: statsObj.generation || [],
      partySupportData: statsObj.party_support || [],
      trendData: statsObj.trend || [],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all regional data (for compatibility)
router.get('/all', (req, res) => {
  try {
    const cities = db.prepare('SELECT * FROM cities ORDER BY name').all();
    
    const getDistricts = db.prepare(`
      SELECT d.* FROM districts d WHERE d.city_id = ?
    `);
    const getCandidates = db.prepare(`
      SELECT * FROM candidates WHERE district_id = ? ORDER BY number
    `);
    const getCareers = db.prepare('SELECT career FROM candidate_careers WHERE candidate_id = ?');
    const getPromises = db.prepare('SELECT promise FROM candidate_promises WHERE candidate_id = ?');
    const getStats = db.prepare('SELECT stat_type, data FROM district_stats WHERE district_id = ?');

    const result = cities.map(city => {
      const districts = getDistricts.all(city.id).map(district => {
        const candidates = getCandidates.all(district.id).map(candidate => ({
          ...candidate,
          career: getCareers.all(candidate.id).map(r => r.career),
          promises: getPromises.all(candidate.id).map(r => r.promise),
        }));

        const stats = getStats.all(district.id);
        const statsObj = {};
        stats.forEach(stat => {
          statsObj[stat.stat_type] = JSON.parse(stat.data);
        });

        return {
          ...district,
          candidates,
          generationData: statsObj.generation || [],
          partySupportData: statsObj.party_support || [],
          trendData: statsObj.trend || [],
        };
      });

      return {
        id: city.id,
        name: city.name,
        districts,
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
