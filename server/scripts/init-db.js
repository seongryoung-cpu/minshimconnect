import db from '../db/database.js';

console.log('📦 데이터베이스 초기화 중...');

// Users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    nickname TEXT NOT NULL,
    city_id TEXT,
    district_name TEXT,
    has_voted_regional INTEGER DEFAULT 0,
    political_type TEXT DEFAULT '미분석 (테스트 필요)',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Questions table
db.exec(`
  CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('economic', 'social', 'national')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Agendas table
db.exec(`
  CREATE TABLE IF NOT EXISTS agendas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    participants INTEGER DEFAULT 0,
    agree_count INTEGER DEFAULT 0,
    disagree_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'closed')),
    end_date DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Comments table
db.exec(`
  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    agenda_id INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    content TEXT NOT NULL,
    stance TEXT NOT NULL CHECK(stance IN ('agree', 'disagree')),
    likes INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agenda_id) REFERENCES agendas(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`);

// Comment likes table
db.exec(`
  CREATE TABLE IF NOT EXISTS comment_likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    comment_id INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(comment_id, user_id),
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`);

// Votes table
db.exec(`
  CREATE TABLE IF NOT EXISTS votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    agenda_id INTEGER,
    candidate_id INTEGER,
    vote_type TEXT NOT NULL CHECK(vote_type IN ('agenda', 'regional', 'president', 'party')),
    stance TEXT CHECK(stance IN ('agree', 'disagree')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (agenda_id) REFERENCES agendas(id) ON DELETE CASCADE,
    UNIQUE(user_id, agenda_id, vote_type)
  )
`);

// Cities table
db.exec(`
  CREATE TABLE IF NOT EXISTS cities (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
  )
`);

// Districts table
db.exec(`
  CREATE TABLE IF NOT EXISTS districts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    city_id TEXT NOT NULL,
    region_name TEXT NOT NULL,
    turnout REAL DEFAULT 0,
    insight TEXT,
    UNIQUE(city_id, region_name),
    FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE
  )
`);

// Candidates table
db.exec(`
  CREATE TABLE IF NOT EXISTS candidates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    district_id INTEGER NOT NULL,
    number INTEGER NOT NULL,
    party TEXT NOT NULL,
    name TEXT NOT NULL,
    slogan TEXT,
    color TEXT,
    age INTEGER,
    job TEXT,
    image_url TEXT,
    FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE CASCADE
  )
`);

// Candidate careers table
db.exec(`
  CREATE TABLE IF NOT EXISTS candidate_careers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    candidate_id INTEGER NOT NULL,
    career TEXT NOT NULL,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
  )
`);

// Candidate promises table
db.exec(`
  CREATE TABLE IF NOT EXISTS candidate_promises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    candidate_id INTEGER NOT NULL,
    promise TEXT NOT NULL,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
  )
`);

// District stats table
db.exec(`
  CREATE TABLE IF NOT EXISTS district_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    district_id INTEGER NOT NULL,
    stat_type TEXT NOT NULL CHECK(stat_type IN ('generation', 'party_support', 'trend')),
    data TEXT NOT NULL,
    FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE CASCADE
  )
`);

// Politicians table
db.exec(`
  CREATE TABLE IF NOT EXISTS politicians (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slogan TEXT,
    image_url TEXT,
    age INTEGER,
    job TEXT
  )
`);

// Politician careers table
db.exec(`
  CREATE TABLE IF NOT EXISTS politician_careers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    politician_id INTEGER NOT NULL,
    career TEXT NOT NULL,
    FOREIGN KEY (politician_id) REFERENCES politicians(id) ON DELETE CASCADE
  )
`);

// Politician promises table
db.exec(`
  CREATE TABLE IF NOT EXISTS politician_promises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    politician_id INTEGER NOT NULL,
    promise TEXT NOT NULL,
    FOREIGN KEY (politician_id) REFERENCES politicians(id) ON DELETE CASCADE
  )
`);

// User history table
db.exec(`
  CREATE TABLE IF NOT EXISTS user_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('vote_agenda', 'vote_region', 'comment', 'test')),
    title TEXT NOT NULL,
    detail TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`);

console.log('✅ 데이터베이스 초기화 완료!');
