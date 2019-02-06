// pages/addFunction/addFunction.js

const appid = "wxe89011b6aaa0836e";
const secretkey = "954a3b6622b1579457a633a51cc15202";
const WXBizDataCrypt = require('./utils/decode.js');

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

  },

  copyCode: function() {
    wx.setClipboardData({
      data: code,
      success: function () {
        wx.showToast({
          title: '复制成功',
        })
      }
    })
  },

  testFunction() {
    wx.cloud.callFunction({
      name: 'sum',
      data: {
        a: 1,
        b: 2
      },
      success: res => {
        wx.showToast({
          title: '调用成功',
        })
        this.setData({
          result: JSON.stringify(res.result)
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [sum] 调用失败：', err)
      }
    })
  },

  getWerun(){
    var mythis = this;
    wx.login({
      success: function (resLogin) {
        if (resLogin.code) {
          wx.request({
            url: 'http://localhost:3000/login',
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
                        const encryptedData = resRun.encryptedData;
                        const iv = resRun.iv
                        console.info(resRun);

                        //解密数据
                        var pc = new WXBizDataCrypt(appid, resSession.data);
                        console.log(pc);
                        var runData = pc.decryptData(encryptedData, iv);

                        //简单处理一下
                        for (var i in runData.stepInfoList) {
                          runData.stepInfoList[i].date = new Date(runData.stepInfoList[i].timestamp * 1000).toLocaleDateString()
                        }

                        console.log(runData.stepInfoList);

                        mythis.setData({
                          run: runData.stepInfoList
                        })

                        wx.request({
                          url: 'http://localhost:3000/result',
                          data:{
                            result: runData.stepInfoList
                          },
                          success: function(response){
                            console.log("Done.", response);
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
  }


})

