const express = require("express");
const cors = require("cors");
const mockData = require("./mockData");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Authorization 체크 미들웨어
const checkAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Missing or invalid token" });
  }
  next();
};

// 1. 피드 조회 API
app.get("/api/players/:player_id/feeds", checkAuth, (req, res) => {
  const { player_id } = req.params;
  const { cursor, size = 5 } = req.query;

  const pageSize = parseInt(size);

  // 1. 커서가 없으면 0번 인덱스부터, 있으면 커서값을 숫자로 변환
  // (실제 서비스에서는 복잡한 디코딩을 하겠지만, 목 서버에서는 인덱스로 처리하는 게 편합니다)
  const startIndex = cursor ? parseInt(cursor) : 0;
  const endIndex = startIndex + pageSize;

  // 2. 해당 범위만큼 데이터 슬라이스
  const items = mockData.feeds.slice(startIndex, endIndex);

  // 3. 다음 데이터가 있는지 확인
  const hasNext = endIndex < mockData.feeds.length;

  // 4. 다음 커서 결정 (더 이상 데이터가 없으면 null)
  const nextCursor = hasNext ? endIndex.toString() : null;

  console.log(
    `[GET] /api/players/${player_id}/feeds - range: [${startIndex} ~ ${endIndex}], nextCursor: ${nextCursor}`,
  );

  res.json({
    items: items,
    has_next: hasNext,
    next_cursor: nextCursor,
  });
});

// 2. 컨텐트 조회 API
app.get("/api/contents/:content_id", checkAuth, (req, res) => {
  const { content_id } = req.params;

  console.log(`[GET] /api/contents/${content_id}`);

  const content = mockData.contents[content_id];

  if (!content) {
    return res.status(404).json({ error: "Content not found" });
  }

  res.json(content);
});

// 3. 댓글 조회 API
app.get("/api/contents/:content_id/comment", checkAuth, (req, res) => {
  const { content_id } = req.params;
  const { cursor, size = 20, sort = "latest" } = req.query;

  console.log(
    `[GET] /api/contents/${content_id}/comment - cursor: ${cursor}, size: ${size}, sort: ${sort}`,
  );

  const comments = mockData.comments[content_id] || [];
  const pageSize = parseInt(size);

  // sort에 따라 정렬 (latest는 최신순)
  let sortedComments = [...comments];
  if (sort === "latest") {
    sortedComments.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at),
    );
  }

  const items = sortedComments.slice(0, pageSize);

  res.json({
    comments: items,
    has_next: sortedComments.length > pageSize,
    next_cursor: "eyJjcmVhdGVkQXQiOiIyMDI2LTAyLTA0VDEwOjExOjU4IiwiaWQiOjIwMH0=",
  });
});

// 4. 콘텐츠 이미지 조회 API
app.get("/api/contents/:content_id/images", checkAuth, (req, res) => {
  const { content_id } = req.params;

  console.log(`[GET] /api/contents/${content_id}/images`);

  const images = mockData.contentImages[content_id] || [];

  res.json({
    images: images,
  });
});

// 5. 좋아요 클릭 API
app.post("/api/contents/:content_id/like", checkAuth, (req, res) => {
  const { content_id } = req.params;

  console.log(`[POST] /api/contents/${content_id}/like`);

  // 현재 좋아요 상태 토글
  const currentState = mockData.likeStates[content_id] || {
    liked: false,
    like_count: 0,
  };
  const newLiked = !currentState.liked;
  const newCount = newLiked
    ? currentState.like_count + 1
    : currentState.like_count - 1;

  // 상태 저장
  mockData.likeStates[content_id] = {
    liked: newLiked,
    like_count: Math.max(0, newCount),
  };

  // 컨텐트에도 반영
  if (mockData.contents[content_id]) {
    mockData.contents[content_id].liked = newLiked;
    mockData.contents[content_id].like_count = Math.max(0, newCount);
  }

  res.json({
    content_id: parseInt(content_id),
    liked: newLiked,
    like_count: Math.max(0, newCount),
  });
});

