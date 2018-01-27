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
    pageSize: 100,
    isLoading:false
  },

  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    console.log(options);
    if (app.globalData.clientInfo) {
      this.getEmailBoxes();
      this.getEmailBoxMenus("zn");
      this.getEmails();
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onScrolltoupper: function () {
    if(this.data.isLoading)
    return;
    var tempIndex = this.data.pageIndex;
    this.getEmails();
    wx.showToast({
      title: '刷新中...',
      icon:'loading'
    })
    //wx.stopPullDownRefresh()
  },
  onScrolltolower:function(){
    if (this.data.isLoading)
      return;
    this.data.pageIndex ++;
    this.getEmails();
    wx.showToast({
      title: '刷新中...',
      icon: 'loading'
    })
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
  // getUserInfo: function (e) {
  //   //app.globalData.clientInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // },
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
    if (this.data.currentBoxIndex !== 0) {
      id += "m_";
    }
    var curBox = this.data.emaiBoxes[this.data.currentBoxIndex]
    id += curBox.id;
    app.globalData.currentBox = curBox;
    this.getEmailBoxMenus(id);

  },
  /* 点击查看邮件 */
  bindlist: function (e) {
    this.setData({
      currentBoxMenuId: e.currentTarget.dataset.text
    })
    this.setData({
      tabtext: this.data.currentBoxMenus[parseInt(e.currentTarget.dataset.current)].name,
      pageIndex: 1
    });
    this.getEmails();
  },
  bindEmaiClick: function (e) {
    var email = this.data.currentMails[parseInt(e.currentTarget.dataset.current)];
    app.globalData.currentEmail = email;
    wx.navigateTo({
      url: '../Email/email',
    })
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
      data: app.globalData.clientInfo,
      success: function (e) {
        if (e.data.code = "0000") {
          var result = e.data.back;
          console.log(result);
          result.splice(0, 0, item);
          result = page.setupBoxName(result);
          console.log(result);
          page.setupGlobalBox(result, 0);
          page.setData({
            emaiBoxes: result
          });
        }

      }
    });
  },
  getEmailBoxMenus: function (parentId) {
    var page = this;
    var postData = app.globalData.clientInfo;
    postData.parentid = parentId;
    wx.request({
      url: app.globalData.transServer + "api/mailbox/Getmenu",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "TransToURL": app.globalData.server + "api/mailbox/Getmenu" 
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
    page.data.isLoading = true;
    var postData = app.globalData.clientInfo;
    postData.BoxId = this.data.emaiBoxes[this.data.currentBoxIndex].id;
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
          if (postData.pageindex ===1){
            page.data.currentMails.length=0;
          }
          var result = page.data.currentMails.concat(e.data.back.list);
          page.setData({
            currentMails: result,
            unread: e.data.back.unread,
            count: e.data.back.count,
            pageIndex: e.data.back.index
          });
          page.data.isLoading = false;
        }

      }
    });
  },
  setupGlobalBox: function (arr, index) {
    if (arr.length >= 2 && arr[0] && !arr[0].email) {
      arr[0].email = arr[1].email;
    }
    app.globalData.emailBoxes = arr;
    app.globalData.currentBox = arr[index];
  },
  setupBoxName: function (arr) {
    var newArray = [];
    for (var i = 0, l = arr.length; i < l; i++) {
      if (arr[i].name) {
        console.log(arr[i].name);
        arr[i].showName = arr[i].name.slice(0, 1);
        newArray.push(arr[i]);
      }
    }
    return newArray;
  },
  setupList: function (arr) {
    var page = this;
    for (var item in arr) {
      var date = new Date(arr[item].MailDate);
      arr[item].formatDate = page.getListDate(date);
      arr[item].formatBody = arr[item].textbody;
      arr[item].MailLabelShows = this.getLabelArr(arr[item].MailLabel)
    }
  },
  getLabelArr: function (labelString) {
    if (!labelString)
    return null;
    var arr = labelString.split(",");
    var newArr = new Array();
    for (var item in arr) {
      if (!arr[item] || arr[item] == "")
        continue;
      var tempArr = arr[item].split("|");
      newArr.push({
        Name: tempArr[0],
        Id: tempArr[1],
        Label: arr[item]
      });
    }
    return newArr;
  },
  setupEmaiMenus: function (arr) {
    var page = this;
    for (var item in arr) {
      if (arr[item].act.indexOf("WJJ") >= 0) {
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
    if (date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDay() - today.getDay() === -1)
    { dateString += "昨天"; }
    else if (date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDay() - today.getDay() === 0)
    { dateString += "今天"; }
    else
    { dateString += date.getMonth() + "月" + date.getDay() + "日" + " "; }
    dateString += date.getHours() + ":" + date.getMinutes();
    return dateString;
  }
  , removeByEmailId: function (arr, val) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].Id == val) {
        arr.splice(i, 1);
        break;
      }
    }
  },
  setEmailFlag: function (arr, id, flag) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].Id == id) {
        arr[i].redflag = flag;
        break;
      }
    }
  },
  setEmailStar: function (arr, id, star) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].Id == id) {
        arr[i].star = star;
        break;
      }
    }
  },
  setEmailRead: function (arr, id, read) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].Id == id) {
        arr[i].Read = read;
        break;
      }
    }
  },
  setEmailLabel: function (arr, id, emailInfo) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].Id == id) {
        arr[i].MailLabelShows = emailInfo.EmailLabelShows;
        this.setData({
          currentMails: arr
        });
        break;
      }
    }
  },
  setRead: function (arr, id, read) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].Id == id) {
        arr[i].Read = read;
        this.setData({
          currentMails: arr
        });
        break;
      }
    }
  },
})
