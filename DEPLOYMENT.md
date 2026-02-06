# 배포 가이드

KBO NOTE Mock Server를 GitHub Actions를 통해 자동으로 배포하는 방법을 안내합니다.

## 목차
1. [사전 준비](#사전-준비)
2. [GitHub Secrets 설정](#github-secrets-설정)
3. [자동 배포](#자동-배포)
4. [수동 배포](#수동-배포)
5. [서버 관리](#서버-관리)
6. [트러블슈팅](#트러블슈팅)

## 사전 준비

### 1. 서버 환경 요구사항

- **Node.js**: v18 이상
- **PM2**: 프로세스 관리자 (자동 설치됨)
- **SSH 접근**: 포트 1220

### 2. 서버 접속 정보

```
Host: 203.252.131.18
Port: 1220
User: kbonote
배포 경로: /home/kbo-note/mock-server
```

### 3. SSH 키 준비

배포에 사용할 SSH 개인 키 파일을 준비합니다.

```bash
# SSH 키 생성 (이미 있다면 생략)
ssh-keygen -t rsa -b 4096 -C "kbonote@deploy"

# 공개 키를 서버에 등록
ssh-copy-id -i ~/.ssh/id_rsa.pub -p 1220 kbonote@203.252.131.18
```

## GitHub Secrets 설정

GitHub 저장소의 Settings > Secrets and variables > Actions 에서 다음 Secrets를 추가합니다:

### 필수 Secrets

| Secret 이름 | 값 | 설명 |
|------------|-----|------|
| `SSH_HOST` | `203.252.131.18` | 서버 IP 주소 |
| `SSH_PORT` | `1220` | SSH 포트 |
| `SSH_USER` | `kbonote` | SSH 사용자명 |
| `SSH_PRIVATE_KEY` | `-----BEGIN OPENSSH PRIVATE KEY-----\n...` | SSH 개인 키 전체 내용 |

### SSH_PRIVATE_KEY 설정 방법

1. SSH 개인 키 파일 내용을 복사합니다:
```bash
cat ~/.ssh/id_rsa
```

2. 복사한 내용 전체를 GitHub Secrets의 `SSH_PRIVATE_KEY`에 붙여넣습니다.
   - `-----BEGIN OPENSSH PRIVATE KEY-----` 부터
   - `-----END OPENSSH PRIVATE KEY-----` 까지 모두 포함

## 자동 배포

### main 브랜치 push 시 자동 배포

```bash
# 코드 변경 후
git add .
git commit -m "feat: 새로운 기능 추가"
git push origin main
```

main 브랜치에 push하면 GitHub Actions가 자동으로 실행되어 서버에 배포됩니다.

### 배포 프로세스

1. ✅ 코드 체크아웃
2. ✅ Node.js 18 환경 설정
3. ✅ 의존성 설치
4. ✅ 배포 패키지 생성
5. ✅ SSH를 통해 서버 접속
6. ✅ 백업 생성
7. ✅ 파일 전송
8. ✅ PM2로 애플리케이션 재시작

### 배포 확인

GitHub Actions 페이지에서 배포 상태를 확인할 수 있습니다:
- Repository > Actions > Deploy to Server

## 수동 배포

### GitHub Actions에서 수동 트리거

1. Repository > Actions 이동
2. "Deploy to Server" 워크플로우 선택
3. "Run workflow" 버튼 클릭
4. 브랜치 선택 후 "Run workflow" 실행

### SSH로 직접 배포

서버에 직접 접속하여 배포하는 방법:

```bash
# 1. 서버 접속
ssh -i "개인 키 경로" kbonote@203.252.131.18 -p 1220

# 2. 배포 디렉토리로 이동
cd /home/kbo-note/mock-server/current

# 3. 최신 코드 pull (Git 사용 시)
git pull origin main

# 4. 의존성 설치
npm ci --production

# 5. PM2로 재시작
pm2 restart kbo-mock-server

# 또는 배포 스크립트 실행
./deploy.sh
```

## 서버 관리

### PM2 명령어

```bash
# 애플리케이션 상태 확인
pm2 status

# 로그 확인
pm2 logs kbo-mock-server

# 실시간 로그 보기
pm2 logs kbo-mock-server --lines 100

# 애플리케이션 재시작
pm2 restart kbo-mock-server

# 애플리케이션 중지
pm2 stop kbo-mock-server

# 애플리케이션 삭제
pm2 delete kbo-mock-server

# 모니터링
pm2 monit
```

### 로그 파일 위치

```
/home/kbo-note/mock-server/current/logs/
├── error.log      # 에러 로그
├── out.log        # 표준 출력 로그
└── combined.log   # 통합 로그
```

### 서비스 포트

- **기본 포트**: 3000
- **변경 방법**: `ecosystem.config.js`의 `PORT` 환경 변수 수정

## 환경 변수

필요한 경우 `.env` 파일을 서버에 생성하여 환경 변수를 설정할 수 있습니다:

```bash
# /home/kbo-note/mock-server/current/.env
PORT=3000
NODE_ENV=production
```

## 트러블슈팅

### 배포 실패 시

1. **GitHub Actions 로그 확인**
   - Actions 탭에서 실패한 워크플로우의 상세 로그 확인

2. **SSH 연결 실패**
   ```bash
   # 로컬에서 SSH 연결 테스트
   ssh -i "개인 키" kbonote@203.252.131.18 -p 1220
   ```
   - SSH 키가 올바르게 설정되었는지 확인
   - 서버의 방화벽 설정 확인

3. **권한 문제**
   ```bash
   # 배포 디렉토리 권한 확인
   ls -la /home/kbo-note/

   # 필요시 권한 수정
   chmod 755 /home/kbo-note/mock-server
   ```

4. **PM2 프로세스 확인**
   ```bash
   pm2 status
   pm2 logs kbo-mock-server --err
   ```

### 서버에 직접 접속이 필요한 경우

```bash
# SSH 접속
ssh -i "개인 키" kbonote@203.252.131.18 -p 1220

# 배포 디렉토리 확인
cd /home/kbo-note/mock-server
ls -la

# 현재 실행 중인 디렉토리
cd current

# 백업 디렉토리 (문제 발생 시 롤백)
cd backup
```

### 롤백 방법

배포 후 문제가 발생한 경우 백업으로 롤백:

```bash
# 서버 접속 후
cd /home/kbo-note/mock-server

# 현재 버전 삭제
rm -rf current

# 백업 버전으로 복원
mv backup current

# 애플리케이션 재시작
cd current
pm2 restart kbo-mock-server
```

## 배포 디렉토리 구조

```
/home/kbo-note/mock-server/
├── current/              # 현재 실행 중인 버전
│   ├── server.js
│   ├── mockData.js
│   ├── ecosystem.config.js
│   ├── package.json
│   ├── node_modules/
│   └── logs/
│       ├── error.log
│       ├── out.log
│       └── combined.log
└── backup/              # 이전 버전 백업
```

## 보안 주의사항

1. **SSH 개인 키는 절대 Git에 커밋하지 마세요**
2. **GitHub Secrets에만 보관하세요**
3. **환경 변수 파일(.env)도 Git에 포함하지 마세요**
4. **서버의 방화벽 설정을 확인하세요**

## 문의

배포 관련 문제가 발생하면 GitHub Issues에 등록해주세요.
