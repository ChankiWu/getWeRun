// pages/addFunction/addFunction.js

const appid = "wxe89011b6aaa0836e";
const secretkey = "954a3b6622b1579457a633a51cc15202";

var app = getApp();

Page({

  data: {
    result: '',
    canIUseClipboard: wx.canIUse('setClipboardData'),
    run: []
  },

  onLoad: function (options) {
      wx.cloud.init();
      var that = this;
      
      wx.login({
        success: function (resLogin) {
          if (resLogin.code) {
            
            //调用云函数获取session_key
            wx.cloud.callFunction({
              name:'login',
              data:{
                appid:appid,
                secretkey: secretkey,
                code: resLogin.code
              },
            }).then(res => {
              console.log("Session_key ", res.result.session_key);
              var session_key = res.result.session_key;
              //getUserinfo
              wx.getSetting({
                success: function (res) {
                  //先确定用户是谁
                  wx.getUserInfo({
                    success: user_res => {
                      console.log("Userinfo",user_res.userInfo.nickName);

                      wx.getWeRunData({
                        success(resRun) {

                          //调用云函数获取30天运动数据
                          wx.cloud.callFunction({
                            name: 'getRundata',
                            data: {
                              encryptedData: resRun.encryptedData,
                              iv: resRun.iv,
                              session_key: session_key,
                              user_info: user_res.userInfo.nickName
                            },
                          }).then(res => {
                            var run_data = new Array();
                            //简单处理一下
                            for (var i in res.result.data.stepInfoList) {
                              run_data.push("时间：" + res.result.data.stepInfoList[i].date + " 步数：" + res.result.data.stepInfoList[i].step)
                            }
                            console.log("Done.", run_data);
                            that.setData({
                              run: run_data
                            })

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

                    },
                    fail: err =>{
                      console.log("Error to get user info");
                    }
                  })//getuserinfo
             

                }

              })//getsetting
            })
          }
        }
      })//login
           
  },

  onShow: function () {
    
  },

  onReady:function(){
    
  }

})

