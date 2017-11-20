// pages/work/work.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      IsSendEmailsPop: false,
      IsRecieveEmailsPop: false,
      currentBox :{},
      currentSendEmail:"",
      hideId:"zn",
      hideIndex:0,
      boxes:[],
      sendInfo:{
        sendEmail:""
      }
  },
  /***click event ***/
  bindPopSelectSendEmails:function(e){
    this.setData({
      IsSendEmailsPop : true
    });
  },
  bindPopSelectRecieveEmails:function(e){
    this.setData({
      IsRecieveEmailsPop: true
    });
  },
  bindSelectSendEmail:function(e){
    var selectedItem = this.data.boxes[parseInt(e.currentTarget.dataset.text)]
    this.setData({
      currentBox: selectedItem,
      IsSendEmailsPop: false,
      currentSendEmail: selectedItem.email
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var email = app.globalData.currentBox.email.length == 0 ? app.globalData.emailBoxes[1].email:app.globalData.currentBox.email;
    this.setData({
      currentBox: app.globalData.currentBox,
      boxes: app.globalData.emailBoxes,
      currentSendEmail: email
    });
   
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
  setUpAddParam:function(){

  }
})