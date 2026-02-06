# KBO NOTE Mock Server

KBO NOTE 서비스 개발을 위한 Mock API 서버입니다.

## 기술 스택

- Node.js
- Express.js
- CORS

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 서버 실행

```bash
# 일반 실행
npm start

# 개발 모드 (nodemon)
npm run dev
```

서버는 기본적으로 `http://localhost:3000` 에서 실행됩니다.

## API 엔드포인트

모든 API는 Authorization 헤더가 필요합니다:
```
Authorization: Bearer {JWT_ACCESS_TOKEN}
```

### 1. 피드 조회

QR을 찍었을 때 나오는 랜딩 페이지 화면 내용

**Endpoint:** `GET /api/players/{player_id}/feeds`

**Parameters:**
- Path: `player_id` (예: 251)
- Query:
  - `cursor` (optional): 페이지네이션 커서
  - `size` (optional, default: 5): 페이지 크기

**Example:**
```bash
curl -X GET "http://localhost:3000/api/players/251/feeds?cursor=eyJjcmVhdGVkQXQiOiIyMDI2LTAyLTA0VDEwOjExOjU4IiwiaWQiOjIwMH0=&size=5" \
  -H "Authorization: Bearer test_token"
```

**Response:**
```json
{
  "items": [
    {
      "content_id": 1024,
      "title": "6년만에 타격왕 복귀",
      "platform": "NAVER_NEWS",
      "representative_image_url": "https://cdn.example.com/contents/1024.jpg",
      "liked": true,
      "like_count": 234,
      "comment_count": 7,
      "published_at": "2026-02-05T09:12:00Z"
    }
  ],
  "has_next": true,
  "next_cursor": "eyJzY29yZSI6MzUsInB1Ymxpc2hlZF9hdCI6IjIwMjYtMDItMDVUMDk6MTI6MDBaIiwiY29udGVudF9pZCI6MTAyNH0="
}
```

### 2. 컨텐트 조회

피드를 클릭하면 나오는 상세화면 조회

**Endpoint:** `GET /api/contents/{content_id}`

**Parameters:**
- Path: `content_id` (예: 123)

**Example:**
```bash
curl -X GET "http://localhost:3000/api/contents/123" \
  -H "Authorization: Bearer test_token"
```

**Response:**
```json
{
  "id": 12345,
  "title": "역대 3번째 타격왕 등",
  "article_url": "https://news.site.com/articles/abc123",
  "representative_image_url": "https://cdn.xxx/main.jpg",
  "image_count": 3,
  "like_count": 234,
  "liked": true,
  "comment_count": 56,
  "published_at": "2026-02-04T09:00:00"
}
```

### 3. 댓글 조회

피드 상세화면의 댓글 조회

**Endpoint:** `GET /api/contents/{content_id}/comment`

**Parameters:**
- Path: `content_id` (예: 123)
- Query:
  - `cursor` (optional): 페이지네이션 커서
  - `size` (optional, default: 20): 페이지 크기
  - `sort` (optional, default: latest): 정렬 방식

**Example:**
```bash
curl -X GET "http://localhost:3000/api/contents/123/comment?size=20&sort=latest" \
  -H "Authorization: Bearer test_token"
```

**Response:**
```json
{
  "comments": [
    {
      "id": 201,
      "user_id": 11,
      "profile_image_url": "https://kbo.note/images/WQiOjIwMH0.png",
      "nickname": "골돌이포수88",
      "content": "드디어 우리 포수가 타격왕이라니ㅠ",
      "created_at": "2026-02-04T10:12:30"
    }
  ],
  "has_next": true,
  "next_cursor": "eyJjcmVhdGVkQXQiOiIyMDI2LTAyLTA0VDEwOjExOjU4IiwiaWQiOjIwMH0="
}
```

### 4. 콘텐츠 이미지 조회

이미지 슬라이드 조회

**Endpoint:** `GET /api/contents/{content_id}/images`

**Parameters:**
- Path: `content_id` (예: 123)

**Example:**
```bash
curl -X GET "http://localhost:3000/api/contents/123/images" \
  -H "Authorization: Bearer test_token"
```

**Response:**
```json
{
  "images": [
    {
      "id": 1,
      "image_url": "https://cdn.xxx/image1.jpg",
      "order": 0
    },
    {
      "id": 2,
      "image_url": "https://cdn.xxx/image2.jpg",
      "order": 1
    }
  ]
}
```

### 5. 좋아요 클릭

피드 좋아요 토글

**Endpoint:** `POST /api/contents/{content_id}/like`

**Parameters:**
- Path: `content_id` (예: 123)

**Example:**
```bash
curl -X POST "http://localhost:3000/api/contents/123/like" \
  -H "Authorization: Bearer test_token"
```

**Response:**
```json
{
  "content_id": 123,
  "liked": true,
  "like_count": 234
}
```

### 6. 댓글 작성

피드 댓글 작성

**Endpoint:** `POST /api/contents/{content_id}/comment`

**Parameters:**
- Path: `content_id` (예: 123)
- Body:
```json
{
  "comment": "너무 멋있다ㅠㅠ"
}
```

**Example:**
```bash
curl -X POST "http://localhost:3000/api/contents/123/comment" \
  -H "Authorization: Bearer test_token" \
  -H "Content-Type: application/json" \
  -d '{"comment":"너무 멋있다ㅠㅠ"}'
```

**Response:**
```json
{
  "comment_id": 456
}
```

## 프로젝트 구조

```
KBO-NOTE-Mock-Server/
├── server.js          # Express 서버 메인 파일
├── mockData.js        # Mock 데이터
├── package.json       # 프로젝트 설정
├── .gitignore        # Git 제외 파일
└── README.md         # 문서
```

## 주의사항

- 이 서버는 개발용 Mock 서버이며, 실제 데이터베이스를 사용하지 않습니다.
- 서버를 재시작하면 좋아요 및 댓글 작성 등의 변경사항이 초기화됩니다.
- Authorization 헤더는 형식만 체크하며, 실제 JWT 검증은 수행하지 않습니다.
