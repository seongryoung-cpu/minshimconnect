
import { AgendaItem, CityData, PoliticianProfile, Question } from './types';

// 20 Dummy Questions
export const QUESTIONS: Question[] = [
  { id: 1, text: "복지 확대를 위해 세금을 더 낼 의향이 있다.", category: 'economic' },
  { id: 2, text: "기업 규제를 완화해야 경제가 성장한다.", category: 'economic' },
  { id: 3, text: "최저임금 인상은 고용 시장에 부정적이다.", category: 'economic' },
  { id: 4, text: "부동산 시장은 정부 개입보다 시장 자율에 맡겨야 한다.", category: 'economic' },
  { id: 5, text: "기본소득 도입이 시급하다.", category: 'economic' },
  { id: 6, text: "의료 민영화에 반대한다.", category: 'economic' },
  { id: 7, text: "대기업 중심의 경제 구조를 개혁해야 한다.", category: 'economic' },
  { id: 8, text: "상속세율을 낮춰야 한다.", category: 'economic' },
  { id: 9, text: "남북 통일은 경제적 부담이 크므로 신중해야 한다.", category: 'national' },
  { id: 10, text: "강력한 국방력이 평화를 보장한다.", category: 'national' },
  { id: 11, text: "외교 관계에서 실리보다 명분이 중요하다.", category: 'national' },
  { id: 12, text: "동성혼 법제화에 찬성한다.", category: 'social' },
  { id: 13, text: "사형 제도를 부활시켜야 한다.", category: 'social' },
  { id: 14, text: "학생 인권 조례는 유지되어야 한다.", category: 'social' },
  { id: 15, text: "환경 보호가 경제 발전보다 우선이다.", category: 'social' },
  { id: 16, text: "난민 수용에 대해 적극적이어야 한다.", category: 'social' },
  { id: 17, text: "촉법소년 연령을 하향해야 한다.", category: 'social' },
  { id: 18, text: "전통적인 가족 가치를 지켜야 한다.", category: 'social' },
  { id: 19, text: "인터넷 검열은 필요악이다.", category: 'social' },
  { id: 20, text: "지방 균형 발전을 위해 수도권을 규제해야 한다.", category: 'economic' },
];

export const MOCK_AGENDAS: AgendaItem[] = [
  { 
    id: 1, 
    category: "교통", 
    title: "심야 버스 노선 확대 찬반", 
    participants: 12405, 
    description: "택시 승차난 해소를 위해 심야 올빼미 버스 노선을 현재보다 2배 확대하는 방안입니다. 운영비 증가에 대한 우려와 시민 편의 증진이라는 의견이 대립하고 있습니다.",
    agreeCount: 8450,
    disagreeCount: 3955,
    status: 'active',
    endDate: '2024-06-15',
    comments: [
      { id: 1, author: "시민1", content: "야근하고 택시 안 잡혀서 고생한 적이 한두 번이 아닙니다. 무조건 찬성!", date: "방금 전", likes: 124, stance: 'agree' },
      { id: 2, author: "택시기사", content: "택시 업계 다 죽습니다. 생존권 보장해주세요.", date: "10분 전", likes: 45, stance: 'disagree' },
      { id: 3, author: "행정가", content: "재정 부담이 만만치 않을 텐데 구체적인 예산안이 궁금하네요.", date: "1시간 전", likes: 12, stance: 'disagree' }
    ]
  },
  { 
    id: 2, 
    category: "환경", 
    title: "일회용품 규제 유예 논란", 
    participants: 8390, 
    description: "소상공인의 경제적 부담을 고려해 종이컵 등 일회용품 사용 규제를 1년 더 유예하자는 안건입니다. 환경 단체의 반발과 자영업자의 환영이 엇갈립니다.",
    agreeCount: 3120,
    disagreeCount: 5270,
    status: 'active',
    endDate: '2024-06-20',
    comments: [
      { id: 1, author: "카페사장", content: "지금 경기가 너무 안 좋습니다. 조금만 더 유예해 주세요.", date: "20분 전", likes: 88, stance: 'agree' },
      { id: 2, author: "환경지킴이", content: "지구 온난화가 심각합니다. 불편하더라도 지금 당장 시행해야 합니다.", date: "30분 전", likes: 156, stance: 'disagree' }
    ]
  },
  { 
    id: 3, 
    category: "교육", 
    title: "수능 절대평가 전환", 
    participants: 21033, 
    description: "과도한 입시 경쟁을 완화하기 위해 수능을 자격고사화하고 절대평가로 전면 전환하자는 제안입니다.",
    agreeCount: 15200,
    disagreeCount: 5833,
    status: 'active',
    endDate: '2024-07-01',
    comments: [
      { id: 1, author: "학부모", content: "아이들이 너무 불쌍해요. 찬성합니다.", date: "1시간 전", likes: 230, stance: 'agree' },
      { id: 2, author: "입시전문가", content: "변별력이 사라지면 대학별 고사가 부활해 사교육이 더 늘어날 겁니다.", date: "2시간 전", likes: 95, stance: 'disagree' }
    ]
  },
  {
    id: 4,
    category: "경제",
    title: "대형마트 의무휴업 평일 전환",
    participants: 5600,
    description: "현재 일요일로 지정된 대형마트 의무휴업일을 평일로 변경하여 소비자 선택권을 보장하자는 논의입니다.",
    agreeCount: 3200,
    disagreeCount: 2400,
    status: 'closed',
    endDate: '2024-05-01',
    comments: []
  }
];

