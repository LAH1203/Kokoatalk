function login() {
    const form = document.login_form;
    const user_email = checkValidEmail(form);
    const user_password = checkValidPassword(form);

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

    // 이메일과 패스워드가 모두 정확히 입력되었을 때
    if (user_email && user_password) {
        console.log('로그인 성공');
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