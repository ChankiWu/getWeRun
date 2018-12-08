var express = require('express');
var app = express();

var bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

var util = require('util');
var request = require('request');

const appid = "wxe89011b6aaa0836e";
const secretkey = "954a3b6622b1579457a633a51cc15202";

app.get('/', function (req, res) {
   res.send('This is weChat Server');
})

app.get('/login', function (req, res) {
    //req.query is { code: '00178zlU04TZv02i8kpU0e0AlU078zlJ' }
    console.log("Node.js Server gets login request ", req.query.code);

    //send request to wechat server interface using request
    var code = "" + req.query.code ;
    var response;
    wcurl = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secretkey + 
    '&js_code=' + code + '&grant_type=authorization_code';

    request.post(wcurl, {json: true}, function(err, response, body) {
        if(err) { return console.log(err); }
        else{
            //get session
            //body: { session_key: 'Fgnw5smuGGQB9eyJ3Vpx8g==',openid: 'o3LnT5LKKBk1D4KcoF_sSC6nn6ig' }
            console.log(body);
            
            //send response to miniprogram
            res.send(body.session_key);
        }
    });

})

var server = app.listen(3000, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  console.log("Server is listening at " +  port);
 
})