export const MOCK_POLITICIANS: PoliticianProfile[] = [
  { 
    id: 1, 
    name: "김청년", 
    slogan: "청년의 목소리, 구의회로", 
    imageUrl: "https://picsum.photos/200/200?random=1",
    age: 28,
    job: "스타트업 대표",
    career: ["전) OO대학교 총학생회장", "현) 청년창업네트워크 이사", "2023 지역사회 봉사상 수상"],
    promises: ["청년 취업 지원 센터 설립", "공공 공유 오피스 확충", "대학가 안심 귀가길 조성"]
  },
  { 
    id: 2, 
    name: "이혁신", 
    slogan: "낡은 정치를 바꿉니다", 
    imageUrl: "https://picsum.photos/200/200?random=2",
    age: 42,
    job: "도시계획 전문가",
    career: ["전) 서울시 도시계획 자문위원", "현) 미래도시연구소 소장", "저서 <우리 동네가 바뀐다>"],
    promises: ["노후 주거지 재개발 신속 추진", "마을 도서관 건립", "주차난 해소를 위한 공영주차장 확대"]
  },
  { 
    id: 3, 
    name: "박소통", 
    slogan: "언제나 열려있는 귀", 
    imageUrl: "https://picsum.photos/200/200?random=3",
    age: 55,
    job: "사회복지사",
    career: ["현) OO종합사회복지관 관장", "전) 지역아동센터 연합회장", "마을공동체 위원장 역임"],
    promises: ["어르신 돌봄 서비스 확대", "장애인 이동권 보장", "방과후 돌봄 교실 전면 무상화"]
  },
  { 
    id: 4, 
    name: "최환경", 
    slogan: "우리 아이들에게 맑은 공기를", 
    imageUrl: "https://picsum.photos/200/200?random=4",
    age: 39,
    job: "환경 운동가",
    career: ["현) 에코지킴이 사무국장", "전) 환경전문기자", "도심 숲 조성 프로젝트 리더"],
    promises: ["도심 녹지 비율 20% 달성", "플라스틱 제로 마켓 지원", "자전거 전용 도로 정비"]
  }
];

// Helper to generate trend data
const getTrend = (a: number, b: number, c: number) => [
  { month: '1월', A: a - 2, B: b + 1, C: c + 1 },
  { month: '2월', A: a - 1, B: b, C: c + 1 },
  { month: '3월', A: a, B: b, C: c },
];

