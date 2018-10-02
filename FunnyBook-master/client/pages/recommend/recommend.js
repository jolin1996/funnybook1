import api from '../../util/api.js'
import util from '../../util/oneutil.js'

//测试数据:
var book1 = {
  bookID: 1,
  cover: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2526429256.jpg",
  title: "肆式青春肆式青春"
}
var book2 = {
  bookID: 5,
  cover: "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2529206747.jpg",
  title: "西虹市首富"
}
var book3 = {
  bookID: 3,
  cover: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2528763272.jpg",
  title: "真心话太冒险",
}
var book4 = {
  bookID: 8,
  cover: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p1910813120.jpg",
  title: "霸王别姬",
}
var book5 = {
  bookID: 4,
  cover: "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p510876377.jpg",
  title: "阿甘正传",
}
var book6 = {
  bookID: 6,
  cover: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p480747492.jpg",
  title: "肖申克的救赎",
}

Page({
  data: {
    vols: [],

    rec1Data: {
      title: "我是标题",
      subtitle: "哈哈哈哈哈哈哈我是副标题",
      books: []
    }
  },

  onLoad: function(options) {
    api.getVolIdList({
        success: (res) => {
          if (res.data.res === 0) {
            let idList = res.data.data
            this.getVols(idList)
          }
        }
      }),
      
      this.setData({
        ["rec1Data.books"]: [book1, book2, book3, book4, book5, book6]
      })
  },

  onPullDownRefresh: function() {
    this.setData({
      vols: []
    })
    api.getVolIdList({
      success: (res) => {
        if (res.data.res === 0) {
          let idList = res.data.data
          this.getVols(idList)
        }
      }
    }),

    this.setData({
      ["rec1Data.books"]: []
    })
    this.setData({
      ["rec1Data.books"]: [book1, book2, book3, book4, book5, book6] //后续将改为从数据库获取推荐书籍
    })

    wx.stopPullDownRefresh()
  },

  getVols: function(idList) {
    let vols = this.data.vols
    if (idList.length > 0) {
      api.getVolById({
        query: {
          id: idList.shift()
        },
        success: (res) => {
          if (res.data.res === 0) {
            let vol = res.data.data
            vol.hp_makettime = util.formatMakettime(vol.hp_makettime)
            vols.push(vol)
          }
          this.getVols(idList)
        }
      })
    }
    else {
      this.setData({
        vols
      })
    }
  },

  viewBookDetail: function(e) {
    var data = e.currentTarget.dataset
    wx.navigateTo({
      //url: "../bookDetail/bookDetail?id=" + data.id
    })
  }
})