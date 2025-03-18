
# interface 

## 인증 / 로그인 / 회원가입

### 로그인
### /signIn
  - req
    email : string
    password : string
  - res
  - 성공
    code : "SU",
    message : "Success."
  - 로그인 실패 /(ID ,PW 불일치)
    code : "ER1"
    message : "NoUser"
  - 세선 에러
    code : "ER2"
    message : " "
  -  DB 에러
    code : "ER10"
    message : "DbError"

### 로그아웃
### /logOut
  - req

  - res
    code : "SU",
    message : "Success."
  
    error


### 회원가입
### /signUp
- req
  userId : *string
  username : *string
  email : string
  password : *string
  tel_number : string
  address : string
  agreed_personal : int
- res
- 성공
  code : "SU",
  message : "register_success."
- ID, PW, 글자수 불일치
  code : "ER2"
  message : "UnMatchData"
- 이미 있는 ID
  code : "ER1"
  message : "already_exist"
- 데이터 길이 초과
  code : "ER3"
  message : "data_too_long"
- 잘못된 값
  code : "ER4"
  message : "truncated_wrong_value"
- 기본값 누락
  code : "ER5"
  message : "no_default_for_field"
- NULL 이 들어오면값 오류
  code : "ER6"
  message : "bad_null_error"
- DB 에러
  code : "ER10"
  message : "DbError"
- 기타 오류
  code : "ER7"
  message : "register_fail"

  //회원 가입 같은 경우 

  PW 는 8자리 이상이며 특수문자 !@#$%^&* 가 하나 이상 들어가야함
  이메일 같은 경우 이메일 형식에 맞게 받아오면됨



### 사용자 질병 츠가
### /disease
- req
  user_id : *string
  disease_name *string
- res
- 성공
  code : "SU",
  message : "Success."
  {"disease" : "내용"}
- DB에러
  code : "ER10"
  message : "DbError"







    code : ""
    message : ""