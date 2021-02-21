var express = require('express'), http = require('http'), path = require('path');
var bodyParser = require('body-parser'), static = require('serve-static'), errorHandler = require('express-error-handler');
var fs = require('fs');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
// socket.io 모듈 -> 채팅 시 써먹음
const socket = require('socket.io');
var url = require('url');
var querystring = require('querystring');
var multer = require('multer');;
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');
var app = express();


app.set('port', process.env.PORT || 3000);
app.set('views', './views');
// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
// app.use('/public',static(path.join(__dirname, 'public')));
app.use(express.static('public'));
app.use('/public',static(path.join(__dirname, 'views')));
app.use(cookieParser());
app.use(expressSession({
    secret:'my key',
    resave:true,
    saveUninitialized:true
}));


// mysql
var mysql = require('mysql');
const { RSA_SSLV23_PADDING } = require('constants');
var pool = mysql.createConnection({
    connectionLimit : 10,
    host : 'localhost',
    user :'kokoatalk',
    password : '00000',
    database : 'kokoatalk',
    debug : false
});
pool.connect();

// 동기식 mysql
var sync_mysql = require('sync-mysql');
var sync_pool = new sync_mysql({
    connectionLimit : 10,
    host : 'localhost',
    user :'kokoatalk',
    password : '00000',
    database : 'kokoatalk',
    debug : false
});

var router = express.Router();


// 로그인
app.get('/login', function(req, res) {
    const currentUserEmail = getCurrentUser();
    // 자동 로그인
    if (currentUserEmail !== null) {
        var sql = 'SELECT * FROM users WHERE id = ?';
        pool.query(sql, [currentUserEmail], function(err, rows){
            if (err) {
                console.log(err);
            } else {
                var user_in = rows[0];
                req.session.email = user_in.id;
                req.session.password = user_in.password;
                req.session.name = user_in.name;
                req.session.intro = user_in.intro;
                req.session.save(function() {
                    res.redirect('/friendList');
                });
            }
        });
    } else {
        res.render('login_page');
    }
});

/*router.route('/login').post(function(req, res){
    console.log('.post login 호출');
    var user = {
        id : req.body.email || req.query.email,
        password : req.body.password|| req.query.password
    }
    var sql = 'SELECT * FROM users WHERE id = ?, password = ?';
    pool.query(sql, user, function(err, results){
        console.log('login');
        if(err){
            console.log(err);
            res.redirect('/loginFail');
        } else{
            res.redirect('/loginSuccess');
        }
    });
});*/

app.post('/login', function(req, res) {
    var id = req.body.email || req.query.email;
    var password = req.body.password|| req.query.password;
    var autoLoginChecked = req.body.autoLogin;
    var sql = 'SELECT * FROM users WHERE id = ?';
    pool.query(sql, [id], function(err, rows){
        if (err) {
            console.log(err);
        }
        if (rows == 0) {
            // console.log('일치하는 사용자 없음');
            res.render('no_user');
        }
        else {
            var user_in = rows[0];
            if(password == user_in.password) {
                req.session.email = user_in.id;
                req.session.password = user_in.password;
                req.session.name = user_in.name;
                req.session.intro = user_in.intro;
                req.session.save(function(){
                    if (autoLoginChecked == 'auto') {
                        autoLogin(id);
                    }
                    res.redirect('/loginSuccess');
                });
            } else {
                res.redirect('/loginFail');
            }
        }
    });
});

/*
console.log('login');
        if(err){
            console.log(err);
            res.redirect('/loginFail');
        } else{
            res.redirect('/loginSuccess');
        }
*/

app.get('/loginSuccess', function(req, res) {
    res.render('login_success');
});

app.get('/loginFail', function(req, res) {
    res.render('login_fail');
});

// 로그아웃
app.get('/logout', function(req, res) {
    removeUserInfo();
    req.session.destroy(function(err) {
        if (err)
            console.log('로그아웃 실패');
        else
            res.redirect('/login');
    });
});

app.get('/signup', function(req, res) {
    res.render('signup_page');
});

