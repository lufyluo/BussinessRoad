// pages/work/work.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    IsSendEmailsPop: false,
    IsRecieveEmailsPop: false,
    IsCcEmailsPop: false,
    IsBccEmailsPop: false,
    sendEmailFocused: false,
    recieveEmailFocused: false,
    ccEmailFocused: false,
    bccEmailFocused: false,
    currentBox: {},
    currentSelectedSendEmails: [],
    currentSendEmail: "",
    currentSelectedRecieveEmails: [],
    currentRecieveEmails: "",
    currentSelectedCcEmails: [],
    currentCcEmails: "",//抄送
    currentSelectedBccEmails: [],
    currentBccEmails: "",//抄送
    hideId: "zn",
    hideIndex: 0,
    boxes: [],
    sendInfo: {
      sendEmail: ""
    },
    contactors: [],
    labels: [],
    IsLabelsPop: false,
    mailTypes: []
  },
  /***click event ***/
  bindPopSelectSendEmails: function (e) {
    this.setData({
      IsSendEmailsPop: true
    });
  },
  bindPopSelectRecieveEmails: function (e) {
    this.setData({
      IsRecieveEmailsPop: true
    });
  },
  bindPopSelectCcEmails: function (e) {
    this.setData({
      IsCcEmailsPop: true
    });
  },
  bindPopSelectBccEmails: function (e) {
    this.setData({
      IsBccEmailsPop: true
    });
  },
  bindSelectSendEmail: function (e) {
    var selectedItem = this.data.boxes[parseInt(e.currentTarget.dataset.text)]
    this.setData({
      currentBox: selectedItem,
      IsSendEmailsPop: false,
      currentSendEmail: selectedItem.email
    });
  },
  bindCheckboxChange: function (e) {
    this.setData({
      currentSelectedSendEmails: e.detail.value
    });
  },
  bindCancelSelected: function (e) {
    this.setData({
      IsRecieveEmailsPop: false
    });
  },
  bindSubmitSelected: function (e) {
    this.setData({
      IsRecieveEmailsPop: false,
      currentRecieveEmails: this.data.currentSelectedRecieveEmails.join(',')
    });
  },
  bindSendEmailFocus: function () {
    this.setData({
      sendEmailFocused: true
    });
  },
  bindSendEmailBlur: function () {
    this.setData({
      sendEmailFocused: false
    });
  },
  /*收件人*/
  bindRecieveCheckboxChange: function (e) {
    this.setData({
      currentSelectedRecieveEmails: e.detail.value
    });
  },
  bindCancelSelected: function (e) {
    this.setData({
      IsRecieveEmailsPop: false
    });
  },
  bindSubmitSelected: function (e) {
    this.setData({
      IsRecieveEmailsPop: false,
      currentRecieveEmails: this.data.currentSelectedRecieveEmails.join(',')
    });
  },
  bindrecieveEmailFocus: function () {
    this.setData({
      recieveEmailFocused: true
    });
  },
  bindrecieveEmailBlur: function () {
    this.setData({
      recieveEmailFocused: false
    });
  },
  /*抄送*/
  bindCcCheckboxChange: function (e) {
    this.setData({
      currentSelectedCcEmails: e.detail.value
    });
  },
  bindCcCancelSelected: function (e) {
    this.setData({
      IsCcEmailsPop: false
    });
  },
  bindCcSubmitSelected: function (e) {
    this.setData({
      IsCcEmailsPop: false,
      currentCcEmails: this.data.currentSelectedCcEmails.join(',')
    });
  },
  bindCcEmailFocus: function () {
    this.setData({
      ccEmailFocused: true
    });
  },
  bindCcEmailBlur: function () {
    this.setData({
      ccEmailFocused: false
    });
  },
  /*密送*/
  bindBccCheckboxChange: function (e) {
    this.setData({
      currentSelectedBccEmails: e.detail.value
    });
  },
  bindBccCancelSelected: function (e) {
    this.setData({
      IsBccEmailsPop: false
    });
  },
  bindBccSubmitSelected: function (e) {
    this.setData({
      IsBccEmailsPop: false,
      currentBccEmails: this.data.currentSelectedBccEmails.join(',')
    });
  },
  bindBccEmailFocus: function () {
    this.setData({
      bccEmailFocused: true
    });
  },
  bindBccEmailBlur: function () {
    this.setData({
      bccEmailFocused: false
    });
  },

  /**添加标签 */
  bindLabelTap: function () {
    this.setData({
      IsLabelsPop: true
    });
  },
  bindLabelsCheckboxChange: function (e) {
    this.setData({
      labels: e.detail.value
    });
  },
  bindLabelsSubmitSelected: function (e) {
    this.setData({
      IsLabelsPop: false    
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var email = app.globalData.currentBox.email.length == 0 ? app.globalData.emailBoxes[1].email : app.globalData.currentBox.email;
    this.setData({
      currentBox: app.globalData.currentBox,
      boxes: app.globalData.emailBoxes,
      currentSendEmail: email
    });
    this.getContactors();
    this.getLabels();
    this.getEmailTypes();
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
  /***初始函数****/
  getContactors: function () {
    var page = this;
    //todo:need change
    var postData = {
      UserId: 'wbf',
      Password: '96E79218965EB72C92A549DD5A330112',
      Ran: 981313799,
      Sign: 'C07163FDF49F51FB7C7CB3DCCC2E9BD3'
    };
    wx.request({
      url: app.globalData.transServer + "api/user/GetAllUser",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "TransToURL": app.globalData.server + "api/user/GetAllUser" //http://116.62.232.164:9898/
      },
      method: "POST",
      data: postData,
      success: function (e) {
        if (e.data.code = "0000") {
          var result = e.data.back;
          page.setData({
            contactors: result.userallmenu
          });
          app.globalData.contactors = result.userallmenu;
        }

      }
    });
  },
  getLabels: function () {
    var page = this;
    //todo:change
    var postData = {
      UserId: 'wbf',
      Password: '96E79218965EB72C92A549DD5A330112',
      Ran: 981313799,
      Sign: 'C07163FDF49F51FB7C7CB3DCCC2E9BD3'
    };
    wx.request({
      url: app.globalData.transServer + "api/mail/getlabel",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "TransToURL": app.globalData.server + "api/mail/getlabel" //http://116.62.232.164:9898/
      },
      method: "POST",
      data: postData,
      success: function (e) {
        if (e.data.code = "0000") {
          var result = e.data.back;
          page.setData({
            labels: result
          });
        }

      }
    });
  },
  getEmailTypes: function () {
    var page = this;
    //todo:change
    var postData = {
      UserId: 'wbf',
      Password: '96E79218965EB72C92A549DD5A330112',
      Ran: 981313799,
      Sign: 'C07163FDF49F51FB7C7CB3DCCC2E9BD3'
    };
    wx.request({
      url: app.globalData.transServer + "api/mail/GetMB",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "TransToURL": app.globalData.server + "api/mail/GetMB" //http://116.62.232.164:9898/
      },
      method: "POST",
      data: postData,
      success: function (e) {
        if (e.data.code = "0000") {
          var result = e.data.back;
          page.setData({
            mailTypes: result
          });
        }

      }
    });
  },
  setUpAddParam: function () {

  }
})