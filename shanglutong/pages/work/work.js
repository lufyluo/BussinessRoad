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
    selectedLabels: [],
    IsLabelsPop: false,
    mailTypes: [],
    emailTypePopPosition: {},
    defaultType: {},
    selectedMailType: "",
    IsMailTypePop: false,
    IsWithMskPop: false,
    Subject: "",
    Content: "",
    /**  
        * 页面配置  
        */
    winWidth: 0,
    winHeight: 0,
    // tab切换    
    currentTab: 0,
    uploadFiles: []
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
      selectedLabels: e.detail.value
    });
  },
  bindLabelsSubmitSelected: function (e) {
    this.setData({
      IsLabelsPop: false
    });
  },
  bindEmaiTypePop: function (e) {
    var postion = { x: e.currentTarget.offsetLeft, y: e.currentTarget.offsetTop }
    this.setData({
      emailTypePopPosition: postion,
      IsWithMskPop: true
    });
  },
  bindMaskTap: function (e) {
    this.setData({
      IsWithMskPop: false
    });
  },
  bindEmailTypeSelected: function (e) {
    var index = parseInt(e.currentTarget.dataset.text);
    console.log(this.data.mailTypes[index]);
    this.setData({
      defaultType: this.data.mailTypes[index],
      IsWithMskPop: false
    });
  },
  bindCancelSend: function (e) {
    wx.navigateBack({
      data: 1
    })
  },
  bindSend: function (e) {
    var page = this;
    var postData = page.setUpAddParam();
    wx.request({
      url: app.globalData.transServer + "api/mail/add",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "TransToURL": app.globalData.server + "api/mail/add" //http://116.62.232.164:9898/
      },
      method: "POST",
      data: postData,
      success: function (e) {
        if (e.data.code = "0000") {
          wx.navigateBack({
            data: 1
          });
        }

      }
    });
  },
  bindUploadFile: function (e) {
    // var pageHandle = this;
    // wx.chooseImage({
    //   success: function (chooseImageCallbackParams) {
    //     var tempFilePaths = chooseImageCallbackParams.tempFilePaths
    //     wx.uploadFile({
    //       url: SERVER_URL,
    //       filePath: tempFilePaths[0],
    //       name: 'file',
    //       success: function (uploadFileCallbackParams) {
    //         var data = uploadFileCallbackParams.data
    //         data = data.split("<br>");//将返回的字符串切割成数组  
    //         var obj_setData = {
    //           file: {
    //             name: data[0],//文件名称  
    //             types: data[1],//文件类型  
    //             size: data[2]//文件大小  
    //           }
    //         }
    //         pageHandle.setData(obj_setData);//将返回的数据显示到界面上  
    //         console.log(data);
    //       },
    //       fail: function () {
    //         console.log("上传失败")
    //       }
    //     })
    //   }
    // })  
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
    var postData = app.globalData.clientInfo;
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
    var postData = app.globalData.clientInfo;
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
    var postData = app.globalData.clientInfo;
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
            mailTypes: result,
            defaultType: result[0]
          });
        }

      }
    });
  },
  setUpAddParam: function () {
    var data = {
      UserId: app.globalData.clientInfo.UserId,
      Password: app.globalData.clientInfo.Password,
      Ran: app.globalData.clientInfo.Ran,
      Sign: app.globalData.clientInfo.Sign,
      check: 1,
      MailBoxId: app.globalData.currentBox.id,
      FromName: app.globalData.clientInfo.Sign,
      Subject: this.data.Subject,
      SendDate: new Date(),
      MailType: "text/html",
      itFrom: this.getCurrentUser().username + "<" + this.data.currentSendEmail + ">",
      itTo: this.data.currentRecieveEmails,
      cc: this.data.currentCcEmails,
      Bcc: this.data.currentBccEmails,
      TextBody: this.data.Content,
      MailLabel: this.data.selectedLabels,
      Type: this.data.selectedMailType
    };
    return data;
  },
  getCurrentUser: function () {
    if (app.globalData.currentUser.username)
      return app.globalData.currentUser
    var currentUser;
    for (var user in app.globalData.contactors) {
      if (user.Hxid === app.globalData.currentUser.Hxid) {
        currentUser = user;
        break;
      }
    }
    if (currentUser) {
      app.globalData.currentUser = user;
      return user;
    }
  }
})