// 회원가입
app.post('/signup', function(req, res) {
    var id = req.body.email || req.query.email;
    var name = req.body.name || req.query.name;
    var password = req.body.password||req.query.password;
    var intro = req.body.intro;
    var check = 1;
    // 동기식 mysql문으로 유저 이름 겹치는지 아닌지 검사
    var sql = 'SELECT name FROM users';
    var users_name = sync_pool.query('SELECT name FROM users');
    // console.log(users_name);
    for (var i = 0; i < users_name.length; i++) {
        // console.log(users_name[i].name);
        if (users_name[i].name == name) {
            check = 0;
        }
    }

    if (check == 0) {
        res.render('same_name_error_page');
    } else {
        sql = 'SELECT * FROM users WHERE id=?';
        pool.query(sql, [id], function(err, rows){
            if (err) {
                console.log(err);
            }
            if (rows == 0) { // 이미 저장된 사용자가 없으면
                var sql1= 'INSERT INTO users (id, name, password, intro) VALUES(?,?,?,?)';
                var user_info = [id, name, password, intro];
                pool.query(sql1, user_info, function(err){
                    if(err){
                        console.log(err);
                        res.redirect('/signupFail');
                    } else{
                        res.redirect('/signupSuccess');
                    }
                });
            } else {
                // console.log('이미 추가된 사용자가 있음');
                res.render('already_user');
            }
        });
    }
});

app.get('/signupSuccess', function(req, res) {
    res.render('signup_success');
});

app.get('/signupFail', function(req, res) {
    res.render('signup_fail');
});

// 친구 목록
app.get('/friendList', function(req, res) {
    if (!req.session.email) {
        console.log('로그인되어있지 않음');
        res.redirect('/login');
    }
    var myemail = req.session.email;
    var friends = [];
    var sql = 'SELECT friend_id FROM friend where my_id = ?';
    pool.query(sql, [myemail], function(err, rows){
        if (err) {
            console.log(err);
        } else {
            for(var i = 0; i<rows.length; i++) {
                friends.push(rows[i].friend_id);
                console.log(friends);
            }
            res.render('friend_list_page', { friend_name: friends, my_name: req.session.name });
        }
    });
    // friends라는 배열 안에 DB와 연동하여 친구 목록 넣기
    // 지금은 임시로 friends 배열 생성
    // 마찬가지로 유저 이메일 넣는 friends_email 임시 생성
    // 두 배열의 순서는 동일해야 함! <- 동일 인덱스를 사용해야 하기 때문
    //var friends = ['이아현', '임혜지', '고양이', '야옹', '개', '멍멍'];
    // var friends_email = ['lah1203@naver.com', 'lhg2615@naver.com', 'lah1203@naver.com', 'lhg2615@naver.com', 'lah1203@naver.com', 'lhg2615@naver.com'];
    // res.render('friend_list_page', { friend_list: friends, friend_email: friends_email, my_name: req.session.name, my_email: req.session.email });
    
});

app.get('/addFriend', function(req, res) {
    if (!req.session.email) {
        console.log('로그인되어있지 않음');
        res.redirect('/login');
    }
    var sql = 'SELECT name FROM users';
    var users=[];
    var myname = req.session.name;
    pool.query(sql, function(err, rows, fields){
        if(err) {
            console.log(err);
        } else{
            for(var i = 0; i<rows.length;i++){
                if(rows[i].name == myname)
                    continue;
                else
                    users.push(rows[i].name)    
               // var string = JSON.stringify(rows[i].name);
              //  users.push(string);
                
            }
            var user_name = req.query.search_name;
            console.log(user_name);
            console.log(users);
            res.render('add_friend_page', { user_list: users, user_name: user_name });
        }
    });
    
});

// 유저 페이지
app.get('/userPage', function(req, res) {
    var user_info = {};
    if (!req.session.email) {
        console.log('로그인되어있지 않음');
        res.redirect('/login');
    }
    var name = req.query.name;
    var sql = 'SELECT * FROM users WHERE name = ?';
    pool.query(sql, [name], function(err, rows){
        if (err) {
            console.log('/userPage');
            console.log(err);
        } else {
            var user = rows[0];
            user_info.name = user.name;
            user_info.email = user.id;
            user_info.intro = user.intro;
            console.log(user_info);
            if (email == req.session.email)
                res.render('my_profile', { my_info: user_info });
            else
                res.render('user_profile', { user_info: user_info });
        }
    });
});

