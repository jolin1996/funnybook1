var kidNullTip = {
  tipText: '亲，您还没有添加您的孩子 >_<',
  actionText: '去添加',
  routeUrl: '../setting/setting'
}

//测试数据:
var kid1 = {
  kidID: 111,
  name: '达达',
  sex: 1,
  picture: './tmp/dada.jpg',
  age: 5
}
var kid2 = {
  kidID: 112,
  name: '小美',
  sex: 0,
  picture: './tmp/xiaomei.jpg',
  age: 4
}

Page({
  data: {
    kids: [],
    nullTip: kidNullTip
  },

  onShow: function() {
    this.setData({ //后续将改为从数据库获取孩子列表
      kids: [kid1, kid2]
    })
  },

  onPullDownRefresh: function() {
    this.setData({
      kids: []
    })
    this.setData({ //后续将改为从数据库获取孩子列表
      kids: [kid1, kid2]
    })
    wx.stopPullDownRefresh()
  },

  viewReport: function(e) {
    var data = e.currentTarget.dataset
    wx.navigateTo({
      url: "../report/report?id=" + data.id
    })
  }
})