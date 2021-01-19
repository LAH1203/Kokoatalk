# Kokoatalk
### Chatting Web using node.js
#### with LAH1203(Frontend - UI, UX, View), hyeji1221(Backend - Server, DB)

### 목차
1. [구현 목록](#구현-목록)
  1. [로그인](#로그인)
  2. [회원가입](#회원가입)
  3. [친구 목록](#친구-목록)
  4. [친구 검색 및 추가](#친구-검색-및-추가)
  5. [채팅](#채팅)
  6. [서버](#서버-생성)
  7. [데이터베이스](#데이터베이스)
  8. [기타](#기타)
2. [다음 주까지 만들어야 할 목록](#다음주까지-해야할-목록)

## 구현 목록
### 로그인
  - 로그인 창 구현 ver1 - 이아현 (2020-12-30)
    + login_page.html, login.js, style.css
  - mysql 이용 로그인 구현 ver1 - 임혜지 (2021-1-3) 
  - 회원가입 버튼 클릭시 회원가입 페이지로 넘어가는 기능 추가 ver2 - 이아현 (2021-01-04)

### 회원가입
  - mysql 이용 사용자 추가 기능 구현 ver1 - 임혜지 (2021-1-3)
  - 회원가입 창 구현 ver1 - 이아현 (2021-01-04)
    + signup_page.html
  - 회원가입 성공/실패 창 구현 ver1 - 이아현 (2021-01-04)
    + signup_success.html, signup_fail.html
  - 회원가입 조건 구현 ver1 - 이아현 (2021-01-16)
    + signup.js
  - 회원가입 조건 일부 변경 ver2 - 이아현 (2021-01-19)

### 친구 목록
  - 친구 목록 페이지 샘플 코드 작성 ver1 - 이아현 (2021-01-16)
    + friend_list_page.html
  - 친구 이름 배열과 연결되도록 코드 추가 ver2 - 이아현 (2021-01-18)

### 친구 검색 및 추가

### 채팅

### 서버 생성
  - createServer ver1 - 임혜지 (2021-1-3)
    + 외장 모듈 설치(package-lock.json)

### 데이터베이스
  - 연결
    + 로그인
    + 회원가입
    + 친구 목록
  - 내부 구조
    + 본인 이메일, 비밀번호, 이름
    + 친구 목록

### 기타
  - main.js에 html 코드 연결
    + 이아현 (2021-01-16)
  - html 코드 pug로 변경 후 작성 - 이아현 (2021-01-16)

## 다음주까지 해야할 목록
### 혜지
- 로그인과 회원가입 firebase와 연결하기
- 파이어베이스에 친구 목록 항목 추가
### 아현
- 친구 검색 및 추가 만들기
