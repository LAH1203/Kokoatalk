var express = require('express');
var router = express.Router();

var user = firebase.auth().currentUser;
var name, email, photoUrl, uid, emailVerified;

if (user != null) {

  name = user.displayName;
  email = user.email;
  photoUrl = user.photoURL;
  emailVerified = user.emailVerified;
  uid = user.uid;  

}
function login() {
    // 로그인 시 입력된 정보로 DB에 확인한 후
    // DB 내에 해당 사람이 존재할 경우 로그인 성공, 아니면 실패로 해주세요!
    // 로그인이 성공했을 경우 /loginSuccess, 실패했을 경우 /loginFail로 이동하면 될 것 같습니당
    // 페이지 이동은 링크를 미리 만들어놨으므로 링크 이동 해주시면 됩니다.

    const form = document.login_form;
    const user_email = form.email.value;
    const user_password = form.password.value;

    // 이 부분에 사용자가 입력한 이메일과 패스워드가 DB 내에 존재하는지 여부 판단 코드를 써주시면 됩니다.

}