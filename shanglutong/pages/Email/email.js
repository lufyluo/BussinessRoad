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
    console.log(app.globalData.currentEmail);
  },
  bindItToHide:function(e){
    var itTo=""
    if (this.data.itToHide ==="隐藏")
    {
      itTo="详情";
    }else{
      itTo = "隐藏";
    }
    this.setData({
      itToHide: itTo
    });
  }

})