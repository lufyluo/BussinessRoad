//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    tab: 0,
    toptab: 0,
    tabtext: '全部邮件',
    class1: '',
    class2: '',
    class3: '',
    emaiBoxes: [{ id: 'zn', name: "智能文件夹" }],
    currentBoxIndex: 0,
    currentBoxMenuId: '',
    currentBoxMenus:[]
  },
 
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.getEmailBoxes();
      this.getEmailBoxMenus("zn");
    }
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
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  /* 点击分类 */
  bindtab: function (e) {
    var tab = e.target.dataset.tab
    if (tab == 0) {
      this.setData({
        tab: 1,
        class1: 'on',
        class2: 'on',
        class3: 'on'
      })
    } else {
      this.setData({
        tab: 0,
        class1: 'active',
        class2: 'active',
        class3: 'active'
      })
    }
  },
  bindBoxSelected: function (e) {
    this.setData({ currentBoxIndex: e.target.dataset.text });

  },
  /* 点击查看邮件 */
  bindlist: function (e) {
    this.setData({
      currentBoxMenuId: e.currentTarget.dataset.text
    })
    if (this.data.toptab == e.target.dataset.current) {
      /* return false */
    } else {
      this.setData({
        toptab: e.target.dataset.current
      })
    }
  },
  getEmailBoxes: function () {
    var page = this;
    var item = page.data.emaiBoxes[0];
    wx.request({
      url: app.globalData.transServer + "api/mailbox/get",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "TransToURL": app.globalData.server + "api/mailbox/get" //http://116.62.232.164:9898/
      },
      method: "POST",
      data: app.globalData.userInfo,
      success: function (e) {
        if (e.data.code = "0000") {
          var result = e.data.back;
          result.splice(0, 0, item);
          page.setupBoxName(result);
          page.setData({
            emaiBoxes: result
          });
        }

      }
    });
  },
  getEmailBoxMenus: function (parentId) {
    var page = this;
    var postData = app.globalData.userInfo;
    postData.parentid = parentId;
    wx.request({
      url: app.globalData.transServer + "api/mailbox/Getmenu",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "TransToURL": app.globalData.server + "api/mailbox/Getmenu" //http://116.62.232.164:9898/
      },
      method: "POST",
      data: postData,
      success: function (e) {
        if (e.data.code = "0000") {
          var result = e.data.back;
          page.setData({
            currentBoxMenus: result
          });
        }

      }
    });
  },
  setupBoxName: function (arr) {
    for (var i = 0, l = arr.length; i < l; i++) {
      arr[i].showName = arr[i].name.slice(0, 1);
    }
  }
})
