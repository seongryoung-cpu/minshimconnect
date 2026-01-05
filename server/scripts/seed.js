import db from '../db/database.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🌱 데이터 시딩 시작...');

// Read constants file
const constantsPath = path.join(__dirname, '../../constants.ts');
let constantsContent = '';
try {
  constantsContent = readFileSync(constantsPath, 'utf-8');
} catch (error) {
  console.error('constants.ts 파일을 읽을 수 없습니다. 수동으로 데이터를 입력해주세요.');
  process.exit(1);
}

// Parse and insert questions
const questionsMatch = constantsContent.match(/export const QUESTIONS: Question\[\] = \[([\s\S]*?)\];/);
if (questionsMatch) {
  const questionsText = questionsMatch[1];
  const questionRegex = /\{\s*id:\s*(\d+),\s*text:\s*"([^"]+)",\s*category:\s*'(\w+)'\s*\}/g;
  let match;
  const insertQuestion = db.prepare('INSERT OR IGNORE INTO questions (id, text, category) VALUES (?, ?, ?)');
  
  while ((match = questionRegex.exec(questionsText)) !== null) {
    const [, id, text, category] = match;
    insertQuestion.run(parseInt(id), text, category);
  }
  console.log('✅ Questions 데이터 삽입 완료');
}

// Insert demo user
const insertUser = db.prepare(`
  INSERT OR IGNORE INTO users (id, email, password, nickname, political_type)
  VALUES (?, ?, ?, ?, ?)
`);
insertUser.run('demo_user', 'demo@minshim.com', 'demo123', '데모 사용자', '미분석 (테스트 필요)');
console.log('✅ 데모 사용자 생성 완료');

// Insert sample agendas
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

// Insert cities and districts (sample)
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

console.log('🎉 데이터 시딩 완료!');
