var express = require('express'), http = require('http'), path = require('path');
var bodyParser = require('body-parser'), static = require('serve-static'), errorHandler = require('express-error-handler');
var fs = require('fs');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
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
var router = express.Router();



// // 로그인
// app.get('/login', function(req, res) {
//     res.render('login_page.html');
// });

// // 회원가입
// app.get('/signup', function(req, res) {
//     res.render('signup_page.html');
// });

// // 친구 목록
// app.get('/friendList', function(req, res) {
//     // 뒤에 쿼리로 친구 수 전달하면 될 것 같습니다.
//     res.render('friend_list_page.html');
// });

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
    // 로그아웃 구현 시 세션과 localStorage 정보 모두 삭제 필수!
});

app.get('/signup', function(req, res) {
    res.render('signup_page');
});

// 회원가입
app.post('/signup', function(req, res){
    var id = req.body.email || req.query.email;
    var name = req.body.name || req.query.name;
    var password = req.body.password||req.query.password;
    var sql = 'SELECT * FROM users WHERE id=?';
    pool.query(sql, [id], function(err, rows){
        if (err) {
            console.log(err);
        }
        if (rows == 0) { // 이미 저장된 사용자가 없으면
            var sql1= 'INSERT INTO users (id, name, password) VALUES(?,?,?)';
            var user_info = [id, name, password];
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
    console.log(req.session.name, req.session.email);
    // friends라는 배열 안에 DB와 연동하여 친구 목록 넣기
    // 지금은 임시로 friends 배열 생성
    // 마찬가지로 유저 이메일 넣는 friends_email 임시 생성
    // 두 배열의 순서는 동일해야 함! <- 동일 인덱스를 사용해야 하기 때문
    var friends = ['이아현', '임혜지', '고양이', '야옹', '개', '멍멍'];
    var friends_email = ['lah1203@naver.com', 'lhg2615@naver.com', 'lah1203@naver.com', 'lhg2615@naver.com', 'lah1203@naver.com', 'lhg2615@naver.com'];
    res.render('friend_list_page', { friend_list: friends, friend_email: friends_email, my_name: req.session.name, my_email: req.session.email });
});

app.get('/addFriend', function(req, res) {
    var sql = 'SELECT name FROM users';
    var users=[];
    pool.query(sql, function(err, rows, fields){
        if(err) {
            console.log(err);
        } else{
            for(var i = 0; i<rows.length;i++){
               // var string = JSON.stringify(rows[i].name);
              //  users.push(string);
                users.push(rows[i].name)
            }
            var user_name = req.query.search_name;
            console.log(user_name);
            console.log(users);
            res.render('add_friend_page', { user_list: users, user_name: user_name });
        }
    });
    // users라는 배열 안에 DB와 연동하여 유저 목록 넣기
    // 지금은 임시로 users 배열 생성
    //var users = ['김수한무', '거북이', '두루미'];
    // query string 이용
    
});

// 유저 페이지
app.get('/userPage', function(req, res) {
    var email = req.query.email;
    if (email == req.session.email) {
        var my_info = {
            name: req.session.name,
            email: req.session.email,
            intro: req.session.intro
        };
        res.render('my_profile', { my_info: my_info });
    } else {
        // 여기에 mysql 구문을 써야함
        // 유저 이메일이 있으므로 이메일을 가지고 유저 이름과 이메일, intro를 뽑아냄
        // 그 뽑아낸 정보를 통째로 전달
        // 지금은 임시로 생성
        var user_info = {
            name: 'hyeji',
            email: 'lhg2615@naver.com',
            intro: 'Hi, everyone!'
        };
        res.render('user_profile', { user_info: user_info });
    }
});

// 친구 추가
app.get('/friendAdd', function(req, res) {
    var name = req.query.user_name;
    // 여기서 나와 위 이름의 친구 추가를 하면 됨
    // 이메일로 DB에 추가해야하므로 mysql select를 써서 이메일을 알아낸 후 추가
    // 추가에 성공했다면 add_friend_success.pug, 실패했다면 add_friend_fail.pug로 이동
    // 이번에는 링크를 안 만들었기 때문에 redirect가 아니라 render를 사용해야함!
});

// 친구 삭제
app.get('/friendDelete', function(req, res) {
    var email = req.query.email;
    // 여기서 나와 위 이메일(친구)와의 관계를 끊으면 됨
    // 즉, mysql에서 친구관계 테이블에서 해당 유저와의 관계를 삭제
    // 삭제에 성공했다면 friend_delete_success.pug, 실패했다면 friend_delete_fail.pug로 이동
    // 이번에는 링크를 안 만들었기 때문에 redirect가 아니라 render를 사용해야함!
});

// 내 정보 수정
app.get('/updateMyInfo', function(req, res) {
    res.render('update_my_info_page');
});

app.post('/updateMyInfo', function(req, res) {
    // 내 정보 수정 시 받아온 정보로 mysql update!
});

app.use('/', router);

http.createServer(app).listen(app.get('port'), function() {
    console.log('서버가 시작되었습니다');
});

function autoLogin(email) {
    localStorage.setItem('USER_EMAIL', email);
    console.log(localStorage.getItem('USER_EMAIL'));
}

function getCurrentUser() {
    const currentUserEmail = localStorage.getItem('USER_EMAIL');
    return currentUserEmail;
}