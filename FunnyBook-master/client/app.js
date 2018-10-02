/**
 * @fileOverview 微信小程序的入口文件
 */

var qcloud = require('./vendor/wafer2-client-sdk/index');
var qcloudconfig = require('./config');
var config = require('comm/script/config')
const utils = require('./util/util.js')

App({
    /**
     * 小程序初始化时执行，我们初始化客户端的登录地址，以支持所有的会话操作
     */
    globalData: {
      userInfo: null,
      history:[],
    },
    onLaunch() {
      qcloud.setLoginUrl(qcloudconfig.service.loginUrl);
      wx.showModal({
          title: 'a',
          content: 'a',
      })
      // 获取用户信息
      this.getUserInfo()
      //初始化缓存
      this.initStorage()
      //聊天机器人调用API从本地缓存中获取数据
      var logs = wx.getStorageSync('logs') || []
      logs.unshift(Date.now())
      wx.setStorageSync('logs', logs)
      //自动翻译页面获取缓存
      wx.getStorage({
        key: 'history',
        success: (res) => {
          this.globalData.history = res.data
        },
        fail: (res) => {
          console.log("get storage failed")
          console.log(res)
          this.globalData.history = []
        }
      })
    },
    getUserInfo: function (cb) {
      var that = this
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    },
    getCity: function (cb) {
      var that = this
      wx.getLocation({
        type: 'gcj02',
        success: function (res) {
          var locationParam = res.latitude + ',' + res.longitude + '1'
          wx.request({
            url: config.apiList.baiduMap,
            data: {
              ak: config.baiduAK,
              location: locationParam,
              output: 'json',
              pois: '1'
            },
            method: 'GET',
            success: function (res) {
              config.city = res.data.result.addressComponent.city.slice(0, -1)
              typeof cb == "function" && cb(res.data.result.addressComponent.city.slice(0, -1))
            },
            fail: function (res) {
              // 重新定位
              that.getCity();
            }
          })
        }
      })
    },
  // 权限询问
  getRecordAuth: function () {
    wx.getSetting({
      success(res) {
        console.log("succ")
        console.log(res)
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              console.log("succ auth")
            }, fail() {
              console.log("fail auth")
            }
          })
        } else {
          console.log("record has been authed")
        }
      }, fail(res) {
        console.log("fail")
        console.log(res)
      }
    })
  },
  onHide: function () {
    wx.stopBackgroundAudio()
  },
    initStorage: function () {
      wx.getStorageInfo({
        success: function (res) {
          // 判断电影收藏是否存在，没有则创建
          if (!('film_favorite' in res.keys)) {
            wx.setStorage({
              key: 'film_favorite',
              data: []
            })
          }
          // 判断人物收藏是否存在，没有则创建
          if (!('person_favorite' in res.keys)) {
            wx.setStorage({
              key: 'person_favorite',
              data: []
            })
          }
          // 判断电影浏览记录是否存在，没有则创建
          if (!('film_history' in res.keys)) {
            wx.setStorage({
              key: 'film_history',
              data: []
            })
          }
          // 判断人物浏览记录是否存在，没有则创建
          if (!('person_history' in res.keys)) {
            wx.setStorage({
              key: 'person_history',
              data: []
            })
          }
          // 个人信息默认数据
          var personInfo = {
            name: '',
            nickName: '',
            gender: '',
            age: '',
            birthday: '',
            constellation: '',
            company: '',
            school: '',
            tel: '',
            email: '',
            intro: ''
          }
          // 判断个人信息是否存在，没有则创建
          if (!('person_info' in res.keys)) {
            wx.setStorage({
              key: 'person_info',
              data: personInfo
            })
          }
          // 判断相册数据是否存在，没有则创建
          if (!('gallery' in res.keys)) {
            wx.setStorage({
              key: 'gallery',
              data: []
            })
          }
          // 判断背景卡选择数据是否存在，没有则创建
          if (!('skin' in res.keys)) {
            wx.setStorage({
              key: 'skin',
              data: ''
            })
          }
        }
      })
    }
});