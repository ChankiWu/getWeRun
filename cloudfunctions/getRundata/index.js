// 云函数入口文件
const cloud = require('wx-server-sdk')
const appid = "wxe89011b6aaa0836e";
const secretkey = "954a3b6622b1579457a633a51cc15202";
const WXBizDataCrypt = require('./utils/decode.js');

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
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

            //2,getUserinfo
            wx.getSetting({
              success: function (res) {
                if (!res.authSetting['scope.werun']) {
                }
                else {

                  wx.getWeRunData({
                    success(resRun) {
                      const encryptedData = resRun.encryptedData;
                      const iv = resRun.iv
                      console.info(resRun);

                      //3、解密步骤2的数据
                      var pc = new WXBizDataCrypt(appid, resSession.data);
                      console.log(pc);
                      var rundata = pc.decryptData(encryptedData, iv);
                      console.log(rundata);

                      return{
                        result: rundata
                      }
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

              }

            })

          },

        })  //request
      }
    }
  })  //login

}