//app.js
const appid = "wxe89011b6aaa0836e";
const secretkey = "954a3b6622b1579457a633a51cc15202";

App({
  data: {
  },
  onLaunch: function () {
    //cloud function
    wx.cloud.init();

    // 登录
    wx.login({
      success(res) {
        console.log('code: ' + res.code);
        if (res.code) {
          wx.cloud.callFunction({
            name: 'login',
            data: {
              appid: appid,
              secretkey: secretkey,
              code: res.code
            },
          }).then(res => {
            console.log("app.js get login", res.result);
            var session_key = res.result.session_key;

            //store openid and session_key
            wx.setStorage({
              key: 'openid',
              data: res.result.openid,
            })
            wx.setStorage({
              key: 'session_key',
              data: res.result.session_key,
            })

          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });

  },
  onShow(opt) {
    console.log("opt.scene" + opt.scene);
    if (opt.scene == 1044) {
      //通过链接进入小程序的场景值是1044
      this.globalData.shareTicket = opt.shareTicket;
    }
  },
  globalData: {
    userInfo: null
  }
})
