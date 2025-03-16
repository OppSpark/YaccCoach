# 약코치 백엔드입니다.

## 사용 API
- 공공데이터 포털 식품의약품안전처_의약품개요정보(e약은요)
  - https://www.data.go.kr/iim/api/selectAPIAcountView.do
- OpenAI API gpt-4o
  - https://platform.openai.com/logs  


## 백엔드 서비스 실행 방법

1. 현재 폴더에 .emv 파일을 생성 후 해당 내용을 입력합니다.
```
OPENAI_API_KEY="OpenAI API 키를 입력"
OPENAPI_API_KEY="OpenAPI 키를 입력"
```
3. requirements.txt 에 있는 npm 을 설치합니다.
4. 터미널에 node index를 명령하여 웹서버를 실행시킵니다.
