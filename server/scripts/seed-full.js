import db from '../db/database.js';
import bcrypt from 'bcryptjs';

console.log('🌱 전체 데이터 시딩 시작...');

// Insert demo user with hashed password
const hashedPassword = await bcrypt.hash('demo123', 10);
const insertUser = db.prepare(`
  INSERT OR IGNORE INTO users (id, email, password, nickname, political_type)
  VALUES (?, ?, ?, ?, ?)
`);
insertUser.run('demo_user', 'demo@minshim.com', hashedPassword, '데모 사용자', '미분석 (테스트 필요)');
console.log('✅ 데모 사용자 생성 완료');

// Insert questions
const questions = [
  [1, "복지 확대를 위해 세금을 더 낼 의향이 있다.", 'economic'],
  [2, "기업 규제를 완화해야 경제가 성장한다.", 'economic'],
  [3, "최저임금 인상은 고용 시장에 부정적이다.", 'economic'],
  [4, "부동산 시장은 정부 개입보다 시장 자율에 맡겨야 한다.", 'economic'],
  [5, "기본소득 도입이 시급하다.", 'economic'],
  [6, "의료 민영화에 반대한다.", 'economic'],
  [7, "대기업 중심의 경제 구조를 개혁해야 한다.", 'economic'],
  [8, "상속세율을 낮춰야 한다.", 'economic'],
  [9, "남북 통일은 경제적 부담이 크므로 신중해야 한다.", 'national'],
  [10, "강력한 국방력이 평화를 보장한다.", 'national'],
  [11, "외교 관계에서 실리보다 명분이 중요하다.", 'national'],
  [12, "동성혼 법제화에 찬성한다.", 'social'],
  [13, "사형 제도를 부활시켜야 한다.", 'social'],
  [14, "학생 인권 조례는 유지되어야 한다.", 'social'],
  [15, "환경 보호가 경제 발전보다 우선이다.", 'social'],
  [16, "난민 수용에 대해 적극적이어야 한다.", 'social'],
  [17, "촉법소년 연령을 하향해야 한다.", 'social'],
  [18, "전통적인 가족 가치를 지켜야 한다.", 'social'],
  [19, "인터넷 검열은 필요악이다.", 'social'],
  [20, "지방 균형 발전을 위해 수도권을 규제해야 한다.", 'economic'],
];

const insertQuestion = db.prepare('INSERT OR IGNORE INTO questions (id, text, category) VALUES (?, ?, ?)');
questions.forEach(([id, text, category]) => {
  insertQuestion.run(id, text, category);
});
console.log('✅ Questions 데이터 삽입 완료');

