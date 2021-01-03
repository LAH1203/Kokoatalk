var express = require('express'), http = require('http'), path = require('path');
var bodyParser = require('body-parser'), static = require('serve-static'), errorHandler = require('express-error-handler');
var fs = require('fs');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var multer = require('multer');;
var app = express();
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.use('/public',static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(expressSession({
    secret:'my key',
    resave:true,
    saveUninitialized:true
}));

http.createServer(app).listen(app.get('port'), function() {
    console.log('서버가 시작되었습니다');
})