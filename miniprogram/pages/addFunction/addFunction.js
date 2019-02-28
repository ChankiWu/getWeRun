// pages/addFunction/addFunction.js

const appid = "wxe89011b6aaa0836e";
const secretkey = "954a3b6622b1579457a633a51cc15202";

var app = getApp();

Page({

  data: {
    todaysportcount: 0,
    userInfo:{},
    hasUserInfo: false,
    openid: ''
  },

  bindGetUserInfo: function (e) {
    //此处授权得到userInfo
    console.log("弹窗后获取用户userinfo", e.detail.userInfo);
    // store userinfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    app.globalData.userInfo = e.detail.userInfo;

    //最后，记得返回刚才的页面
    wx.navigateBack({
      delta: 1
    })

  },

  get_werun: function (get_session_key, get_nickName) {
    var that = this;
    wx.getWeRunData({
      success(resRun) {
        //调用云函数获取30天运动数据
        wx.cloud.callFunction({
          name: 'getRundata',
          data: {
            encryptedData: resRun.encryptedData,
            iv: resRun.iv,
            session_key: get_session_key,
            user_info: get_nickName
          },
        }).then(res => {
          console.log("获取用户的运动数据", res);
          that.setData({ todaysportcount: res.result.data.stepInfoList[30].step });
        })
      }
    })//getrundata

  },

  onLoad: function (options) {
    wx.cloud.init();
    var that = this;
    //first check whether we get the info.
    var get_session_key = wx.getStorageSync('session_key');

    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res_userinfo => {
              //this.globalData.userInfo = res.userInfo;
              console.log("Get userinfo in app.js", res_userinfo.userInfo);
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res_userinfo)
              }

              this.setData({
                userInfo: res_userinfo.userInfo,
                hasUserInfo: true
              })

              var get_nickName = this.data.userInfo.nickName;
              var that = this;
                  //查看微信运动是否授权
                  if (!res.authSetting['scope.werun']) {
                    console.log("用户没有授权微信运动");
      
                    //if not, guide user to authorize
                    wx.authorize({
                      scope: 'scope.werun',
                      success() {
                        // 用户已经同意小程序使用werun
                        console.log("用户同意授权微信运动");
                        that.get_werun(get_session_key, get_nickName);
                      },

                      fail(){

                        wx.openSetting({
                          success(res) {
                            console.log(res.authSetting);
                              res.authSetting = {
                                "scope.werun": true
                              }
                          }
                        })

                        wx.showModal({
                          title: '提示',
                          content: '您没有开启我们小程序对于微信运动访问的权限哦',
                          success: function (response) {
                            if (response.confirm) {
                              console.log('用户点击确定');
                            } else if (res.cancel) {
                              console.log('用户点击取消');
                            }
                          }
                        })
                      }

                    }) // authorize
                  }
                  else {
                    // 用户已经同意小程序使用werun
                    that.get_werun(get_session_key,get_nickName);
                  }
            }
          })
        }

      },
      fail: err => {
        console.log("[error] wx.getsetting", err);
      }
    }) 

  },
                      

  onShow: function () {

    
  },

  onReady:function(){
    
  }

})