// 친구 추가
app.get('/friendAdd', function(req, res) {
    var name = req.query.user_name;
    var email = req.session.email;
    // 여기서 나와 위 이름의 친구 추가를 하면 됨
    // 이메일로 DB에 추가해야하므로 mysql select를 써서 이메일을 알아낸 후 추가
    // 추가에 성공했다면 add_friend_success.pug, 실패했다면 add_friend_fail.pug로 이동
    // 이번에는 링크를 안 만들었기 때문에 redirect가 아니라 render를 사용해야함!
    var sql = 'SELECT id FROM users WHERE name=?'; // email 알아내기 (친구의)
    pool.query(sql, [name], function(err, rows){
        if (err) {
            console.log(err);
        } else {
            var friendid = rows[0].id;
            console.log('friend id = ', friendid);
            var sql1= 'INSERT INTO friend (my_id, friend_id) VALUES(?,?)';
            pool.query(sql1, [email, friendid], function(err, rows){
                if (err) {
                    console.log(err);
                    res.render('add_friend_fail');
                } else {
                    var sql2= 'INSERT INTO friend (my_id, friend_id) VALUES(?,?)';
                    pool.query(sql2, [friendid, email], function(err, rows){
                        if (err) {
                            console.log(err);
                            res.render('add_friend_fail');
                        } else {
                            res.render('add_friend_success');
                        }
                    });     
                }
            });
        }

    });

});

// 친구 삭제
app.get('/friendDelete', function(req, res) {
    var email = req.query.email;
    var myemail = req.session.email;
    var sql = 'DELETE FROM friend Where my_id = ? and friend_id = ?';
    pool.query(sql, [myemail, email], function(err, rows){
        if (err) {
            console.log(err);
            res.render('friend_delete_fail');
        } else {
            var sql2 ='DELETE FROM friend Where my_id = ? and friend_id = ?';
            pool.query(sql2, [email, myemail], function(err, rows){
                if (err) {
                    res.render('friend_delete_fail');
                } else {
                    res.render('friend_delete_success');
                }
            });
            
        }
    });
    // 여기서 나와 위 이메일(친구)와의 관계를 끊으면 됨
    // 즉, mysql에서 친구관계 테이블에서 해당 유저와의 관계를 삭제
    // 삭제에 성공했다면 friend_delete_success.pug, 실패했다면 friend_delete_fail.pug로 이동
    // 이번에는 링크를 안 만들었기 때문에 redirect가 아니라 render를 사용해야함!

});

// 내 정보 수정
app.get('/updateMyInfo', function(req, res) {
    res.render('update_my_info_page', { my_name: req.session.name, my_intro: req.session.intro, my_email: req.session.email });
});

app.post('/updateMyInfo', function(req, res) {
    // body에서 사용자 정보 받아와서 mysql update 사용해주세요!
    var email =  req.session.email;
    // var email = 'lhg2615@naver.com';
    var name = req.body.name || req.query.name;
    var intro = req.body.intro || req.query.intro;
    if (name == null) { // intro만 입력된 경우
        var sql = 'UPDATE users SET intro = ? WHERE id = ?;'
        pool.query(sql, [intro, email], function(err, rows){
            if (err) {
                console.log(err);
            } else {
                // console.log('성공');
                res.redirect('/userPage?email=' + email);
            }
        });
    }
    else if (intro == null) { // name만 입력된 경우
        var sql = 'UPDATE users SET name = ? WHERE id = ?;'
        pool.query(sql, [name, email], function(err, rows){
            if (err) {
                console.log(err);
            } else {
                // console.log('성공');
                res.redirect('/userPage?email=' + email);
            }
        });
    }
    else { // 둘다 입력된 경우
        var sql = 'UPDATE users SET intro = ?, name = ? WHERE id = ?;'
        pool.query(sql, [intro, name, email], function(err, rows){
            if (err) {
                console.log(err);
            } else {
                // console.log('성공');
                res.redirect('/userPage?email=' + email);
            }
        });
    }

});

app.get('/chatting', function(req, res) {
    if (!req.session.name) {
        console.log('로그인되어있지 않음');
        res.redirect('/login');
    }
    var friend_name = req.query.friend_name;
    var my_name = req.session.name;
    // 내 이름과 친구 이름으로 채팅 시작!
    res.render('chatting_page');
});



app.use('/', router);

const server = http.createServer(app);

// 생성된 서버를 socket.io에 바인딩
const io = socket(server);

server.listen(app.get('port'), function() {
    console.log('서버가 시작되었습니다.');
});

function autoLogin(email) {
    localStorage.setItem('USER_EMAIL', email);
    console.log(localStorage.getItem('USER_EMAIL'));
}

function getCurrentUser() {
    const currentUserEmail = localStorage.getItem('USER_EMAIL');
    return currentUserEmail;
}

function removeUserInfo() {
    localStorage.removeItem('USER_EMAIL');
}