# KBO NOTE Mock Server

KBO NOTE 서비스 개발을 위한 Mock API 서버입니다.

## 기술 스택

- Node.js
- Express.js
- CORS

## 배포

이 프로젝트는 GitHub Actions를 통한 자동 배포를 지원합니다.

### 자동 배포 (GitHub Actions)

main 브랜치에 push하면 자동으로 서버에 배포됩니다.

### 수동 배포

GitHub Actions에서 "Run workflow" 버튼을 클릭하여 수동으로 배포할 수 있습니다.

## 프로젝트 구조

```
KBO-NOTE-Mock-Server/
├── .github/
│   └── workflows/
│       └── deploy.yml         # GitHub Actions 배포 워크플로우
├── server.js                  # Express 서버 메인 파일
├── mockData.js                # Mock 데이터
├── ecosystem.config.js        # PM2 설정 파일
├── deploy.sh                  # 배포 스크립트
├── package.json               # 프로젝트 설정
├── .gitignore                # Git 제외 파일
├── README.md                 # 프로젝트 문서
└── DEPLOYMENT.md             # 배포 가이드
```

## 주의사항

- 이 서버는 개발용 Mock 서버이며, 실제 데이터베이스를 사용하지 않습니다.
- 서버를 재시작하면 좋아요 및 댓글 작성 등의 변경사항이 초기화됩니다.
- Authorization 헤더는 형식만 체크하며, 실제 JWT 검증은 수행하지 않습니다.
