# 약코치 (YaccCoach)

**약코치**는 응급 상황에서 사용자가 자연어로 증상을 입력하면 즉시 복용 가능한 약물을 추천하고 가까운 약국 정보를 제공하는 웹 애플리케이션입니다.

## 개발 서버 및 시연하기!
### 프론트엔드 (react.js)
- http://dev.yacccoach.oppspark.net/


## 프로젝트 개요

### 주요 기능
- **증상 입력 및 분석**: 사용자가 자연어로 입력한 증상을 OpenAI API를 통해 분석합니다.
- **약물 추천**: 국내에서 판매되는 일반 의약품 중 해당 증상에 맞는 약을 추천합니다.
- **약물 정보 제공**: 추천된 약물의 주요 성분, 복용 방법, 주의 사항을 제공합니다.
- **약국 위치 정보 제공**: GPS를 활용해 현재 영업 중인 가까운 약국을 필터링해 지도에 표시합니다.
- **추가 기능**: 실시간 약국 재고 데이터 활용 (가능한 경우), 원클릭 전화 연결 기능, 응급실 정보 제공 기능이 포함됩니다.

## 프로젝트 목표
- **신속한 약물 추천**: 사용자가 자신의 증상을 간단히 입력하면 즉시 적절한 의약품을 추천받을 수 있습니다.
- **위치 기반 약국 정보 제공**: 사용자 위치를 기반으로 가까운 영업 중인 약국을 안내하여 신속한 약물 구매를 돕습니다.
- **실시간 재고 정보 제공 (가능한 경우)**: 필요한 약이 있는 약국을 빠르게 찾을 수 있도록 실시간 데이터를 제공합니다.
- **직관적인 UI/UX**: 누구나 빠르게 정보를 확인할 수 있는 사용자 중심의 인터페이스 설계를 지향합니다.
- **공공 데이터 활용**: 신뢰할 수 있는 공공 데이터를 적극 활용하여 안전하고 유용한 서비스를 제공합니다.

## 사용 기술

### 프레임워크 및 라이브러리
- **프론트엔드**: React.js
- **백엔드**: Node.js
- **API 연동**: OpenAI API, 공공 데이터 포털 약국 API, 네이버/구글 지도 API

### 데이터베이스
- **MySQL 8.0**

### 개발 도구 및 소프트웨어
- **GitHub**, **Postman**, **VSCode**

### 개발 환경
- **Ubuntu 22.04**, **MacOS**

### 서버 환경
- **AWS (EC2)**, **Oracle Cloud**, **Nginx**

## 설치 방법

1. 이 저장소를 클론합니다.
   ```bash
   git clone https://github.com/OppSpark/YaccCoach.git
   ```

2. 프로젝트 디렉토리로 이동합니다.
   ```bash
   cd YaccCoach
   ```

3. 필요한 종속성을 설치합니다.
   ```bash
   npm install
   ```

4. 환경 변수 파일 (`.env`)을 설정합니다.

5. 애플리케이션을 실행합니다.
   ```bash
   npm start
   node index
   ```

6. 브라우저에서 `http://localhost:4000`으로 접속하여 서비스를 이용할 수 있습니다.

## 사용 방법
1. 웹 브라우저에서 **약코치**에 접속합니다.
2. 증상을 자연어로 입력한 후 '추천 받기' 버튼을 클릭합니다.
3. 추천된 약물 정보 및 인근 약국 정보를 확인합니다.


