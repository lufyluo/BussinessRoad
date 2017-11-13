//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js')
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
    currentBoxMenuId: 'ALL',
    currentBoxMenus: [],
    currentMails: [],
    unread: 0,
    count: 0,
    pageIndex: 1,
    pageSize: 10
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
      this.getEmails();
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
  onEmailsPullDownRefresh: function () {
    wx.startPullDownRefresh()
    console.log(1);

    //wx.stopPullDownRefresh()
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
    var id = "";
    if (this.data.currentBoxIndex!==0){
      id +="m_";
    }
    id += this.data.emaiBoxes[this.data.currentBoxIndex].id;
    this.getEmailBoxMenus(id);

  },
  /* 点击查看邮件 */
  bindlist: function (e) {
    this.setData({
      currentBoxMenuId: e.currentTarget.dataset.text
    })
    if (this.data.toptab == e.currentTarget.dataset.current) {
    } else {
      this.setData({
        tabtext: this.data.currentBoxMenus[parseInt(e.currentTarget.dataset.current)].name,
        pageIndex:1
      })
    }
    this.getEmails();
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
          var result = page.setupEmaiMenus(e.data.back);
          page.setData({
            currentBoxMenus: result
          });
        }

      }
    });
  },
  getEmails: function () {
    var page = this;
    var postData = app.globalData.userInfo;
    postData.Boxid = this.data.emaiBoxes[this.data.currentBoxIndex].id;
    postData.Act = this.data.currentBoxMenuId;
    postData.pageindex = this.data.pageIndex;
    postData.pagemax = this.data.pageSize;
    //postData.order ="toptime";
    wx.request({
      url: app.globalData.transServer + "api/mail/Getlist",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "TransToURL": app.globalData.server + "api/mail/Getlist" //http://116.62.232.164:9898/
      },
      method: "POST",
      data: postData,
      success: function (e) {
        if (e.data.code = "0000") {
          page.setupList(e.data.back.list);
          // if (postData.pageindex ===1){
          //   page.data.currentMails.length=0;
          // }
          var result = page.data.currentMails.concat(e.data.back.list);
          page.setData({
            currentMails: e.data.back.list,
            unread: e.data.back.unread,
            count: e.data.back.count,
            pageIndex: e.data.back.index
          });
        }

      }
    });
  },
  setupBoxName: function (arr) {
    for (var i = 0, l = arr.length; i < l; i++) {
      arr[i].showName = arr[i].name.slice(0, 1);
    }
  },
  setupList: function (arr) {
    var page =this;
    for (var item in arr) {
      var date = new Date(arr[item].MailDate);
      arr[item].formatDate = page.getListDate(date);
      arr[item].formatBody = arr[item].textbody.slice(0,400);
    }
  },
  setupEmaiMenus: function (arr) {
    var page = this;
    for (var item in arr) {
      if (arr[item].act.indexOf("WJJ")>=0){
        arr[item].iconAct = "WJJ";
        continue;
      }      
      arr[item].iconAct = arr[item].act;
    }
    return arr;
  },
  getListDate: function (date) {
    var today = new Date;
    var dateString = '';
    if (date.getFullYear() === today.getFullYear() &&date.getMonth() === today.getMonth()&&date.getDay() - today.getDay() === -1)
    { dateString += "昨天"; }
    else if (date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() &&date.getDay() - today.getDay() ===0 )
    { dateString += "今天"; }
    else
    { dateString += date.getMonth() + "月" + date.getDay() + "日" + " "; }
    dateString += date.getHours() + ":" + date.getMinutes();
    return dateString;
  }
})
