var douban = require('../../comm/script/fetch')
var config = require('../../comm/script/config')
// 获取全局应用程序实例对象
var douban2 = require('../../util/douban.js')
var app = getApp()
Page({
  data: {
    films: [],
    hasMore: true,
    showLoading: true,
    start: 0,
    bannerList: config.bannerList,
    boards: [
      { key: 'in_theaters', list: '../coming/coming' },
      { key: 'coming_soon', list: '../coming/coming' },
      { key: 'new_movies', list: '../popular/popular' },
      { key: 'top250', list: '../top/top' },
      // { key: 'weekly' },
      // { key: 'us_box' }
    ]
  },
  onLoad: function () {
    var that = this
    wx.showNavigationBarLoading()
    app.getCity(function () {
      wx.hideNavigationBarLoading()
      wx.setNavigationBarTitle({
        title: '书库 - ' + config.city
      })
      douban.fetchFilms.call(that, config.apiList.popular, that.data.start)
    })
    const tasks = this.data.boards.map(board => {
      return douban2.find(board.key, 1, 8)
        .then(d => {
          board.title = d.title
          board.movies = d.subjects
          return board
        })
    })

    Promise.all(tasks).then(boards => {
      this.setData({ boards: boards, loading: false })
      wx.hideLoading()
    })
  },
  onPullDownRefresh: function () {
    var that = this
    that.setData({
      films: [],
      hasMore: true,
      showLoading: true,
      start: 0
    })
    this.onLoad()
  },
  onReachBottom: function () {
    var that = this
    if (!that.data.showLoading) {
      douban.fetchFilms.call(that, config.apiList.popular, that.data.start)
    }
  },
  viewBannerDetail: function (e) {
    var data = e.currentTarget.dataset
    if (data.type == 'film') {
      wx.navigateTo({
        url: "../filmDetail/filmDetail?id=" + data.id
      })
    } else if (data.type == 'person') {
      wx.navigateTo({
        url: '../personDetail/personDetail?id=' + data.id
      })
    } else if (data.type == 'search') {
      // stype(searchType) 0:关键词, 1:类型标签
      var searchUrl = stype == 'keyword' ? config.search.byKeyword : config.search.byTag
      wx.navigateTo({
        url: '../searchResult/searchResult?url=' + encodeURIComponent(searchUrl) + '&keyword=' + keyword
      })
    }
  },
  viewSearch: function () {
    wx.navigateTo({
      url: '../search/search'
    })
  }
})