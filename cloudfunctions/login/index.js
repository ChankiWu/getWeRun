// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')
const request = require('request');
const rq = require('request-promise');

// 初始化 cloud
cloud.init()

/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */
exports.main = (event, context) => {
  console.log(event)
  console.log(context)

  // 可执行其他自定义逻辑
  // console.log 的内容可以在云开发云函数调用日志查看

  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）
  const wxContext = cloud.getWXContext()

  const appid = event.appid;
  const secretkey = event.secretkey;
  const code = event.code;
  var result;
  var login_uri = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secretkey +
    '&js_code=' + code + '&grant_type=authorization_code';
  
  return rq({
    method: 'POST',
    uri:login_uri,
    headers: event.headers ? event.headers : {},
    json:true,
    body: {}
  }).then(body => {
    console.log("[post] login",body);
    return body
  }).catch(err => {
    return err
  })

}