// Insert agendas
const insertAgenda = db.prepare(`
  INSERT OR IGNORE INTO agendas (id, category, title, description, participants, agree_count, disagree_count, status, end_date)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const agendas = [
  [1, '교통', '심야 버스 노선 확대 찬반', '택시 승차난 해소를 위해 심야 올빼미 버스 노선을 현재보다 2배 확대하는 방안입니다. 운영비 증가에 대한 우려와 시민 편의 증진이라는 의견이 대립하고 있습니다.', 12405, 8450, 3955, 'active', '2024-06-15'],
  [2, '환경', '일회용품 규제 유예 논란', '소상공인의 경제적 부담을 고려해 종이컵 등 일회용품 사용 규제를 1년 더 유예하자는 안건입니다. 환경 단체의 반발과 자영업자의 환영이 엇갈립니다.', 8390, 3120, 5270, 'active', '2024-06-20'],
  [3, '교육', '수능 절대평가 전환', '과도한 입시 경쟁을 완화하기 위해 수능을 자격고사화하고 절대평가로 전면 전환하자는 제안입니다.', 21033, 15200, 5833, 'active', '2024-07-01'],
  [4, '경제', '대형마트 의무휴업 평일 전환', '현재 일요일로 지정된 대형마트 의무휴업일을 평일로 변경하여 소비자 선택권을 보장하자는 논의입니다.', 5600, 3200, 2400, 'closed', '2024-05-01'],
];

agendas.forEach(agenda => {
  insertAgenda.run(...agenda);
});
console.log('✅ Agendas 데이터 삽입 완료');

// Insert cities and districts
const insertCity = db.prepare('INSERT OR IGNORE INTO cities (id, name) VALUES (?, ?)');
const insertDistrict = db.prepare(`
  INSERT OR IGNORE INTO districts (city_id, region_name, turnout, insight)
  VALUES (?, ?, ?, ?)
`);

insertCity.run('seoul', '서울특별시');
insertDistrict.run('seoul', '종로구', 68.5, '전통적 정치 1번지. 중도층의 표심이 당락을 좌우하는 격전지입니다.');
insertDistrict.run('seoul', '강남구 갑', 72.1, '부동산 이슈 민감도가 전국에서 가장 높으며 보수세가 강한 지역입니다.');
insertDistrict.run('seoul', '마포구 을', 70.2, '2030 청년 인구 비중이 높아 진보 성향이 강했으나 최근 개발 이슈로 혼전 양상입니다.');

insertCity.run('gyeonggi', '경기도');
insertDistrict.run('gyeonggi', '수원시 갑', 64.3, '경기도 정치 1번지. 교통망 확충이 최대 관심사입니다.');
insertDistrict.run('gyeonggi', '성남시 분당구', 76.5, '고소득 전문직 종사자가 많으며 재건축 이슈가 표심을 가르고 있습니다.');

console.log('✅ Cities 및 Districts 데이터 삽입 완료');

// Insert sample candidates for 종로구
const getDistrictId = db.prepare('SELECT id FROM districts WHERE city_id = ? AND region_name = ?');
const jongnoId = getDistrictId.get('seoul', '종로구')?.id;

if (jongnoId) {
  const insertCandidate = db.prepare(`
    INSERT OR IGNORE INTO candidates (district_id, number, party, name, slogan, color, age, job, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertCareer = db.prepare('INSERT OR IGNORE INTO candidate_careers (candidate_id, career) VALUES (?, ?)');
  const insertPromise = db.prepare('INSERT OR IGNORE INTO candidate_promises (candidate_id, promise) VALUES (?, ?)');
  const insertStat = db.prepare('INSERT OR IGNORE INTO district_stats (district_id, stat_type, data) VALUES (?, ?, ?)');

  const candidate1 = insertCandidate.run(jongnoId, 1, 'A당', '김대한', '경제 1번지 종로의 부활', '#3b82f6', 58, '현직 국회의원', 'https://randomuser.me/api/portraits/men/32.jpg');
  const candidate1Id = candidate1.lastInsertRowid;
  insertCareer.run(candidate1Id, '전) 기획재정부 차관');
  insertCareer.run(candidate1Id, '제21대 종로구 국회의원');
  insertCareer.run(candidate1Id, '여의도연구원 부원장');
  insertPromise.run(candidate1Id, '종로구 투기과열지구 해제 추진');
  insertPromise.run(candidate1Id, '광화문 광장 주변 상권 활성화');
  insertPromise.run(candidate1Id, 'GTX-A 노선 조기 개통 지원');

  const candidate2 = insertCandidate.run(jongnoId, 2, 'B당', '이민국', '따뜻한 복지, 행복한 종로', '#ef4444', 45, '인권 변호사', 'https://randomuser.me/api/portraits/men/45.jpg');
  const candidate2Id = candidate2.lastInsertRowid;
  insertCareer.run(candidate2Id, '전) 서울시 인권위원');
  insertCareer.run(candidate2Id, '민주사회를 위한 변호사모임');
  insertCareer.run(candidate2Id, '종로구 마을공동체 자문위원');
  insertPromise.run(candidate2Id, '종로형 공공 산후조리원 설립');
  insertPromise.run(candidate2Id, '전통시장 현대화 및 주차장 확충');
  insertPromise.run(candidate2Id, '1인 가구 지원 센터 확대');

  const candidate3 = insertCandidate.run(jongnoId, 3, 'C당', '박미래', '청년이 사는 도시', '#eab308', 34, '청년 활동가', 'https://randomuser.me/api/portraits/women/65.jpg');
  const candidate3Id = candidate3.lastInsertRowid;
  insertCareer.run(candidate3Id, '현) 청년유니온 위원장');
  insertCareer.run(candidate3Id, '대통령직속 청년위원회 위원');
  insertCareer.run(candidate3Id, '소셜벤처 창업가');
  insertPromise.run(candidate3Id, '청년 월세 지원 대상 확대');
  insertPromise.run(candidate3Id, '대학가 공유 기숙사 건립');
  insertPromise.run(candidate3Id, '문화 예술 창작 공간 지원');

  // Insert stats
  insertStat.run(jongnoId, 'generation', JSON.stringify([
    { name: '20대', value: 15 },
    { name: '30대', value: 20 },
    { name: '40대', value: 25 },
    { name: '50대', value: 22 },
    { name: '60대+', value: 18 }
  ]));

  insertStat.run(jongnoId, 'party_support', JSON.stringify([
    { name: '김대한(A당)', value: 35 },
    { name: '이민국(B당)', value: 40 },
    { name: '박미래(C당)', value: 15 },
    { name: '기타', value: 10 }
  ]));

  insertStat.run(jongnoId, 'trend', JSON.stringify([
    { month: '1월', A: 33, B: 41, C: 16 },
    { month: '2월', A: 34, B: 40, C: 16 },
    { month: '3월', A: 35, B: 40, C: 15 }
  ]));

  console.log('✅ Candidates 및 Stats 데이터 삽입 완료');
}

console.log('🎉 전체 데이터 시딩 완료!');
