# 민심잇다 백엔드 서버

Node.js + Express + SQLite 기반 백엔드 API 서버입니다.

## 설치 및 실행

```bash
cd server
npm install
npm run init-db
npm run seed
npm run dev
```

서버는 `http://localhost:3001`에서 실행됩니다.

## API 엔드포인트

### 인증
- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/me` - 현재 사용자 정보
- `PUT /api/auth/me` - 사용자 정보 업데이트

### 안건
- `GET /api/agendas` - 안건 목록
- `GET /api/agendas/:id` - 안건 상세
- `POST /api/agendas` - 안건 생성 (관리자)

### 지역 데이터
- `GET /api/regional/cities` - 시/도 목록
- `GET /api/regional/cities/:cityId/districts` - 지역구 목록
- `GET /api/regional/districts/:districtId` - 지역구 상세
- `GET /api/regional/all` - 전체 지역 데이터

### 질문
- `GET /api/questions` - 질문 목록
- `GET /api/questions/:id` - 질문 상세

### 정치인
- `GET /api/politicians` - 정치인 목록
- `GET /api/politicians/:id` - 정치인 상세

### 댓글
- `GET /api/comments/agenda/:agendaId` - 안건 댓글 목록
- `POST /api/comments` - 댓글 작성
- `POST /api/comments/:id/like` - 댓글 좋아요

### 투표
- `POST /api/votes/agenda` - 안건 투표
- `POST /api/votes/regional` - 지역구 투표

## 데이터베이스

SQLite 데이터베이스 파일은 `db/minshim.db`에 생성됩니다.

## 환경 변수

`.env` 파일 생성 (선택사항):
```
PORT=3001
JWT_SECRET=your-secret-key-here
```
