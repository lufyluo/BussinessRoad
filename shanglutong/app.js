//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var code = res.code
        console.log('code:' + code)
        /* wx.request({
          url: 'https://applet.mycreate.net/baozhenapplet/Api/sns/JsCode2Json',
          data: {
            appid: 'wx9e94e026c3357f34',
            secret: '5689f4151bd1dda026b998ed6147db60',
            js_code: code,
            grant_type: 'authorization_code'
          },
          header: {
            'content-type': 'application/json'
          },
          method: 'GET',
          success: function (res) {
            console.log(res)
            var openid = res.data.openid
            wx.setStorageSync('openid', res.data.openid)
            var sessionid = res.data.sessionid
            wx.setStorageSync('sessionid', res.data.sessionid)
          },
          fail: function () {
            console.log('openid失败')
          }
        }) */
      }
    })
    
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    transServer: 'https://crm.18518.net:18080/',//'https://crm.18518.net:18088/',//
    server: 'http://116.62.232.164:9898/',//'http://crm.18518.net:9898/',//
    currentUser:{},
    currentEmail:{},
    clientInfo: {
      UserId:'wbf',
      Password:'96E79218965EB72C92A549DD5A330112',
      Ran: 981313799,
      Sign:'C07163FDF49F51FB7C7CB3DCCC2E9BD3'
    },
    currentBox: { id: 'zn', name: "智能文件夹",email:"" },
    emailBoxes: [{ id: 'zn', name: "智能文件夹", email: "" }, { id: 'lz', name: "智能文件夹1", email: "32111@123.com" }, { id: 'lz1', name: "智能文件夹1", email: "32661@123.com" }],
    EmailInfo:{},
    contactors:[]
  }
})