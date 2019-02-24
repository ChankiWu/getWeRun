// 云函数入口文件
const appid = "wxe89011b6aaa0836e";
const cloud = require('wx-server-sdk')
const request = require('request');
const rq = require('request-promise');
const WXBizDataCrypt = require('./WXBizDataCrypt');

cloud.init()

// 云函数入口函数
exports.main = (event, context) => {
  const wxContext = cloud.getWXContext()
  
  var session_key = event.session_key;
  var encryptedData = event.encryptedData;
  var iv = event.iv;
  var nickname = event.user_info;
  
  //解密运动数据
  var pc = new WXBizDataCrypt(appid, session_key);
  var runData = pc.decryptData(encryptedData, iv);

  var result = { data: runData };

  var show_rundata = [];
  //add date
  for (var i in runData.stepInfoList) {
    runData.stepInfoList[i].date = new Date(runData.stepInfoList[i].timestamp * 1000).toLocaleDateString()
  }

  for (var i in runData.stepInfoList) {
    show_rundata.push(runData.stepInfoList[i].date, runData.stepInfoList[i].step);
  }

  console.log(nickname);
  console.log(show_rundata);

  return result;
}