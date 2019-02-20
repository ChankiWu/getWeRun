// pages/addFunction/addFunction.js

const appid = "wxe89011b6aaa0836e";
const secretkey = "954a3b6622b1579457a633a51cc15202";

var app = getApp();
const domain = "http://192.168.0.6:3000/";

const code = `// 云函数入口函数
exports.main = (event, context) => {
  console.log(event)
  console.log(context)
  return {
    sum: event.a + event.b
  }
}`

Page({

  data: {
    result: '',
    canIUseClipboard: wx.canIUse('setClipboardData'),
    run: []
  },

  onLoad: function (options) {

      var that = this;
      wx.login({
        success: function (resLogin) {
          if (resLogin.code) {
            wx.request({
              url: domain + 'login',
              data: {
                code: resLogin.code
              },
              fail: function (message) {
                console.log("fail to get response from nodejs server" + message);
              },
              success: function (resSession) {
                console.log("Session", resSession.data);

                //getUserinfo
                wx.getSetting({
                  success: function (res) {

                    wx.getWeRunData({
                      success(resRun) {

                        wx.request({
                          url: domain + 'result',
                          data: {
                            encryptedData: resRun.encryptedData,
                            iv: resRun.iv,
                            session_key: resSession.data
                          },
                          success: function (response) {

                            var run_data = new Array();
                            //简单处理一下
                            for (var i in response.data.data.stepInfoList) {
                              run_data.push("时间："+response.data.data.stepInfoList[i].date+ " 步数：" + response.data.data.stepInfoList[i].step)
                            }

                            console.log("Done.", run_data);
                            that.setData({
                              run: run_data
                            })

                          }
                        })
                        
                      },

                      fail: function (res) {
                        wx.showModal({
                          title: '提示',
                          content: '开发者未开通微信运动，请关注“微信运动”公众号后重试',
                          showCancel: false,
                          confirmText: '知道了'
                        })
                      }

                    })  //getrundata

                  }

                })

              },

            })  //request
          }
        }
      })  //login
    
  },

  onShow: function () {
    
  },

  onReady:function(){
    
  }

})

