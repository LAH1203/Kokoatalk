var express = require('express'), http = require('http'), path = require('path');
var bodyParser = require('body-parser'), static = require('serve-static'), errorHandler = require('express-error-handler');
var fs = require('fs');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var url = require('url');
var querystring = require('querystring');
var multer = require('multer');;
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
app.get(['/', '/login'], function(req, res) {
    res.render('login_page');
});

router.route('/login').post(function(req, res){
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
});

app.post('/login', function(req, res){
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
});

app.get('/loginSuccess', function(req, res) {
    res.render('login_success');
});

app.get('/loginFail', function(req, res) {
    res.render('login_fail');
});

app.get('/signup', function(req, res) {
    res.render('signup_page');
});

// 회원가입
app.post('/signup', function(req, res){
    console.log('post');
    var user = {
        email : req.body.Email || req.query.Email,
        name1 : req.body.Name || req.query.Name,
        password : req.body.Password||req.query.Password
    };
   var sql = 'INSERT INTO users (id, name, password) VALUES(?, ?, ?)';
   pool.query(sql, user, function(err, result, field){
       if (err){
           console.log(err);
           res.redirect('/signupFail');
       } else{
           res.redirect('/signupSuccess')
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
    // friends라는 배열 안에 DB와 연동하여 친구 목록 넣기
    // 지금은 임시로 friends 배열 생성
    var friends = ['이아현', '임혜지', '고양이', '야옹'];
    res.render('friend_list_page', { friend_list: friends });
});

app.get('/addFriend', function(req, res) {
    // users라는 배열 안에 DB와 연동하여 유저 목록 넣기
    // 지금은 임시로 users 배열 생성
    var users = ['김수한무', '거북이', '두루미'];
    // query string 이용
    var user_name = req.query.search_name;
    console.log(user_name);
    res.render('add_friend_page', { user_list: users, user_name: user_name });
});

app.get('/addFriendSuccess', function(req, res) {
    res.render('add_friend_success');
});

app.get('/addFriendFail', function(req, res) {
    res.render('add_friend_fail');
});

app.use('/', router);

http.createServer(app).listen(app.get('port'), function() {
    console.log('서버가 시작되었습니다');
})
