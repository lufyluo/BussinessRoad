// pages/Email/email.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    emailInfo: {
      Subject: "找客户宝典",
      SendDate: "2017-11-25 14:40:31",
      itFrom: "ing@a.com",
      itTo: "inquiry",
      TextBody: "weqwdsadsadasdwdadsaderqwedeasdasdawedadscsasvfdsgfeqrdwqedwasdasdcewqwqeqwfedscdasaascddsfqweqwefrsdsafgwfewrwefedwqefwdefeqwefwqfewqefwqfeswfswfswfeswfesddfsdffsdfsdwfefrwedsefdsvefsdvrgfb"
    },
    itToHide: "隐藏",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      emailInfo: app.globalData.currentEmail
    });
    if (!this.data.emailInfo.Read) {
      this.updateReadState();
    }
  },
  bindItToHide: function (e) {
    var itTo = ""
    if (this.data.itToHide === "隐藏") {
      itTo = "详情";
    } else {
      itTo = "隐藏";
    }
    this.setData({
      itToHide: itTo
    });
  },
  updateReadState: function () {
    var page = this;
    var postData = page.getCommonParam();
    postData.mailid = page.emailInfo.Id;
    postData.is = true;
    wx.request({
      url: app.globalData.transServer + "api/mail/Read",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "TransToURL": app.globalData.server + "api/mail/Read" //http://116.62.232.164:9898/
      },
      method: "POST",
      data: postData,
      success: function (e) {
        if (e.data.code = "0000") {
          var result = e.data.back;
          result.splice(0, 0, item);
          page.setupBoxName(result);
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
  getCommonParam: function () {
    var param = {
      UserId: app.globalData.userInfo.UserId,
      Password: app.globalData.userInfo.Password,
      Ran: app.globalData.userInfo.Ran,
      Sign: app.globalData.userInfo.Sign,
    }
    return param;
  }
})