export const MOCK_REGIONAL_DATA: CityData[] = [
  // --- 수도권 ---
  {
    id: "seoul",
    name: "서울특별시",
    districts: [
      {
        regionName: "종로구",
        turnout: 68.5,
        candidates: [
          { 
            number: 1, party: "A당", name: "김대한", slogan: "경제 1번지 종로의 부활", color: "#3b82f6",
            age: 58, job: "현직 국회의원", imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
            career: ["전) 기획재정부 차관", "제21대 종로구 국회의원", "여의도연구원 부원장"],
            promises: ["종로구 투기과열지구 해제 추진", "광화문 광장 주변 상권 활성화", "GTX-A 노선 조기 개통 지원"]
          },
          { 
            number: 2, party: "B당", name: "이민국", slogan: "따뜻한 복지, 행복한 종로", color: "#ef4444",
            age: 45, job: "인권 변호사", imageUrl: "https://randomuser.me/api/portraits/men/45.jpg",
            career: ["전) 서울시 인권위원", "민주사회를 위한 변호사모임", "종로구 마을공동체 자문위원"],
            promises: ["종로형 공공 산후조리원 설립", "전통시장 현대화 및 주차장 확충", "1인 가구 지원 센터 확대"]
          },
          { 
            number: 3, party: "C당", name: "박미래", slogan: "청년이 사는 도시", color: "#eab308",
            age: 34, job: "청년 활동가", imageUrl: "https://randomuser.me/api/portraits/women/65.jpg",
            career: ["현) 청년유니온 위원장", "대통령직속 청년위원회 위원", "소셜벤처 창업가"],
            promises: ["청년 월세 지원 대상 확대", "대학가 공유 기숙사 건립", "문화 예술 창작 공간 지원"]
          },
        ],
        generationData: [{ name: '20대', value: 15 }, { name: '30대', value: 20 }, { name: '40대', value: 25 }, { name: '50대', value: 22 }, { name: '60대+', value: 18 }],
        partySupportData: [{ name: '김대한(A당)', value: 35 }, { name: '이민국(B당)', value: 40 }, { name: '박미래(C당)', value: 15 }, { name: '기타', value: 10 }],
        trendData: getTrend(35, 40, 15),
        insight: "전통적 정치 1번지. 중도층의 표심이 당락을 좌우하는 격전지입니다."
      },
      {
        regionName: "강남구 갑",
        turnout: 72.1,
        candidates: [
          { 
            number: 1, party: "A당", name: "최경제", slogan: "세금 걱정 없는 강남", color: "#3b82f6",
            age: 62, job: "경제학 교수", imageUrl: "https://randomuser.me/api/portraits/men/11.jpg",
            career: ["현) OO대학교 경제학과 교수", "전) 한국은행 금융통화위원", "세금바로쓰기 운동본부 대표"],
            promises: ["종합부동산세 완화 입법 추진", "재건축 초과이익 환수제 폐지", "영동대로 지하개발 조속 완공"]
          },
          { 
            number: 2, party: "B당", name: "정교육", slogan: "교육의 중심, 품격있는 강남", color: "#ef4444",
            age: 51, job: "교육 전문가", imageUrl: "https://randomuser.me/api/portraits/women/22.jpg",
            career: ["전) 서울시 교육감 정책보좌관", "교육평등 학부모회 대표", "EBS 입시 분석 위원"],
            promises: ["공교육 질적 향상 프로그램 도입", "안심 등하굣길 CCTV 전면 교체", "강남구 평생학습관 건립"]
          },
        ],
        generationData: [{ name: '20대', value: 18 }, { name: '30대', value: 25 }, { name: '40대', value: 28 }, { name: '50대', value: 15 }, { name: '60대+', value: 14 }],
        partySupportData: [{ name: '최경제(A당)', value: 55 }, { name: '정교육(B당)', value: 35 }, { name: '기타', value: 10 }],
        trendData: getTrend(55, 35, 10),
        insight: "부동산 이슈 민감도가 전국에서 가장 높으며 보수세가 강한 지역입니다."
      },
      {
        regionName: "마포구 을",
        turnout: 70.2,
        candidates: [
          { 
             number: 1, party: "A당", name: "홍문화", slogan: "K-컬쳐의 중심 마포", color: "#3b82f6",
             age: 48, job: "문화 기획자", imageUrl: "https://randomuser.me/api/portraits/women/33.jpg",
             career: ["현) 마포문화재단 이사", "홍대 걷고싶은거리 상인회 자문", "전) 문화체육관광부 정책자문위원"],
             promises: ["홍대 관광특구 지정 추진", "문화예술인 창작지원금 확대", "망원한강공원 접근성 개선"]
          },
          { 
             number: 2, party: "B당", name: "강개발", slogan: "한강변 르네상스", color: "#ef4444",
             age: 55, job: "도시공학 박사", imageUrl: "https://randomuser.me/api/portraits/men/44.jpg",
             career: ["전) 서울주택도시공사 본부장", "대한국토도시계획학회 이사", "마포구 도시계획심의위원"],
             promises: ["상암 DMC 랜드마크 타워 건립", "성산시영아파트 재건축 신속 추진", "강변북로 지하화 사업 유치"]
          },
        ],
        generationData: [{ name: '20대', value: 30 }, { name: '30대', value: 25 }, { name: '40대', value: 20 }, { name: '50대', value: 15 }, { name: '60대+', value: 10 }],
        partySupportData: [{ name: '홍문화(A당)', value: 42 }, { name: '강개발(B당)', value: 43 }, { name: '기타', value: 15 }],
        trendData: getTrend(42, 43, 15),
        insight: "2030 청년 인구 비중이 높아 진보 성향이 강했으나 최근 개발 이슈로 혼전 양상입니다."
      }
    ]
  },
  {
    id: "gyeonggi",
    name: "경기도",
    districts: [
      {
        regionName: "수원시 갑",
        turnout: 64.3,
        candidates: [
          { 
            number: 1, party: "A당", name: "이반도", slogan: "반도체 클러스터 완성", color: "#3b82f6",
            age: 53, job: "기업인",
            career: ["전) S전자 반도체사업부 상무", "수원 상공회의소 부회장"],
            promises: ["수원 북부 첨단산업단지 조성", "동탄-인덕원선 조기 완공", "영동고속도로 지하화 추진"]
          },
          { 
            number: 2, party: "B당", name: "박교통", slogan: "GTX 조기 착공", color: "#ef4444",
            age: 49, job: "교통 전문가",
            career: ["현) 경기도 교통정책 자문위원", "전) 한국교통연구원 연구위원"],
            promises: ["GTX-C 노선 착공 및 역사 신설", "시내버스 준공영제 전면 확대", "수원 트램 도입"]
          },
        ],
        generationData: [{ name: '20대', value: 20 }, { name: '30대', value: 25 }, { name: '40대', value: 25 }, { name: '50대', value: 18 }, { name: '60대+', value: 12 }],
        partySupportData: [{ name: '이반도(A당)', value: 48 }, { name: '박교통(B당)', value: 45 }, { name: '기타', value: 7 }],
        trendData: getTrend(48, 45, 7),
        insight: "경기도 정치 1번지. 교통망 확충이 최대 관심사입니다."
      },
      {
        regionName: "성남시 분당구",
        turnout: 76.5,
        candidates: [
          { number: 1, party: "A당", name: "김판교", slogan: "IT 특별시 도약", color: "#3b82f6", age: 44, job: "IT 전문가", career: ["전) 카카오 부사장", "판교 테크노밸리 협의회장"], promises: ["판교 AI 연구센터 유치", "분당 트램 도입", "노후 아파트 재건축 특별법 적용"] },
          { number: 2, party: "B당", name: "이재건", slogan: "1기 신도시 재건축 선도", color: "#ef4444", age: 59, job: "건축사", career: ["대한건축사협회 이사", "성남시 도시재생 위원"], promises: ["재건축 안전진단 면제 추진", "용적률 500% 상향 조정", "분당-수서 도로 공원화 구간 연장"] },
        ],
        generationData: [{ name: '20대', value: 15 }, { name: '30대', value: 22 }, { name: '40대', value: 28 }, { name: '50대', value: 20 }, { name: '60대+', value: 15 }],
        partySupportData: [{ name: '김판교(A당)', value: 41 }, { name: '이재건(B당)', value: 52 }, { name: '기타', value: 7 }],
        trendData: getTrend(41, 52, 7),
        insight: "고소득 전문직 종사자가 많으며 재건축 이슈가 표심을 가르고 있습니다."
      }
    ]
  },
  {
    id: "incheon",
    name: "인천광역시",
    districts: [
      {
        regionName: "계양구 을",
        turnout: 62.1,
        candidates: [
          { 
            number: 1, party: "A당", name: "송대표", slogan: "대한민국의 미래", color: "#3b82f6",
            age: 60, job: "정당 대표", imageUrl: "https://randomuser.me/api/portraits/men/50.jpg",
            career: ["제21대 국회의원", "전) A당 원내대표", "전) 인천시장"],
            promises: ["계양 테크노밸리 성공적 완공", "서울 지하철 2호선 청라 연장", "노후 저층 주거지 개선 사업"]
          },
          { 
            number: 2, party: "B당", name: "원장관", slogan: "계양을 새롭게", color: "#ef4444",
            age: 59, job: "전 장관", imageUrl: "https://randomuser.me/api/portraits/men/55.jpg",
            career: ["전) 국토교통부 장관", "전) 제주도지사", "3선 국회의원"],
            promises: ["계양역 복합환승센터 건립", "그린벨트 해제 및 산업단지 조성", "교육특구 지정 추진"]
          },
        ],
        generationData: [{ name: '20대', value: 18 }, { name: '30대', value: 20 }, { name: '40대', value: 24 }, { name: '50대', value: 22 }, { name: '60대+', value: 16 }],
        partySupportData: [{ name: '송대표(A당)', value: 51 }, { name: '원장관(B당)', value: 44 }, { name: '기타', value: 5 }],
        trendData: getTrend(51, 44, 5),
        insight: "전국적 관심이 집중된 '미니 대선'급 선거구입니다."
      }
    ]
  },
  // --- 경상권 ---
  {
    id: "busan",
    name: "부산광역시",
    districts: [
      {
        regionName: "해운대구 갑",
        turnout: 65.4,
        candidates: [
          { number: 1, party: "A당", name: "강바다", slogan: "국제 관광 도시 도약", color: "#3b82f6", age: 50, job: "관광 전문가", career: ["부산관광공사 본부장"], promises: ["해운대 글로벌 관광특구 육성", "센텀2지구 첨단산업단지 조성"] },
          { number: 2, party: "B당", name: "조해운", slogan: "교통 지옥 해소", color: "#ef4444", age: 55, job: "교통 공학자", career: ["부산대 도시공학과 교수"], promises: ["해운대 터널 조기 개통", "광안대교 접속도로 입체화"] },
        ],
        generationData: [{ name: '20대', value: 12 }, { name: '30대', value: 18 }, { name: '40대', value: 30 }, { name: '50대', value: 25 }, { name: '60대+', value: 15 }],
        partySupportData: [{ name: '강바다(A당)', value: 42 }, { name: '조해운(B당)', value: 48 }, { name: '기타', value: 10 }],
        trendData: getTrend(42, 48, 10),
        insight: "부산의 강남. 보수세가 강하지만 최근 젊은 층 유입으로 변화가 감지됩니다."
      },
      {
        regionName: "사상구",
        turnout: 61.2,
        candidates: [
          { 
             number: 1, party: "A당", name: "배공단", slogan: "첨단 산업단지 변신", color: "#3b82f6",
             age: 52, job: "노동 운동가", career: ["사상구 노동자 복지센터장", "부산 참여연대 운영위원"],
             promises: ["사상공단 스마트 밸리 전환", "낙동강 생태공원 정비", "노동자 복지회관 건립"]
          },
          { 
             number: 2, party: "B당", name: "장낙동", slogan: "낙동강의 기적", color: "#ef4444",
             age: 63, job: "정치인", career: ["3선 국회의원", "전) 부산시장"],
             promises: ["사상-해운대 고속도로 조기 착공", "서부산 의료원 건립", "구치소 이전 및 부지 개발"]
          },
        ],
        generationData: [{ name: '20대', value: 15 }, { name: '30대', value: 18 }, { name: '40대', value: 22 }, { name: '50대', value: 25 }, { name: '60대+', value: 20 }],
        partySupportData: [{ name: '배공단(A당)', value: 46 }, { name: '장낙동(B당)', value: 47 }, { name: '기타', value: 7 }],
        trendData: getTrend(46, 47, 7),
        insight: "전통적 공단 지역으로 노동계 표심과 토박이 보수 표심이 충돌하는 곳입니다."
      }
    ]
  },
  {
    id: "daegu",
    name: "대구광역시",
    districts: [
      {
        regionName: "수성구 갑",
        turnout: 69.8,
        candidates: [
          { number: 1, party: "A당", name: "김수성", slogan: "대구의 자존심", color: "#3b82f6", age: 50, job: "변호사", career: ["민주사회를 위한 변호사 모임"], promises: ["대구 법원 검찰청 후적지 개발", "수성못 관광지 명소화"] },
          { number: 2, party: "B당", name: "주호영", slogan: "큰 인물 큰 정치", color: "#ef4444", age: 64, job: "국회의원", career: ["5선 국회의원", "전) B당 원내대표"], promises: ["대구 경북 통합신공항 조기 건설", "군부대 이전 및 후적지 개발", "로봇 산업 클러스터 조성"] },
        ],
        generationData: [{ name: '20대', value: 18 }, { name: '30대', value: 20 }, { name: '40대', value: 25 }, { name: '50대', value: 20 }, { name: '60대+', value: 17 }],
        partySupportData: [{ name: '김수성(A당)', value: 30 }, { name: '주호영(B당)', value: 65 }, { name: '기타', value: 5 }],
        trendData: getTrend(30, 65, 5),
        insight: "보수의 심장. 여당의 압도적 지지가 유지되고 있는 지역입니다."
      }
    ]
  },
  {
    id: "gyeongnam",
    name: "경상남도",
    districts: [
      {
        regionName: "김해시 을",
        turnout: 63.5,
        candidates: [
          { number: 1, party: "A당", name: "김노무", slogan: "사람 사는 세상", color: "#3b82f6", age: 56, job: "국회의원", career: ["재선 국회의원"], promises: ["부울경 메가시티 중심도시 육성", "비음산 터널 개통"] },
          { number: 2, party: "B당", name: "박가야", slogan: "가야 왕도 복원", color: "#ef4444", age: 52, job: "전) 시의원", career: ["김해시의회 의장"], promises: ["가야 역사 문화 단지 조성", "김해 공항 소음 피해 보상 확대"] },
        ],
        generationData: [{ name: '20대', value: 15 }, { name: '30대', value: 25 }, { name: '40대', value: 28 }, { name: '50대', value: 20 }, { name: '60대+', value: 12 }],
        partySupportData: [{ name: '김노무(A당)', value: 52 }, { name: '박가야(B당)', value: 40 }, { name: '기타', value: 8 }],
        trendData: getTrend(52, 40, 8),
        insight: "경남의 '낙동강 벨트' 핵심 지역으로 진보 성향이 비교적 강합니다."
      }
    ]
  },
  {
    id: "gyeongbuk",
    name: "경상북도",
    districts: [
      {
        regionName: "포항시 북구",
        turnout: 62.1,
        candidates: [
          { number: 1, party: "A당", name: "오영일", slogan: "영일만의 기적", color: "#3b82f6", age: 48, job: "시민단체 대표", career: ["포항 환경 운동 연합"], promises: ["포항 지진 피해 배상 현실화", "친환경 에너지 도시 전환"] },
          { number: 2, party: "B당", name: "김제철", slogan: "철강 도시의 재도약", color: "#ef4444", age: 65, job: "국회의원", career: ["3선 국회의원"], promises: ["영일만 대교 건설", "포스텍 의대 유치", "바이오 헬스 산업 육성"] },
        ],
        generationData: [{ name: '20대', value: 12 }, { name: '30대', value: 15 }, { name: '40대', value: 20 }, { name: '50대', value: 25 }, { name: '60대+', value: 28 }],
        partySupportData: [{ name: '오영일(A당)', value: 25 }, { name: '김제철(B당)', value: 70 }, { name: '기타', value: 5 }],
        trendData: getTrend(25, 70, 5),
        insight: "전통적 산업 도시이자 보수 텃밭입니다."
      }
    ]
  },
  {
    id: "ulsan",
    name: "울산광역시",
    districts: [
      {
        regionName: "북구",
        turnout: 65.2,
        candidates: [
          { number: 1, party: "A당", name: "이노동", slogan: "노동자가 주인인 세상", color: "#3b82f6", age: 50, job: "노동조합원", career: ["현대차 노조 위원장 역임"], promises: ["비정규직 철폐", "노동 이사제 도입"] },
          { number: 2, party: "B당", name: "박산업", slogan: "산업 수도의 위상", color: "#ef4444", age: 58, job: "기업 임원 출신", career: ["울산 상공회의소 회장"], promises: ["미래 자동차 산업 클러스터", "규제 샌드박스 도입"] },
          { number: 3, party: "C당", name: "진보현", slogan: "진짜 노동 후보", color: "#eab308", age: 45, job: "진보 정당인", career: ["진보당 울산시당 위원장"], promises: ["주 4일제 시범 도입", "공공의료 확충"] },
        ],
        generationData: [{ name: '20대', value: 15 }, { name: '30대', value: 25 }, { name: '40대', value: 30 }, { name: '50대', value: 20 }, { name: '60대+', value: 10 }],
        partySupportData: [{ name: '이노동(A당)', value: 35 }, { name: '박산업(B당)', value: 40 }, { name: '진보현(C당)', value: 20 }, { name: '기타', value: 5 }],
        trendData: getTrend(35, 40, 20),
        insight: "노동계 표심의 향배가 승패를 가르는 전국 최대의 노동 강세 지역입니다."
      }
    ]
  },
  // --- 전라권 ---
  {
    id: "gwangju",
    name: "광주광역시",
    districts: [
      {
        regionName: "광산구 을",
        turnout: 64.1,
        candidates: [
          { number: 1, party: "A당", name: "민형배", slogan: "검찰 개혁 완수", color: "#3b82f6", age: 60, job: "국회의원", career: ["재선 국회의원", "전) 광산구청장"], promises: ["광주 군공항 이전 특별법 개정", "AI 중심 산업 융합 집적단지 조성"] },
          { number: 2, party: "B당", name: "안태욱", slogan: "광주의 새로운 선택", color: "#ef4444", age: 55, job: "정당인", career: ["B당 광산구을 당협위원장"], promises: ["광주 복합 쇼핑몰 유치", "호남 고속철도 2단계 조기 완공"] },
          { number: 3, party: "C당", name: "이낙연", slogan: "진짜 민주주의", color: "#16a34a", age: 71, job: "전 총리", career: ["제45대 국무총리", "5선 국회의원", "전) 전남도지사"], promises: ["광주 미래차 국가산단 조성", "호남권 메가시티 구축", "민주주의 성지 위상 강화"] },
        ],
        generationData: [{ name: '20대', value: 20 }, { name: '30대', value: 25 }, { name: '40대', value: 25 }, { name: '50대', value: 20 }, { name: '60대+', value: 10 }],
        partySupportData: [{ name: '민형배(A당)', value: 65 }, { name: '안태욱(B당)', value: 10 }, { name: '이낙연(C당)', value: 20 }, { name: '기타', value: 5 }],
        trendData: getTrend(65, 10, 20),
        insight: "민주당의 텃밭이나, 제3지대 후보의 득표율이 관건입니다."
      }
    ]
  },
  {
    id: "jeonbuk",
    name: "전북특별자치도",
    districts: [
      {
        regionName: "전주시 을",
        turnout: 60.5,
        candidates: [
          { number: 1, party: "A당", name: "강성희", slogan: "윤석열 정권 심판", color: "#eab308", age: 51, job: "국회의원", career: ["현) 국회의원", "전국택배노조 전북지부장"], promises: ["지역 공공은행 설립", "새만금 예산 복원"] },
          { number: 2, party: "B당", name: "정운천", slogan: "전북의 쌍발통", color: "#ef4444", age: 69, job: "국회의원", career: ["재선 국회의원", "전) 농림수산식품부 장관"], promises: ["전북 특별자치도법 내실화", "수소 산업 특화 단지 조성"] },
          { number: 3, party: "A당", name: "이성윤", slogan: "검찰 독재 종식", color: "#3b82f6", age: 61, job: "전 검사장", career: ["전) 서울중앙지검장", "전) 법무연수원장"], promises: ["전주 금융중심지 지정", "대한방직 부지 개발 공론화"] },
        ],
        generationData: [{ name: '20대', value: 18 }, { name: '30대', value: 20 }, { name: '40대', value: 22 }, { name: '50대', value: 22 }, { name: '60대+', value: 18 }],
        partySupportData: [{ name: '이성윤(A당)', value: 55 }, { name: '정운천(B당)', value: 15 }, { name: '강성희(C당)', value: 25 }, { name: '기타', value: 5 }],
        trendData: getTrend(55, 15, 25),
        insight: "전통적 야권 강세 지역으로 정권 심판론이 강하게 작용하고 있습니다."
      }
    ]
  },
   {
    id: "jeonnam",
    name: "전라남도",
    districts: [
      {
        regionName: "순천시",
        turnout: 66.2,
        candidates: [
          { number: 1, party: "A당", name: "김문수", slogan: "순천의 아들", color: "#3b82f6", age: 55, job: "시의원", career: ["순천시의회 의장"], promises: ["순천만 국가정원 고도화", "의대 유치"] },
          { number: 2, party: "B당", name: "이정현", slogan: "예산 폭탄", color: "#ef4444", age: 65, job: "전 대표", career: ["3선 국회의원", "전) B당 대표"], promises: ["순천 의대 및 대학병원 유치", "경전선 도심 우회"] },
        ],
        generationData: [{ name: '20대', value: 15 }, { name: '30대', value: 20 }, { name: '40대', value: 25 }, { name: '50대', value: 22 }, { name: '60대+', value: 18 }],
        partySupportData: [{ name: '김문수(A당)', value: 55 }, { name: '이정현(B당)', value: 40 }, { name: '기타', value: 5 }],
        trendData: getTrend(55, 40, 5),
        insight: "호남에서 보수 후보 당선 이력이 있는 지역으로 인물 경쟁력이 중요합니다."
      }
    ]
  },
  // --- 충청권 ---
  {
    id: "daejeon",
    name: "대전광역시",
    districts: [
      {
        regionName: "유성구 을",
        turnout: 68.9,
        candidates: [
          { number: 1, party: "A당", name: "황정아", slogan: "과학 수도 완성", color: "#3b82f6", age: 45, job: "과학자", career: ["한국천문연구원 책임연구원", "KAIST 겸직교수"], promises: ["R&D 예산 복원 및 법제화", "우주항공청 연구센터 유치"] },
          { number: 2, party: "B당", name: "이상민", slogan: "힘있는 5선", color: "#ef4444", age: 65, job: "국회의원", career: ["5선 국회의원", "국회 법사위원장"], promises: ["나노 반도체 국가산단 조성", "대전 교도소 이전"] },
        ],
        generationData: [{ name: '20대', value: 22 }, { name: '30대', value: 28 }, { name: '40대', value: 25 }, { name: '50대', value: 15 }, { name: '60대+', value: 10 }],
        partySupportData: [{ name: '황정아(A당)', value: 52 }, { name: '이상민(B당)', value: 42 }, { name: '기타', value: 6 }],
        trendData: getTrend(52, 42, 6),
        insight: "R&D 삭감 이슈 등으로 과학계 연구원 표심이 쏠려있는 스윙보터 지역입니다."
      }
    ]
  },
  {
    id: "sejong",
    name: "세종특별자치시",
    districts: [
      {
        regionName: "세종시 갑",
        turnout: 70.3,
        candidates: [
          { number: 1, party: "B당", name: "류제화", slogan: "행정수도 완성", color: "#ef4444", age: 40, job: "변호사", career: ["제20대 대통령직 인수위원회 위원"], promises: ["세종 의사당 조기 건립", "대통령 제2집무실 설치"] },
          { number: 2, party: "C당", name: "김종민", slogan: "노무현의 꿈", color: "#16a34a", age: 59, job: "국회의원", career: ["재선 국회의원", "전) 청와대 대변인"], promises: ["행정수도 개헌 추진", "세종형 교육 자유 특구"] },
        ],
        generationData: [{ name: '20대', value: 15 }, { name: '30대', value: 35 }, { name: '40대', value: 30 }, { name: '50대', value: 12 }, { name: '60대+', value: 8 }],
        partySupportData: [{ name: '김종민(C당)', value: 55 }, { name: '류제화(B당)', value: 40 }, { name: '기타', value: 5 }],
        trendData: getTrend(55, 40, 5),
        insight: "전국에서 가장 젊은 도시. 공무원 표심과 3040 부모 세대의 표심이 핵심입니다."
      }
    ]
  },
   {
    id: "chungnam",
    name: "충청남도",
    districts: [
      {
        regionName: "공주시·부여군·청양군",
        turnout: 65.8,
        candidates: [
          { 
             number: 1, party: "A당", name: "박수현", slogan: "진심을 다합니다", color: "#3b82f6",
             age: 59, job: "전) 청와대 수석", career: ["전) 청와대 국민소통수석", "제19대 국회의원"],
             promises: ["금강 국가정원 조성", "백제 문화권 관광벨트 구축", "농민 수당 확대"]
          },
          { 
             number: 2, party: "B당", name: "정진석", slogan: "충청의 큰 인물", color: "#ef4444",
             age: 63, job: "국회의원", career: ["5선 국회의원", "국회 부의장"],
             promises: ["충청권 메가시티 광역철도망 구축", "공주대 의대 설립", "부여·청양 일반산업단지 조성"]
          },
        ],
        generationData: [{ name: '20대', value: 10 }, { name: '30대', value: 15 }, { name: '40대', value: 20 }, { name: '50대', value: 25 }, { name: '60대+', value: 30 }],
        partySupportData: [{ name: '박수현(A당)', value: 48 }, { name: '정진석(B당)', value: 49 }, { name: '기타', value: 3 }],
        trendData: getTrend(48, 49, 3),
        insight: "매 선거마다 초접전을 벌이는 충청권 최대 라이벌 매치 지역입니다."
      }
    ]
  },
  {
    id: "chungbuk",
    name: "충청북도",
    districts: [
      {
        regionName: "청주시 상당구",
        turnout: 62.9,
        candidates: [
          { number: 1, party: "A당", name: "이강일", slogan: "상당의 세대교체", color: "#3b82f6", age: 50, job: "지역위원장", career: ["A당 청주상당구 지역위원장"], promises: ["청주 원도심 활성화", "재래시장 현대화"] },
          { number: 2, party: "B당", name: "서승우", slogan: "행정 전문가", color: "#ef4444", age: 55, job: "전) 부지사", career: ["전) 충청북도 행정부지사"], promises: ["청주 공항 활성화", "오송 바이오 밸리 지원"] },
        ],
        generationData: [{ name: '20대', value: 18 }, { name: '30대', value: 20 }, { name: '40대', value: 22 }, { name: '50대', value: 22 }, { name: '60대+', value: 18 }],
        partySupportData: [{ name: '이강일(A당)', value: 51 }, { name: '서승우(B당)', value: 45 }, { name: '기타', value: 4 }],
        trendData: getTrend(51, 45, 4),
        insight: "충북의 정치 1번지. 민심의 풍향계 역할을 하는 곳입니다."
      }
    ]
  },
  // --- 강원/제주 ---
  {
    id: "gangwon",
    name: "강원특별자치도",
    districts: [
      {
        regionName: "원주시 갑",
        turnout: 61.5,
        candidates: [
          { number: 1, party: "A당", name: "원창묵", slogan: "원주 발전의 적임자", color: "#3b82f6", age: 62, job: "전) 시장", career: ["3선 원주시장"], promises: ["원주 군부지 개발", "여주-원주 전철 조기 개통"] },
          { number: 2, party: "B당", name: "박정하", slogan: "힘있는 여당 대변인", color: "#ef4444", age: 56, job: "국회의원", career: ["현) 국회의원", "전) 청와대 대변인"], promises: ["반도체 클러스터 유치", "GTX-D 노선 원주 연장"] },
        ],
        generationData: [{ name: '20대', value: 18 }, { name: '30대', value: 20 }, { name: '40대', value: 22 }, { name: '50대', value: 22 }, { name: '60대+', value: 18 }],
        partySupportData: [{ name: '원창묵(A당)', value: 48 }, { name: '박정하(B당)', value: 48 }, { name: '기타', value: 4 }],
        trendData: getTrend(48, 48, 4),
        insight: "강원도의 스윙보터 지역으로 팽팽한 접전이 예상됩니다."
      }
    ]
  },
  {
    id: "jeju",
    name: "제주특별자치도",
    districts: [
      {
        regionName: "제주시 갑",
        turnout: 59.8,
        candidates: [
          { number: 1, party: "A당", name: "문대림", slogan: "제주 자존심", color: "#3b82f6", age: 58, job: "전) 이사장", career: ["전) JDC 이사장", "전) 청와대 제도개선비서관"], promises: ["제주 4.3 완전한 해결", "관광청 제주 유치", "제주형 기초자치단체 도입"] },
          { number: 2, party: "B당", name: "고광철", slogan: "제주의 새 바람", color: "#ef4444", age: 48, job: "보좌관", career: ["국회의원 보좌관"], promises: ["제주 제2공항 건설", "농수산물 물류비 지원"] },
        ],
        generationData: [{ name: '20대', value: 18 }, { name: '30대', value: 22 }, { name: '40대', value: 25 }, { name: '50대', value: 20 }, { name: '60대+', value: 15 }],
        partySupportData: [{ name: '문대림(A당)', value: 58 }, { name: '고광철(B당)', value: 35 }, { name: '기타', value: 7 }],
        trendData: getTrend(58, 35, 7),
        insight: "4.3 사건 등 지역 특수성이 강하며 전통적으로 민주당 강세 지역입니다."
      }
    ]
  }
];
