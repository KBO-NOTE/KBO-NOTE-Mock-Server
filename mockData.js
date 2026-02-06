// Mock 데이터
const feeds = [
  {
    content_id: 1024,
    title: "6년만에 타격왕 복귀",
    platform: "NAVER_NEWS",
    representative_image_url: "https://cdn.example.com/contents/1024.jpg",
    liked: true,
    like_count: 234,
    comment_count: 7,
    published_at: "2026-02-05T09:12:00Z"
  },
  {
    content_id: 1023,
    title: "역대 3번째 타격왕 등극",
    platform: "NAVER_NEWS",
    representative_image_url: "https://cdn.example.com/contents/1023.jpg",
    liked: false,
    like_count: 189,
    comment_count: 12,
    published_at: "2026-02-04T15:30:00Z"
  },
  {
    content_id: 1022,
    title: "포수 최초 타격왕 도전",
    platform: "NAVER_SPORTS",
    representative_image_url: "https://cdn.example.com/contents/1022.jpg",
    liked: true,
    like_count: 567,
    comment_count: 34,
    published_at: "2026-02-03T11:20:00Z"
  }
];

const contents = {
  123: {
    id: 12345,
    title: "역대 3번째 타격왕 등",
    article_url: "https://news.site.com/articles/abc123",
    representative_image_url: "https://cdn.xxx/main.jpg",
    image_count: 3,
    like_count: 234,
    liked: true,
    comment_count: 56,
    published_at: "2026-02-04T09:00:00"
  },
  1024: {
    id: 1024,
    title: "6년만에 타격왕 복귀",
    article_url: "https://news.site.com/articles/def456",
    representative_image_url: "https://cdn.example.com/contents/1024.jpg",
    image_count: 5,
    like_count: 234,
    liked: true,
    comment_count: 7,
    published_at: "2026-02-05T09:12:00Z"
  }
};

const comments = {
  123: [
    {
      id: 201,
      user_id: 11,
      profile_image_url: "https://kbo.note/images/WQiOjIwMH0.png",
      nickname: "골돌이포수88",
      content: "드디어 우리 포수가 타격왕이라니ㅠ",
      created_at: "2026-02-04T10:12:30"
    },
    {
      id: 200,
      user_id: 25,
      profile_image_url: "https://kbo.note/images/LTA0VDEwOjEx.png",
      nickname: "두린이23",
      content: "양의지 타격은 진짜 교과서지…",
      created_at: "2026-02-04T10:11:58"
    },
    {
      id: 199,
      user_id: 33,
      profile_image_url: "https://kbo.note/images/abc123.png",
      nickname: "야구덕후",
      content: "레전드 포수의 귀환!",
      created_at: "2026-02-04T10:05:22"
    }
  ]
};

const contentImages = {
  123: [
    {
      id: 1,
      image_url: "https://cdn.xxx/image1.jpg",
      order: 0
    },
    {
      id: 2,
      image_url: "https://cdn.xxx/image2.jpg",
      order: 1
    }
  ],
  1024: [
    {
      id: 3,
      image_url: "https://cdn.example.com/image1.jpg",
      order: 0
    },
    {
      id: 4,
      image_url: "https://cdn.example.com/image2.jpg",
      order: 1
    },
    {
      id: 5,
      image_url: "https://cdn.example.com/image3.jpg",
      order: 2
    }
  ]
};

// 좋아요 상태를 저장할 객체 (메모리 상에서 관리)
const likeStates = {};

// 댓글 ID 카운터
let commentIdCounter = 300;

module.exports = {
  feeds,
  contents,
  comments,
  contentImages,
  likeStates,
  commentIdCounter
};
