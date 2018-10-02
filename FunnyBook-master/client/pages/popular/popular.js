var douban = require('../../comm/script/fetch')
var config = require('../../comm/script/config')
// 获取全局应用程序实例对象
Page({
	data: {
		films: [],
		hasMore: true,
		showLoading: true,
		start: 0,
	},
	onLoad: function() {
		var that = this
    douban.fetchFilms.call(that, config.apiList.popular, that.data.start)
	},
	onPullDownRefresh: function() {
		var that = this
		that.setData({
			films: [],
			hasMore: true,
			showLoading: true,
			start: 0
		})
		this.onLoad()
	},
	onReachBottom: function() {
		var that = this
		if (!that.data.showLoading) {
			douban.fetchFilms.call(that, config.apiList.popular, that.data.start)
		}
	},
	viewFilmDetail: function(e) {
		var data = e.currentTarget.dataset;
		wx.navigateTo({
			url: "../filmDetail/filmDetail?id=" + data.id
		})
	},	
	viewFilmByTag: function(e) {
		var data = e.currentTarget.dataset
		var keyword = data.tag
		wx.navigateTo({
			url: '../searchResult/searchResult?url=' + encodeURIComponent(config.apiList.search.byTag) + '&keyword=' + keyword
		})
	},
})