// 6. 댓글 작성 API
app.post("/api/contents/:content_id/comment", checkAuth, (req, res) => {
  const { content_id } = req.params;
  const { comment } = req.body;

  console.log(
    `[POST] /api/contents/${content_id}/comment - comment: ${comment}`,
  );

  if (!comment || comment.trim() === "") {
    return res.status(400).json({ error: "Comment content is required" });
  }

  // 새 댓글 ID 생성
  const newCommentId = mockData.commentIdCounter++;

  // 댓글 목록에 추가
  if (!mockData.comments[content_id]) {
    mockData.comments[content_id] = [];
  }

  const newComment = {
    id: newCommentId,
    user_id: 999, // Mock user ID
    profile_image_url: "https://kbo.note/images/default.png",
    nickname: "테스트유저",
    content: comment,
    created_at: new Date().toISOString(),
  };

  mockData.comments[content_id].unshift(newComment);

  // 컨텐트의 댓글 수 증가
  if (mockData.contents[content_id]) {
    mockData.contents[content_id].comment_count++;
  }

  res.status(201).json({
    comment_id: newCommentId,
  });
});

// 7. 선수의 오늘 경기 현황 조회 API
app.get("/api/match/:player_id", checkAuth, (req, res) => {
  const { player_id } = req.params;

  console.log(`[GET] /api/match/${player_id}`);

  // mockData.matches에 데이터가 없으면 기본 데이터 반환
  const matchInfo = mockData.matches?.[player_id] || {
    date: "2026-02-05",
    match: {
      home: { team_id: "hanwha", team_name: "한화이글스" },
      away: { team_id: "hanwha", team_name: "한화이글스" },
      home_score: 7,
      away_score: 3,
      inning: "T4",
      status: "IN_PROGRESS",
    },
    highlight: {
      order: 1,
      total: 4,
      text: "안타(타점1) 삼진 땅볼 뜬공",
      has_audio: true,
    },
  };

  res.json(matchInfo);
});

// 8. 선수 상세 성적 조회 API
app.get("/api/stats/:player_id", checkAuth, (req, res) => {
  const { player_id } = req.params;

  console.log(`[GET] /api/stats/${player_id}`);

  // mockData.stats에 데이터가 없으면 기본 데이터 반환
  const playerStats = mockData.stats?.[player_id] || {
    season: 2025,
    player_type: "BATTER",
    summary: {
      batting_avg_rank: 1,
      war_rank: 4,
      hits_rank: 8,
      rbi_rank: 10,
      home_run_rank: 13,
    },
    metrics: {
      batting_avg: 0.337,
      home_runs: 20,
      hits: 153,
      rbi: 89,
      runs: 56,
      stolen_bases: 4,
      on_base_percentage: 0.406,
      ops: 0.939,
    },
  };

  res.json(playerStats);
});

// 루트 경로 업데이트
app.get("/", (req, res) => {
  res.json({
    message: "KBO NOTE Mock Server",
    version: "1.1.0",
    endpoints: [
      "GET /api/players/:player_id/feeds",
      "GET /api/contents/:content_id",
      "GET /api/contents/:content_id/comment",
      "GET /api/contents/:content_id/images",
      "POST /api/contents/:content_id/like",
      "POST /api/contents/:content_id/comment",
      "GET /api/match/:player_id", // 추가됨
      "GET /api/stats/:player_id", // 추가됨
    ],
  });
});

// 404 핸들러
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 Mock Server is running on http://localhost:${PORT}`);
  console.log(`📝 Available endpoints:`);
  console.log(`   GET  /api/players/:player_id/feeds`);
  console.log(`   GET  /api/contents/:content_id`);
  console.log(`   GET  /api/contents/:content_id/comment`);
  console.log(`   GET  /api/contents/:content_id/images`);
  console.log(`   POST /api/contents/:content_id/like`);
  console.log(`   POST /api/contents/:content_id/comment`);
});
