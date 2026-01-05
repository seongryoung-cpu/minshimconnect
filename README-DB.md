# 데이터베이스 설정 가이드

하드코딩된 데이터를 데이터베이스로 전환했습니다.

## 백엔드 서버 설정

### 1. 서버 디렉토리로 이동
```bash
cd server
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 데이터베이스 초기화
```bash
npm run init-db
```

### 4. 데이터 시딩
```bash
npm run seed
```

또는 전체 데이터 시딩:
```bash
node scripts/seed-full.js
```

### 5. 서버 실행
```bash
npm run dev
```

서버는 `http://localhost:3001`에서 실행됩니다.

## 프론트엔드 설정

### 1. 환경 변수 설정
프로젝트 루트에 `.env` 파일 생성:
```
VITE_API_URL=http://localhost:3001/api
```

### 2. 개발 서버 실행
```bash
npm run dev
```

## API 엔드포인트

- `GET /api/agendas` - 안건 목록
- `GET /api/agendas/:id` - 안건 상세
- `POST /api/votes/agenda` - 안건 투표
- `POST /api/comments` - 댓글 작성
- `POST /api/comments/:id/like` - 댓글 좋아요
- `GET /api/regional/all` - 전체 지역 데이터
- `GET /api/questions` - 질문 목록
- `POST /api/auth/login` - 로그인
- `POST /api/auth/signup` - 회원가입

## 데이터베이스 구조

- `users` - 사용자 정보
- `agendas` - 안건
- `comments` - 댓글
- `votes` - 투표
- `cities` - 시/도
- `districts` - 지역구
- `candidates` - 후보자
- `questions` - 질문

## 데모 계정

- 이메일: `demo@minshim.com`
- 비밀번호: `demo123`
