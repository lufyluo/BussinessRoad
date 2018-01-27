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
    IsWithMaskPop: false,
    IsPopMore: false,
    bakTemp: "",
    IsPopEmailMark: false,
    IsLabelsPop: false,
    labels: [],
    selectedLabels: [],
    IsEmailMovePop: false,
    IsBoxesShow: true,
    IsFolderShow: false,
    MovePart: {
      boxes: [],
      selectedBoxId: "",
      sons: [],
      allFolders: [],
      Folders: [],
      selectFolderId: ""
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.MovePart.boxes = app.globalData.emailBoxes;
    this.setData({
      emailInfo: app.globalData.currentEmail,
      MovePart: this.data.MovePart
    });
    this.getEmailContent(app.globalData.currentEmail.Id);
    if (!(this.data.emailInfo.Read=="是")) {
      this.updateReadState();
    }
    this.getLabels();
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
  bindMore: function (e) {
    this.setData({
      IsWithMaskPop: true,
      IsPopMore: true
    });
  },
  bindHidePopMore: function (e) {
    this.setData({
      IsWithMaskPop: false,
      IsPopMore: false,
    });
  },
  bindHideMarkPop: function (e) {
    this.setData({
      IsWithMaskPop: false,
      IsPopEmailMark: false,
      IsWithMaskPop: true,
      IsPopMore: true,
    });
  },
  bindHidePopMore: function (e) {
    this.setData({
      IsWithMaskPop: false,
      IsPopMore: false,
    });
  },
  bindMailTop: function (evt) {
    var page = this;
    this.CommonEmailOprateFunc(evt, function (e) {
      if (e.data.code = "0000") {
        var value = e.currentTarget.dataset.text == "true";
        if (value) {
          page.data.emailInfo.TopTime = new Date();
        }
        else {
          page.data.emailInfo.TopTime = null;
        }
        page.setData({
          emailInfo: page.data.emailInfo
        });
        wx.showToast({
          title: value ? "置顶成功！" : '取消置顶！',
          icon: 'loading',
          duration: 1500
        })
      }
    });
  },
  bindMailRedFlag: function (evt) {
    var page = this;
    this.CommonEmailOprateFunc(evt, function (e) {
      if (e.data.code = "0000") {
        page.data.emailInfo.redflag = !page.data.emailInfo.redflag || null;
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        prevPage.setEmailFlag(prevPage.data.currentMails, page.data.emailInfo.id, page.data.emailInfo.redflag);
        console.log(page.data.emailInfo.redflag);
        page.setData({
          emailInfo: page.data.emailInfo
        });
        prevPage.setData({
          currentMails: prevPage.data.currentMails
        });
        wx.showToast({
          title: page.data.emailInfo.redflag ? '添加红旗成功！' : "取消红旗！",
          icon: 'loading',
          duration: 1500
        })
      }
    });
  },

  bindMailDelete: function (evt) {
    var page = this;
    wx.showModal({
      title: '提示',
      content: '确认删除？',
      success: function (res) {
        if (res.confirm) {
          page.CommonEmailOprateFunc(evt, function (e) {
            if (e.data.code = "0000") {
              var pages = getCurrentPages();
              var prevPage = pages[pages.length - 2];
              prevPage.removeByEmailId(prevPage.data.currentMails, page.data.emailInfo.id);
              prevPage.setData({
                currentMails: prevPage.data.currentMails
              });
              wx.navigateBack({
                emailId: page.data.emailInfo.id
              })
            }
          });
        } else if (res.cancel) {

        }
      }
    })
  },
  bindPopMailMark: function () {
    this.setData({
      IsPopEmailMark: true,
      IsPopMore: false
    });
  },
  markInput: function (e) {
    this.setData({
      bakTemp: e.detail.value
    })
  },
  bindMailMark: function (e) {
    this.setData({
      IsPopMore: true,
      IsPopEmailMark: false,
    });
    var page = this;
    var postData = page.getCommonParam();
    postData.Bak = page.data.bakTemp;
    postData.id = page.data.emailInfo.id;
    wx.request({
      url: app.globalData.transServer + "api/mail/Update",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "TransToURL": app.globalData.server + "api/mail/Update" //http://116.62.232.164:9898/
      },
      method: "POST",
      data: postData,
      success: function (e) {
        if (e.data.code = "0000") {
          page.data.emailInfo.Bak = page.data.bakTemp;
          page.setData({
            emailInfo: page.data.emailInfo
          });
          wx.showToast({
            title: '操作成功！',
            icon: 'loading',
            duration: 1500
          })
        }

      }
    });
  }
  , bindMailStar: function (evt) {
    var page = this;
    page.CommonEmailOprateFunc(evt, function (e) {
      if (e.data.code = "0000") {
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        page.data.emailInfo.star = !page.data.emailInfo.star || null;
        prevPage.setEmailStar(prevPage.data.currentMails, page.data.emailInfo.id, page.data.emailInfo.star);
        page.setData({
          emailInfo: page.data.emailInfo
        });
        prevPage.setData({
          currentMails: prevPage.data.currentMails
        });
        wx.showToast({
          title: page.data.emailInfo.star ? '加星成功！' : "取消加星！",
          icon: 'loading',
          duration: 1500
        })
      }
    });
  }
  //标签
  , bindMailTag: function () {
    this.setData({
      IsLabelsPop: true,
      IsPopMore: false
    });
  }
  , bindLabelsCheckboxChange: function (e) {
    this.setData({
      selectedLabels: e.detail.value
    });
  }
  , bindLabelsSubmitSelected: function () {
    this.data.emailInfo.MailLabel = this.data.selectedLabels.join(",");
    this.data.emailInfo.EmailLabelShows = this.getLabelArr(this.data.emailInfo.MailLabel);
    var page = this;
    var postData = page.getCommonParam();
    postData.MailLabel = this.data.selectedLabels.join(",");
    postData.id = page.data.emailInfo.id;
    wx.request({
      url: app.globalData.transServer + "api/mail/Update",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "TransToURL": app.globalData.server + "api/mail/Update" //http://116.62.232.164:9898/
      },
      method: "POST",
      data: postData,
      success: function (e) {
        if (e.data.code = "0000") {
          page.setData({
            emailInfo: page.data.emailInfo,
            IsLabelsPop: false,
            IsPopMore: true
          });  
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];    
          prevPage.setEmailLabel(prevPage.data.currentMails, page.data.emailInfo.id, page.data.emailInfo)    
        }

      }
      })
  }
  , bindHideTagPop: function () {
    this.setData({
      IsLabelsPop: false,
      IsPopMore: true
    });
  }
  , bindHandled: function (evt) {
    var page = this;
    page.CommonEmailOprateFunc(evt, function (e) {
      if (e.data.code = "0000") {
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        page.data.emailInfo.Read = page.data.emailInfo.Read == "是" ? "否" : "是";
        prevPage.setEmailRead(prevPage.data.currentMails, page.data.emailInfo.id, page.data.emailInfo.Read);
        prevPage.setData({
          currentMails: prevPage.data.currentMails
        });
        wx.showToast({
          title: page.data.emailInfo.Read == "是" ? '已标记已读！' : "已标记未读！",
          icon: 'loading',
          duration: 1500
        })
      }
    });
  }
  //移动
  , bindMailMoveTop: function () {
    this.setData({
      IsEmailMovePop: true,
      IsPopMore: false
    });
  }
  , bindAllPath: function () {
    this.setData({
      IsBoxesShow: true,
      IsFolderShow: false
    });
  }
  , bindBoxSelect: function (e) {
    var id = e.currentTarget.dataset.text;
    if (id === "zn") {
      wx.showToast({
        title: "不能移动到智能文件夹！",
        icon: 'loading',
        duration: 1500
      });
      return;
    }
    this.getEmailBoxMenus("m_" + id);
    this.data.MovePart.selectedBoxId = id;
    this.setData({
      IsBoxesShow: false,
      IsFolderShow: true,
      MovePart: this.data.MovePart
    });
  }
  , bindMoveSubmit: function () {
    var page = this;
    var postData = page.setMoveParam();
    wx.request({
      url: app.globalData.transServer + "api/mail/move",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "TransToURL": app.globalData.server + "api/mail/move" //http://116.62.232.164:9898/
      },
      method: "POST",
      data: postData,
      success: function (e) {
        if (e.data.code = "0000") {
          page.setData({
            IsBoxesShow: true,
            IsFolderShow: false,
            IsEmailMovePop: false,
            IsPopMore: true
          });
        }

      }
    });
  }
  , radioChange: function (e) {
    var id = e.detail.value;
    this.data.MovePart.selectFolderId = id;
    this.setData({
      MovePart: this.data.MovePart
    });
  }
  , setMoveParam: function () {
    var page = this;
    var postData = page.getCommonParam();
    postData.mailboxid = this.data.MovePart.selectedBoxId;
    postData.mailid = this.data.emailInfo.id;
    if (this.data.MovePart.selectFolderId.indexOf("b") == 0) {
      postData.box = this.data.MovePart.selectFolderId;
    } else {
      var pathArr = this.data.MovePart.selectFolderId.split("_");
      postData.rootid = pathArr[pathArr.length-1];
    }
    return postData;
  }
  //回复
  , bindReback: function (evt) {
    wx.navigateTo({
      url: '../work/work?Recs=' + this.data.emailInfo.FromEmail
    })
  },
  //下载
  bindDownloadFile:function(e){
    var state = e.currentTarget.dataset.state;
    if (state) {
      wx.openDocument({
        filePath: e.currentTarget.dataset.path
      })
      return;
    }
    var page = this;
    var id = e.currentTarget.dataset.text;
    var postData = page.getCommonParam();
    postData.fileid = id;
    postData.fileclass = 2;
    wx.request({
      url: app.globalData.transServer + "api/file/GetFileUri", //仅为示例，并非真实的资源
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "TransToURL": app.globalData.server + "api/file/GetFileUri" //http://116.62.232.164:9898/
      },
      data: postData,
      success: function (res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          page.downloadFile(e.currentTarget,res.data.back.uri)
        }
      }
    });
  }
  , downloadFile: function (target,uri) {
    var page = this;
    uri = uri.replace("\\", "/"); 
    console.log(app.globalData.server + uri);
    const downloadTask = wx.downloadFile({
      //todo:下载待修改
      //url:"https://www.lufyluo.xyz/file/text text.xls",
      url: app.globalData.server+ uri, //仅为示例，并非真实的资源
      header: {       
        "download": app.globalData.transServer + uri, //http://116.62.232.164:9898/
        "TransToURL": app.globalData.server + uri
      },
      success: function (res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          page.updateFileState(target.dataset.text, true, res.tempFilePath);
         
        }
      }
    })
    downloadTask.onProgressUpdate((res) => {
      var emailInfo = this.data.emailInfo;
      var fileId = target.dataset.text;
      for (var item in emailInfo.file) {
        if (emailInfo.file[item].id == fileId) {
          emailInfo.file[item].percent = res.progress;
          this.setData({
            emailInfo: emailInfo
          });
        }
      }
      //console.log('下载进度', res.progress)
      //console.log('已经下载的数据长度', res.totalBytesWritten)
      //console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)

    });
  },
  updateFileState:function(fileId,state,path){
    var emailInfo = this.data.emailInfo;
    for (var item in emailInfo.file){
      if (emailInfo.file[item].id ==fileId){
        emailInfo.file[item].state = state;
        emailInfo.file[item].path = path;
        this.setData({
          emailInfo: emailInfo
        });
      }
    }
  }
  , updateReadState: function () {
    var page = this;
    var postData = page.getCommonParam();
    postData.mailid = page.data.emailInfo.Id;
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
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];
          prevPage.setRead(prevPage.data.currentMails, page.data.emailInfo.Id, "是");
        }

      }
    });
  },
  getEmailContent: function (id) {
    var page = this;
    var param = page.getCommonParam();
    param.MailId = id;
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
          e.data.back.Read = "是";
          page.setUpFiles(e.data.back.file);
          page.data.emailInfo = e.data.back;
          page.data.emailInfo.UserId = app.globalData.clientInfo.UserId;
          page.data.emailInfo.Password = app.globalData.clientInfo.Password;
          page.data.emailInfo.Ran = app.globalData.clientInfo.Ran;
          page.data.emailInfo.Sign = app.globalData.clientInfo.Sign;
          page.data.emailInfo.EmailLabelShows = page.getLabelArr(page.data.emailInfo.MailLabel);
          page.setData({
            emailInfo: page.data.emailInfo
          });
          WxParse.wxParse('article', 'html', page.data.emailInfo.htmlbody, page);
        }

      }
    });
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
  downloadFileComplete: function (fileId, path) {
    var files = this.data.emailInfo.files;
    for (var i = 0; i < files.length; i++) {
      if (files[i].id === fileId) {
        files[i].path = path;
        files[i].state = true;
        break;
      }

    }
  },
  setUpFiles: function (files) {
    for (var i = 0; i < files.length; i++) {
      files[i].byteToSize = this.bytesToSize(files[i].size);
      files[i].state = false;
    }
  },
  bytesToSize: function (bytes) {
    if (bytes === 0) return '0 B';
    var k = 1024;
    var sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    console.log("danwei: " + i);
    return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
    //toPrecision(3) 后面保留一位小数，如1.0GB                                                                                                                  //return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];  
  },
  getCommonParam: function () {
    var param = {
      UserId: app.globalData.clientInfo.UserId,
      Password: app.globalData.clientInfo.Password,
      Ran: app.globalData.clientInfo.Ran,
      Sign: app.globalData.clientInfo.Sign,
    }
    return param;
  }
  , CommonEmailOprateFunc: function (e, successCallBack) {
    var value = e.currentTarget.dataset.text;
    var action = e.currentTarget.dataset.action;
    var page = this;
    var postData = page.getCommonParam();
    var result = {};
    postData.mailid = page.data.emailInfo.id;
    postData.is = !value;
    wx.request({
      url: app.globalData.transServer + "api/mail/" + action,
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "TransToURL": app.globalData.server + "api/mail/" + action //http://116.62.232.164:9898/
      },
      method: "POST",
      data: postData,
      success: successCallBack,
    });
  }
  , getEmailBoxMenus: function (parentId) {
    if (this.getFolders(parentId)) {
      return;
    }
    var page = this;
    var postData = page.getCommonParam();
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
          page.data.MovePart.allFolders.push({ id: parentId, data: e.data.back });
          page.data.MovePart.Folders = e.data.back;
          page.setData({
            MovePart: page.data.MovePart
          });
        }

      }
    });
  }
  , getFolders: function (parentId) {
    var allFolders = this.data.MovePart.allFolders;
    for (var i = 0; i < allFolders.length; i++) {
      if (allFolders[i].id === parentId) {
        MovePart.Folders = allFolders[i].data;
        this.setData({
          MovePart: page.data.MovePart
        });
        return true;
      }
    }
    return false;
  }
  , getLabels: function () {
    var page = this;
    //todo:change
    var postData = page.getCommonParam();
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
  setUpdateParam: function () {

  }
})