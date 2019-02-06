//index.js
const appid = "wxe89011b6aaa0836e";
const secretkey = "954a3b6622b1579457a633a51cc15202";
const WXBizDataCrypt = require('../../utils/decode.js');
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: ''
  },


  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  getWerun() {
    var mythis = this;
    wx.login({
      success: function (resLogin) {
        if (resLogin.code) {
          wx.request({
            url: 'http://192.168.0.6:3000/login',
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
                        url: 'http://192.168.0.6:3000/result',
                        data: {
                          result: runData.stepInfoList
                        },
                        success: function (response) {
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
