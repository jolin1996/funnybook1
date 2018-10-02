var config = require('../../comm/script/config')

var app = getApp();
Page({
  data:{
    gridList: [
      { enName: 'favorite', zhName: '书架', "ico": "13.png",},
      { enName: 'history', zhName: '孩子喜欢', "ico": "15.png",},
      { enName: 'shake', zhName: '摇一摇', "ico": "11.png",},
      { enName: 'gallery', zhName: '相册', "ico": "12.png",},
      { enName: 'setting', zhName: '设置', "ico": "16.png",},
      { enName: 'index', zhName: '后台及聊天室', "ico": "15.png", },
      { enName: 'kid', zhName: '孩子界面', "ico": "11.png", },
      { enName: 'dbTest', zhName: '数据库测试', "ico": "13.png" }
    ],
    skin: ''
  },
  onLoad:function(cb){
    var that = this
    console.log(app.globalData.userInfo)
    // 检测是否存在用户信息
    if (app.globalData.userInfo != null) {
      that.setData({
          userInfo: app.globalData.userInfo
      })
    } else {
      app.getUserInfo()
    }
    typeof cb == 'function' && cb()
  },
  onShow:function(){
    var that = this
    wx.getStorage({
      key: 'skin',
      success: function(res){
        if (res.data == "") {
          that.setData({
            skin: config.skinList[0].imgUrl
          })
        } else {
          that.setData({
            skin: res.data
          })
        }
      }
    })
  },
  onPullDownRefresh: function() {
    this.onLoad(function(){
      wx.stopPullDownRefresh()
    })
  },
  viewGridDetail: function(e) {
    var data = e.currentTarget.dataset
		wx.navigateTo({
			url: "../" + data.url + '/' + data.url
		})
  },
  viewSkin: function() {
		wx.navigateTo({
			url: "../skin/skin"
		})
  }
})