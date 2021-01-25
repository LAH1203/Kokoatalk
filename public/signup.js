const { DEFAULT_FAILURE_POLICY } = require("firebase-functions");
const { user } = require("firebase-functions/lib/providers/auth");

function signup() {

    const form = document.signup_form;
    const user_email = checkValidEmail(form);
    const user_password = checkValidPassword(form);
    const user_name = checkValidName(form);
    const auth = firebase.auth();
    const fs = firebase.firestore();

    if (user_email) {
        document.getElementById('alert_email').innerText = " ";
        form.email.style.border = '2px solid';
        form.email.style.borderColor = '#00D000';
    } else {
        form.email.style.border = '2px solid';
        form.email.style.borderColor = '#FF0000';
        document.getElementById('alert_email').style.color = '#FF0000';
    }
    if (user_password) {
        document.getElementById('alert_password').innerText = " ";
        form.password.style.border = '2px solid';
        form.password.style.borderColor = '#00D000';
    } else {
        form.password.style.border = '2px solid';
        form.password.style.borderColor = '#FF0000';
        document.getElementById('alert_password').style.color = '#FF0000';
    }
    if (user_name) {
        document.getElementById('alert_name').innerText = " ";
        form.password.style.border = '2px solid';
        form.password.style.borderColor = '#00D000';
    } else {
        form.password.style.border = '2px solid';
        form.password.style.borderColor = '#FF0000';
        document.getElementById('alert_name').style.color = '#FF0000';
    }

    // 이메일과 패스워드, 이름이 모두 정확히 입력되었을 때
    if (user_email && user_password && user_name) {
        // 여기에 DB에 사용자 정보(form.email.value, form.password.value, form.name.value)를 넣는 코드를 쓰면 될 것 같습니다.
<<<<<<< HEAD
        // 그리고 DB에 정보 넣는 과정에서 에러가 날 경우 signup_fail.html,
        // 에러가 나지 않을 경우에는 signup_success.html이 실행될 수 있도록 만들어주세욥
=======
        // 그리고 DB에 정보 넣는 과정에서 에러가 날 경우 /signupFail,
        // 에러가 나지 않을 경우에는 /signupSuccess로 이동할 수 있도록 만들어주세욥
        // 페이지 이동은 링크를 미리 만들어놨으므로 링크 이동하시면 됩니다.
>>>>>>> dd3971c93b33fc0a3376a3ce3b9998646ce29aa0
        firebase.auth().createUserWithEmailAndPassword(email, password) // 버튼이 눌렸을 경우 추가...
        .then((user) => {
          const currentUser = {
              email: user_email
              
          }
          fs.collection('users').doc(currentUser.id).set({
              email: currentUser.email
          }).then(function( ){
              console.log('firebase 유저 추가 성공');
          })


        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          // ..
        });
<<<<<<< HEAD


        // 그리고 DB에 정보 넣는 과정에서 에러가 날 경우 /signupFail,
        // 에러가 나지 않을 경우에는 /signupSuccess로 이동할 수 있도록 만들어주세욥
        // 페이지 이동은 링크를 미리 만들어놨으므로 링크 이동하시면 됩니다.
=======
>>>>>>> dd3971c93b33fc0a3376a3ce3b9998646ce29aa0
    }


    

}

function checkValidEmail(form) {
    // 아무것도 입력되지 않았을 경우
    if (form.email.value == "") {
        document.getElementById('alert_email').innerText = "이메일을 입력해주세요.";
        return false;
    }
    // 이메일 형식(?@?.?)
    const exptext = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
    // 위에서 설정한 이메일 형식에 맞지 않을 때
    if (exptext.test(form.email.value) == false) {
        document.getElementById('alert_email').innerText = "이메일 형식에 맞지 않습니다.";
        return false;
    }
    return true;
}

function checkValidPassword(form) {
    // 아무것도 입력되지 않았을 경우
    if (form.password.value == "") {
        document.getElementById('alert_password').innerText = "패스워드를 입력해주세요.";
        return false;
    }
    const pw = form.password.value;
    // 알파벳
    const eng = pw.search(/[a-z]/ig);
    // 숫자
    const num = pw.search(/[0-9]/g);
    // 특수문자
    const spch = pw.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);

    if (pw.length < 6) {
        document.getElementById('alert_password').innerText = "6자 이상 입력해주세요.";
        return false;
    }
    else if (pw.search(/\s/) != -1) {
        document.getElementById('alert_password').innerText = "공백 없이 입력해주세요.";
        return false;
    }
    else if (eng < 0 && num < 0 && spe < 0) {
        document.getElementById('alert_password').innerText = "비밀번호를 제대로 입력해주세요.";
        return false;
    }
    return true;
}

function checkValidName(form) {
    // 아무것도 입력되지 않았을 경우
    if (form.name.value == "") {
        document.getElementById('alert_name').innerText = "이름을 입력해주세요.";
        return false;
    }
    if (form.name.value.length < 2) {
        document.getElementById('alert_name').innerText = "2자 이상 입력해주세요.";
        return false;
    }
    return true;
}