/**
 * 
 * 
 * 
 * 
 * 
 */
import regeneratorRuntime from '../packages/regenerator/runtime'
import WXP from '../packages/api-promise/wxp'
import { URL } from '../packages/url/url'

const DOMAIN = "localhost:3000"
const SCHEME = "http://"
const HEADERS = {}

/**
 * 更新客户端本地存储的Cookies，这个不能只放到内存中，必须持久化，以避免小程序杀掉重开后服务端由于没有收到SessionID产生新的Session
 */
const setCookies = (cookies) => {
  //console.info(`更新Cookies：${cookies}`)
  HEADERS.Cookie = cookies
  wx.setStorageSync("COOKIES", cookies)
}

/**
 * 取基础URL地址，一般用于前端资源拼接
 */
const getBaseUrl = () => SCHEME + DOMAIN ;

/**
 * 封装代理wx的request请求
 */
const request = async (req = {}) => {

  // 处理默认Header
  req.header = Object.assign(HEADERS, req.header)

  // 发送请求
  //console.info(req)
  return WXP.request(req).then(function(res){
    if(res.statusCode==401){
      // wx.showModal({
      //   title: '提示',
      //   content: '网络请求有问题，请重新进入',
      //   showCancel:false,
      //   success:function(){
          wx.reLaunch({
            url: "/pages/index/index"
          })
        // }
      // })
      
    }else{
      return res;
    }
  },function(res){
    wx.showToast({
      icon: 'none',
      title: "网络请求有问题，请检查网络",
      duration: 3000
    })
  })
}

export default {
  request,
  setCookies,
  getBaseUrl,
  DOMAIN,
  SCHEME,
  HEADERS
}
