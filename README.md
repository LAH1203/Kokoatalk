# Kokoatalk
### Chatting Web using node.js
#### with LAH1203(Frontend - UI, UX, View), hyeji1221(Backend - Server, DB)

### 목차
1. [구현 목록](#구현-목록)
    1. [로그인 및 로그아웃](#로그인-및-로그아웃)
    2. [회원가입](#회원가입)
    3. [친구 목록](#친구-목록)
    4. [친구 검색/추가/삭제](#친구-검색추가)
    5. [프로필](#프로필)
    6. [내 정보 수정](#내-정보-수정)
    7. [채팅](#채팅)
    8. [서버](#서버-생성)
    9. [데이터베이스](#데이터베이스)
    10. [기타](#기타)

## 구현 목록
### 로그인 및 로그아웃
  - 로그인 창 구현 ver1 - 이아현 (2020-12-30)
    + login_page.html, login.js
  - 회원가입 버튼 클릭시 회원가입 페이지로 넘어가는 기능 추가 ver2 - 이아현 (2021-01-04)
  - 로그인 성공/실패 페이지 및 링크 추가 ver3 - 이아현 (2021-01-24)
    + login_success.pug, login_fail.pug
  - 없는 유저 입력 시 알려주는 창 추가 ver3.1 - 이아현 (2021-02-06)
    + no_user.pug
  - 자동 로그인 기능 추가 ver4 - 이아현 (2021-02-06)
    + main.js, login.js에 구현
  - 로그아웃 ver1 - 이아현 (2021-02-09)
    + main.js
  - 자동 로그인 문구 추가 ver4.1 - 이아현 (2021-02-09)
    + 참고 : https://stackoverflow.com/questions/38295332/pug-jade-input-is-a-self-closing-element-input-but-contains-nested-conten

### 회원가입
  - 회원가입 창 구현 ver1 - 이아현 (2021-01-04)
    + signup_page.html
  - 회원가입 성공/실패 창 구현 ver2 - 이아현 (2021-01-04)
    + signup_success.html, signup_fail.html
  - 회원가입 조건 구현 ver3 - 이아현 (2021-01-16)
    + signup.js
  - 회원가입 조건 일부 변경 ver4 - 이아현 (2021-01-19)
  - 회원가입 성공/실패 페이지 및 링크 추가 ver5 - 이아현 (2021-01-24)
    + signup_success.pug, signup_fail.pug
  - 해당 유저가 이미 존재할 경우 알려주는 창 추가 ver6 - 이아현 (2021-02-06)
    + already_user.pug
  - 회원가입 시 introduction 항목 추가 ver7 - 이아현 (2021-02-09)

### 친구 목록
  - 친구 목록 페이지 샘플 코드 작성 ver1 - 이아현 (2021-01-16)
    + friend_list_page.html
  - 친구 이름 배열과 연결되도록 코드 추가 ver2 - 이아현 (2021-01-18)
  - 친구 목록 ver3 - 이아현 (2021-02-06)
    + 친구 목록 스크롤뷰 추가(참고 : http://mwultong.blogspot.com/2006/06/html-css-div-scroll-bar.html)

### 친구 검색/추가/삭제
  - 친구 검색 및 추가 페이지 ver1 - 이아현 (2021-01-22)
    + add_friend_page.pug, search_add_user.js
  - 사용자 검색 알고리즘 ver1 - 이아현 (2021-01-22)
    + 완벽히 일치할 경우만 나오도록 구현
  - 사용자 검색 알고리즘 ver2 - 이아현 (2021-01-23)
    + 일부만 일치해도 검색 결과에 나오도록 구현
    + 단, 자음이나 모음만 일치해서는 안되고, 한 글자가 구성될 때 완전히 일치해야 함
  - 친구 검색 및 추가 페이지 ver2 - 이아현 (2021-01-23)
    + 친구 검색 및 추가 버튼 클릭 시 제대로 실행되지 않던 오류 해결
    + 답은 매개변수 처리 방식이었다. (참고: https://iamdaeyun.tistory.com/entry/pug-%EB%AC%B8%EB%B2%95-input-value)
  - 친구 추가 성공/실패 페이지 및 링크 추가 ver3 - 이아현 (2021-01-24)
    + add_friend_success.pug, add_friend_fail.pug
  - 유저 목록 ver4 - 이아현 (2021-02-06)
    + 유저 목록 스크롤뷰 추가(참고 : http://mwultong.blogspot.com/2006/06/html-css-div-scroll-bar.html)
  - 친구 삭제 구현 ver1 - 이아현 (2021-02-06)
    + user_page.pug
    + 경고 문구 및 링크 구현(DB X)

### 프로필
  - 프로필 ver1 - 이아현 (2021-02-06)
    + my_profile.pug, user_profile.pug
    + 쿼리로 내 이메일인 경우와 아닌 경우로 나누어 내 이메일인 경우에는 내 프로필, 아닌 경우에는 해당 이메일을 가진 친구 프로필로 가도록 만듦
    + 내 프로필에서는 내 정보 수정, 로그아웃 기능을 할 수 있도록 구현
    + 친구 프로필에서는 친구 삭제를 할 수 있도록 구현

### 내 정보 수정
  - 내 정보 수정 ver1 - 이아현 (2021-02-09)
    + update_my_info_page.pug
    + 세션에 저장한 사용자 이름과 본인 소개 문구를 가지고 자동으로 그 내용이 textbox에 나오고 이를 수정할 수 있도록 만듦
    + 로그인, 회원가입과 마찬가지로 post로 넘김

### 채팅


### 서버 생성
  - createServer ver1 - 임혜지 (2021-1-3)
    + 외장 모듈 설치(package-lock.json)

### 데이터베이스
  - 연결
    + 로그인
        - mysql 이용 로그인 구현 ver1 - 임혜지 (2021-01-03) 
    + 회원가입
        - mysql 이용 사용자 추가 기능 구현 ver1 - 임혜지 (2021-1-3)
        - info 항목 추가 ver2 - 임혜지 (2021.02.09)
    + 마이 페이지
        - 내 정보 수정 ver1 - 임혜지(2021.02.09)
    + 친구 목록
      - 친구 목록 테이블 만들기 ver1 - 임혜지 (2021.02.04)
  - 내부 구조
    + 본인 이메일, 비밀번호, 이름
    + 친구 목록

### 기타
  - CSS update ver1 (2020-12-30)
  - main.js에 html 코드 연결 - 이아현 (2021-01-16)
  - html 코드 pug로 변경 후 작성 - 이아현 (2021-01-16)
  - CSS update ver2 (2021-01-31)
    - CSS update ver2.0
    - CSS update ver2.1
  - 친구 목록, 추가, 내 프로필, 유저 프로필 등 본인 정보가 필요한 페이지에서는 로그인되어있지 않을 경우 자동으로 로그인으로 넘어가도록 구현 (2021-02-09)
    + 로그인 후 친구 목록 페이지로 자동으로 넘어감
    + 자동 로그인을 체크했을 시 사용자가 보기에는 바로 친구 목록 페이지로 넘어감
  - 에러 및 일부 조건 수정 - 이아현 (2021-02-10)

## 해야할 목록
### 혜지
  - 데이터베이스 구조 바꾸기 -> 친구 관계 테이블 만들기(내 이메일, 친구 이메일)
  - 친구목록, 사용자목록 연동하기 -> main.js
  - 친구 추가, 친구 삭제, 내 정보 수정, 유저 페이지 sql문 추가 -> main.js
    - 내 정보 수정 :white_check_mark:
  - 친구 추가 목록에서 본인 이름 지우기 -> main.js :white_check_mark:
  - 회원가입 시 intro 항목 mysql 코드 추가 :white_check_mark:
### 아현
  - css 꾸미기
