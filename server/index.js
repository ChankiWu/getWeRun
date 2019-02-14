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
const WXBizDataCrypt = require('./WXBizDataCrypt');

app.get('/', function (req, res) {
   res.send('This is weChat Server');
})

app.get('/login', function (req, res) {
    //req.query is { code: '00178zlU04TZv02i8kpU0e0AlU078zlJ' }
    console.log("[GET] login");

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
            console.log("\n[Get] login", body);
            
            //send response to miniprogram
            res.send(body.session_key);
        }
    });

})

app.get('/login/login', function (req, res) {

    //req.query is { code: '*************' }
    console.log("[GET] login login");

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
            console.log("\n[Get] login", body);
            
            //send response to miniprogram
            res.send(body);
        }
    });
    
})

app.get('/result', function (req, res) {

    console.log(req.query.result);
    res.send("OK");
    
})

app.get('/opendata/getsportdata', function(req, res){
    console.log("\n[Get] /opendata/getsportdata ");
    var session_key = req.query.session_key;
    var encryptedData = req.query.encryptedData;
    var iv = req.query.iv;

    //解密运动数据
    var pc = new WXBizDataCrypt(appid, session_key);
    var runData = pc.decryptData(encryptedData, iv);
    
    var result = {data: runData};

    for (var i in runData.stepInfoList) {
        runData.stepInfoList[i].date = new Date(runData.stepInfoList[i].timestamp * 1000).toLocaleDateString()
    }

    var show_rundata = [];
    for (var i in runData.stepInfoList) {
        show_rundata.push(runData.stepInfoList[i].step,runData.stepInfoList[i].date);
    }

    //console.log(show_rundata);
    res.send(result);
})

app.post('/groupsport/creategroupsport', function(req, res){
    console.log("\n[Post] /groupsport/creategroupsport");
    console.log(req.body);

    res.send(true);
})

app.get('/groupsport/getgroupsport', function(req, res){
    console.log("\n[Get] /groupsport/getgroupsport");
    var result = {data: req.query.openGid};
    
    res.send(result);
})


var server = app.listen(3000, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  console.log("Server is listening at " +  port);
 
})