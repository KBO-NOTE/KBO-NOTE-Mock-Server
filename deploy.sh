#!/bin/bash

# KBO NOTE Mock Server 배포 스크립트
# 사용법: ./deploy.sh

set -e  # 에러 발생 시 스크립트 중단

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 설정
DEPLOY_DIR="/home/kbo-note/mock-server"
APP_NAME="kbo-mock-server"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  KBO NOTE Mock Server 배포 시작${NC}"
echo -e "${GREEN}========================================${NC}"

# 1. 배포 디렉토리로 이동
echo -e "\n${YELLOW}[1/5] 배포 디렉토리로 이동...${NC}"
cd $DEPLOY_DIR/current

# 2. 의존성 설치
echo -e "\n${YELLOW}[2/5] 의존성 설치 중...${NC}"
npm ci --production

# 3. PM2 설치 확인
echo -e "\n${YELLOW}[3/5] PM2 확인 중...${NC}"
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}PM2가 설치되어 있지 않습니다. 설치 중...${NC}"
    npm install -g pm2
fi

# 4. 기존 프로세스 중지
echo -e "\n${YELLOW}[4/5] 기존 프로세스 중지 중...${NC}"
pm2 delete $APP_NAME 2>/dev/null || echo "기존 프로세스가 없습니다."

# 5. 애플리케이션 시작
echo -e "\n${YELLOW}[5/5] 애플리케이션 시작 중...${NC}"
pm2 start ecosystem.config.js

# PM2 프로세스 목록 저장
pm2 save

# 상태 확인
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}  배포 완료!${NC}"
echo -e "${GREEN}========================================${NC}"
pm2 status

echo -e "\n${GREEN}✅ 배포가 성공적으로 완료되었습니다!${NC}"
