var express = require('express'), http = require('http'), path = require('path');
var bodyParser = require('body-parser'), static = require('serve-static'), errorHandler = require('express-error-handler');
var fs = require('fs');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var multer = require('multer');;
var app = express();
// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");

app.set('port', process.env.PORT || 3000);
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

var firebaseConfig = {
    apiKey: "AIzaSyBj7VScNlQ3z-S0eJZpU8L2QLs5p76Ng34",
    authDomain: "kokoatalk-fb61b.firebaseapp.com",
    projectId: "kokoatalk-fb61b",
    storageBucket: "kokoatalk-fb61b.appspot.com",
    messagingSenderId: "1077956882800",
    appId: "1:1077956882800:web:71924c155a86cb470a1fb5",
    measurementId: "G-DL0V7TC955"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
 // firebase.analytics();

// mysql
/*var mysql = require('mysql');
const { RSA_SSLV23_PADDING } = require('constants');
var pool = mysql.createPool({
    connectionLimit : 10,
    host : 'localhost',
    user :'nodejs',
    password : '00000',
    database : 'test',
    debug : false
});

var addUser = function(id, name, age, password, callback) {
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

        var data = {id:id, name:name, age:age, password:password}; 
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
*/
var router = express.Router();
router.route('/process/adduser').post(function(req, res){
    console.log('/process/adduser 호출됨');
    var paramId = req.body.id || req.query.id;
    var paramPassword= req.body.password || req.query.password;
    var paramName = req.body.name || req.query.name;
    var paramAge = req.body.age || req.query.age;

    console.log('요청 파라미터 : ' +paramId+', '+ paramPassword+', ' +paramName+', ' +paramAge);
    if (pool) {
        addUser(paramId, paramName, paramAge, paramPassword, function(err, addUser){
            if (err) {
                console.error('사용자 추가 중 오류 발생: '+ err.stack);
                res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
                res.write('<h2>사용자 추가 중 오류 발생</h2>');
                res.write('<p>'+err.stack+'</p>');
                res.end();
                return;
            }
            if(addUser) {
                console.dir(addUser);
                console.log('inserted' + addUser.affetedRows +' rows');
                var insertId = addUser.insertId;
                console.log('추가한 레코드 아이디: '+insertId);
                res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
                res.write('<h2>사용자 추가 성공</h2>');
                res.end();
    
            }else {
                res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
                res.write('<h2>사용자 추가 실패</h2>');
                res.end();
            }
        });
    } else{
        res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.end();
    }
});
var authUser = function(id, password, callback) {
    console.log('authUser 호출됨.');

    pool.getConnection(function(err, conn) {
        if (err) {
            if (conn) {
                conn.release();
            }
            callback(err, null);
            return;
        }
        console.log('데이터베이스 연결 스레드 아이디 : ', + conn.threadId);

        var columns = ['id', 'name', 'age'];
        var tablename = 'users';

        var exec = conn.query('select ?? from ?? where id=? and password=?', [
            columns, tablename, id, password
          ], function(err, rows) {
            conn.release();
            console.log('실행 대상 SQL : ' + exec.sql);
      
            if (rows.length > 0) {
              console.log('아이디 [%s], 비밀번호 [%s]가 일치하는 사용자 찾음.', id, password);
              callback(null, rows);
            } else {
              console.log('일치하는 사용자를 찾지 못함');
              callback(null, null);
            }
          });
      
        });
      
      };
router.route('/process/login').post(function(req, res){
    console.log('/process/login 호출됨');

    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;

    console.log('요청 파라미터 : '+ paramId + ', ' + paramPassword);
    if (pool) {
        authUser(paramId, paramPassword, function(err, rows){
            if (err) {
                console.log('사용자 로그인 중 오류 발생 : ' + err.stack);
                res.writeHead('200', {'Content-Type':'text/html:charset=utf8'});
                res.write('<h2>사용자 로그인 중 오류 발생</h2>');
                res.write('<p>' + err.stack +'</p>');
                res.end();
                return;
            }
            if (rows) {
                console.dir(rows);
                var username = rows[0].name;
                res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
                res.write('<h1>로그인 성공</h1>');
                res.write('<div><p>사용자 아이디 : ' + paramId + '</p></div>');
                res.write('<div><p>사용자 이름 : ' + username + '</p></div>');
                res.write(" <br><br><a href='/public/login.html'>다시 로그인하기</a>");
                res.end();

            }
        });
    }
});
app.use('/', router);



http.createServer(app).listen(app.get('port'), function() {
    console.log('서버가 시작되었습니다');
})