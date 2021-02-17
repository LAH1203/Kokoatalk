/*
// const { DEFAULT_FAILURE_POLICY } = require("firebase-functions");
// const { user } = require("firebase-functions/lib/providers/auth");
var addUser = function(id, name, password, callback) {
    console.log('addUser 호출됨');
    pool.getConnection(function(err, conn){
        if (err) {
            if (conn) {
                conn.release();
            }
            callback(err, null);
            return;
        }
        console.log('데이터베이스 연결 스레드 아이디 : '+conn.threadId);

        var data = {id:id, name:name, password:password}; 
        var exec = conn.query('insert into users set ?', data, function(err, result){
            conn.release();
            console.log('실행 대상 SQL :' + exec.sql);

            if (err) {
                console.log('SQL 실행 시 오류 발생함');
                console.dir(err);
                callback(err, null);
                return;
            }
            callback(null,result);
        });
    });
}


function signup() {

    var mysql = require('mysql');
    const form = document.signup_form;
    const user_email = checkValidEmail(form);
    const user_password = checkValidPassword(form);
    const user_name = checkValidName(form)
    var mysql = require('mysql');
    const { RSA_SSLV23_PADDING } = require('constants');
    var pool = mysql.createPool({
        connectionLimit : 10,
        host : 'localhost',
        user :'kokoatalk',
        password : '00000',
        database : 'kokoatalk',
        debug : false
    });


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
        console.log('sql 호출됨');
      //  var paramId = req.body.id || req.query.id;
       // var paramPassword= req.body.password || req.query.password;
      //  var paramName = req.body.name || req.query.name;
      //  var paramAge = req.body.age || req.query.age;
       // console.log('요청 파라미터 : ' +paramId+', '+ paramPassword+', ' +paramName+', ' +paramAge);
        if (pool) {
            addUser(user_email, user_name, user_password, function(err, addUser){
                if (err) {
                    console.error('사용자 추가 중 오류 발생: '+ err.stack);
                    res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
                    res.write('<h2>사용자 추가 중 오류 발생</h2>');
                    res.write('<p>'+err.stack+'</p>')
                    res.end();
                    return;
                }
                if(addUser) {
                    res.redirect('/loginSuccesss');
                    console.log('hello');
        
                }else {
                    app.get('/signup_fail', function(req, res){ // signup_fail로 이동
                        res.redirect('/loginFail');
                    });
                }
            });
        } else{
            res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
            res.write('<h2>데이터베이스 연결 실패</h2>');
            res.end();
        } 
        // 여기에 DB에 사용자 정보(form.email.value, form.password.value, form.name.value)를 넣는 코드를 쓰면 될 것 같습니다.
        // 그리고 DB에 정보 넣는 과정에서 에러가 날 경우 signup_fail.html,
        // 에러가 나지 않을 경우에는 signup_success.html이 실행될 수 있도록 만들어주세욥


        // 그리고 DB에 정보 넣는 과정에서 에러가 날 경우 /signupFail,
        // 에러가 나지 않을 경우에는 /signupSuccess로 이동할 수 있도록 만들어주세욥
        // 페이지 이동은 링크를 미리 만들어놨으므로 링크 이동하시면 됩니다.
    }
    else{
        console.log('연결 실패');
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
*/

function refreshDiv(users_name) {
    window.setInterval('refreshDiv()', 1000);
    var form = document.signup_form;
    for (i in users_name) {
        if (users_name[i] == form.name.value) {
            form.email.style.border = '2px solid';
            form.email.style.borderColor = '#FF0000';
            document.getElementById('alert_name').style.color = '#FF0000';
            document.getElementById('alert_name').innerText = "해당 이름은 이미 존재합니다.";
            return;
        }
    }
}

refreshDiv(users_name);