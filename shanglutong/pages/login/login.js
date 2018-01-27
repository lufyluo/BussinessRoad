// pages/login/login.js
const app = getApp()
var md5 = require('../../utils/md5.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account: '',
    password: '',
    passwordMd5: '',
    sign: "123",
    server: '',
    ran: 123,
    sign: '',
    transServer: 'http://localhost:8888/'
  },

  // 获取输入账号  
  accountInput: function (e) {
    this.setData({
      account: e.detail.value
    })
  },

  // 获取输入密码  
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  serverInput: function (e) {
    this.setData({
      server: e.detail.value
    })
  },
  // 登录  
  login: function () {    
    wx.showToast({
      title: '登陆中',
      icon: 'loading',
      duration: 30000
    })
    if (this.data.account.length == 0 || this.data.password.length == 0) {
      wx.showToast({
        title: '用户名和密码不能为空',
        icon: 'loading',
        duration: 1500
      })
    } else {
      this.setUpUserInfo();
      // 这里修改成跳转的页面  
      wx.request({
        url: app.globalData.transServer + "api/user/gethx",
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          "TransToURL": app.globalData.server + "api/user/gethx" //http://116.62.232.164:9898/
        },
        method: "POST",
        data: app.globalData.clientInfo,
        success: function (e) {
          console.log(e);
          app.globalData.currentUser.Hxid=e.back;
          if (e && e.data.code === "0000") {
            wx.hideToast();
            wx.navigateTo({
              url: '../index/index',
              success: function (res) { },
              fail: function (res) { },
              complete: function (res) { },
            })
          } else {
            if (e && e.data.code === "0003") {
              wx.showToast({
                title: e.data.back,
                icon: 'loading',
                duration: 3000
              })
            }else {
              wx.showToast({
                title: "服务器不可用！",
                icon: 'loading',
                duration: 3000
              })
            }  
          }

        }
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  setUpUserInfo: function () {
    app.globalData.server = this.data.server || app.globalData.server;
    app.globalData.clientInfo.UserId = this.data.account;
    app.globalData.clientInfo.Password = md5.hex_md5(this.data.password).toLocaleUpperCase();
    app.globalData.clientInfo.Ran = 981313799;
    app.globalData.clientInfo.Sign = md5.hex_md5("123" + app.globalData.clientInfo.Ran).toLocaleUpperCase();

  }
})