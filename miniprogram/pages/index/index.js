//index.js
const app = getApp();

Page({
  data: {
    avatarUrl: './user-unlogin.png'
  },

  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '自定义转发标题',
      path: '/pages/index/index',
      success: wx.showShareMenu({
        withShareTicket: true
      })
    }
   
  },


  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
  }
})
