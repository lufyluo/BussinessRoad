// pages/Email/email.js
var WxParse = require('../../wxParse/wxParse.js');
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
    IsWithMaskPop:false,
    IsPopMore:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      emailInfo: app.globalData.currentEmail
    });
    this.getEmailContent(app.globalData.currentEmail.Id);
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
  bindMore:function(e){
    this.setData({
      IsWithMaskPop: true,
      IsPopMore: true
    });
  },
  bindHidePopMore:function(e){
    this.setData({
      IsWithMaskPop: false,
      IsPopMore: false
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
    var postData = app.globalData.clientInfo;
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
  getEmailContent:function(id){
    var page = this;
    var param = page.getCommonParam();
    param.MailId = id;
    console.log(param);
    wx.request({
      url: app.globalData.transServer + "api/mail/Get",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "TransToURL": app.globalData.server + "api/mail/Get" //http://116.62.232.164:9898/
      },
      method: "POST",
      data: param,
      success: function (e) {
        if (e.data.code = "0000") {
          page.setData({
            emailInfo: e.data.back
          });
          WxParse.wxParse('article', 'html', page.data.emailInfo.htmlbody, page, 5);
        }

      }
    });
  },
  getCommonParam: function () {
    console.log(app.globalData.clientInfo);
    console.log("----------------------");
    var param = {
      UserId: app.globalData.clientInfo.UserId,
      Password: app.globalData.clientInfo.Password,
      Ran: app.globalData.clientInfo.Ran,
      Sign: app.globalData.clientInfo.Sign,
    }
    return param;
  }
})