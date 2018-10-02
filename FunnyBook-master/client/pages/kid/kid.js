// pages/kid/kid.js
const util = require("../../util/util.js");
const config = require("../../config.js");
const siPlugin = requirePlugin("WechatSI"); // 微信同声传译插件
const siManager = siPlugin.getRecordRecognitionManager(); // 获取全局唯一的语音识别管理器

Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordStatus: 0, // 录音状态，0=未说话，1=正在说
  },

  chatBot: {
    consts: { // 图灵机器人 API v1.0 -> v2.0
      key: "d902e6d8dbdd43bb9914f1e2d125fcdc", // 图灵机器人密钥
      url: "http://openapi.tuling123.com/openapi/api/v2", // 图灵机器人请求url
      tag: "chatBot:", // 日志输出的开头
      ansWhenWelcome: "小朋友，试试和我说话吧 \\^_^/",
      ansWhenNoInput: "哎呀，我刚刚走神了，你能再说一遍吗？", // 当语音识别结果为空白
      ansWhenBotFailed: "你可把我难倒了！", // 当图灵机器人返回错误（但request是成功发出的）
      ansWhenRequestFailed: "我回答不上来，会不会是网络开小差了？", // 当request失败
      proposeWhenBook: function(bookName){return "你是不是想找《" + bookName +"》这本书？"}, // 当触发语料且语料是book类型
      proposeWhenPage: function(pageName){return "你想跳转到" + pageName + "页面吗？"}, // 当触发语料且语料是page类型
    },
    ask: "",
    ans: "",
    // -1: ans为空           0: 来自机器人的普通文本        1: 设置好的固定回答
    // 10: 触发语料，书      11: 触发语料，页面
    ansType: -1,
    chatBubble: undefined,
    chatButton: undefined,
    jumpCard: undefined,
    audioUrl: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initChatBotOnLoad();
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
    /**
     * 这个函数一定要在此处调用，不能移到onLoad()或者onReady()
     * 因为它注册了RecordRecognitionManager的回调函数
     * 它的子页面可能也会用到RecordRecognitionManager并注册其他回调函数
     * 但RecordRecognitionManager是全局唯一的
     * 故每次回到此页面都要重新注册。只有onShow()是每次回来都会调用的。
     */
    this.initChatBotOnShow();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.stopBackgroundAudio();
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

  /**
  * 用户点击鸡蛋：进入勋章界面
  */
  ToEgg: function () {
    wx.navigateTo({
      url: "../../pages/medal/medal"
    })
  },

  /**
   * 用户点击小鸡：进入积分排行榜
   */
  ToChick: function () {
    wx.navigateTo({
      url: "../../pages/score/score"
    })
  },

  /**
   * 用户点击房子：进入浏览历史
   */
  ToHouse: function () {
    wx.navigateTo({
      url: "../../pages/history/history"
    })
  },

  /**
   * 以下是小鸡聊天相关函数
   */

  /**
   * 按住按钮开始录音
   */
  recordStart: function (event) {
    wx.stopBackgroundAudio();
    this.chatBot.ask = "";
    this.chatBot.ans = "";
    this.chatBot.ansType = -1;
    siManager.start({
      lang: "zh_CN",
    });
    this.chatBot.chatBubble.show(false);
    this.setData({
      recordStatus: 1,
    });
    this.chatBot.chatButton.setStatus('pressed');
    console.log(this.chatBot.consts.tag, 'recording ...');
  },

  /**
   * 松开按钮结束录音
   */
  recordEnd: function (event) {
    if (this.data.recordStatus == 1) {
      console.log(this.chatBot.consts.tag, 'record stop');
      siManager.stop();
      this.setData({
        recordStatus: 0,
      });
      this.chatBot.chatButton.setStatus('busy');
    }
  },

  /**
   * 请求图灵机器人
   */
  turingBot: function (e) {
    function _requestBody() {
      return {
        reqType: 0,
        perception: {
          inputText: {
            text: that.chatBot.ask,
          },
        },
        userInfo: {
          apiKey: that.chatBot.consts.key,
          userId: "idontknow"
        }
      }
    }
    let that = this;
    if(!that.chatBot.ask) {
      that.chatBot.ans = that.chatBot.consts.ansWhenNoInput;
      that.chatBot.ansType = 1;
      that.chatBot.chatBubble.setText(that.chatBot.ans);
      that.chatBot.chatBubble.show(true);
      console.log(that.chatBot.consts.tag, "ask is BLANK, ans will be fixed");
      that.xfTts();
    }
    else {
      wx.request({
        url: that.chatBot.consts.url,
        method: "POST",
        data: _requestBody(),
        header: {
          'Content-Type': 'application/json'
        },
        //请求成功的回调
        success: function (res) {
          let data = res.data;
          // 官方文档对于code及意义语焉不详，这只是猜测
          if(data.intent.code == 10034) { // 触发语料
            let target = JSON.parse(data.results[0].values.text);
            let text = "";
            if (target.targetType == 'book')
              text = that.chatBot.consts.proposeWhenBook(target.targetName);
            else if (target.targetType == 'page')
              text = that.chatBot.consts.proposeWhenPage(target.targetName);
            that.chatBot.ans = {
              text: text,
              target: target,
            };
            that.chatBot.ansType = 10;
            console.log(that.chatBot.consts.tag, "triggered keyword", that.chatBot.ans);
          }
          // case 10004: // 普通文本
          // case 10009: // 问算术题
          // case 10008: // 问天气
          // case 10037: // 问酒店
          else if(data.intent.code >= 10000) { // 没有触发语料的普通回答
            that.chatBot.ans = data.results[0].values.text;
            that.chatBot.ansType = 0;
            console.log(that.chatBot.consts.tag, "got ans from robot:", that.chatBot.ans);
          }
          else { // 聊天机器人返回错误
            that.chatBot.ans = that.chatBot.consts.ansWhenBotFailed;
            that.chatBot.ansType = 1;
            console.warn(that.chatBot.consts.tag, "request succeeded but turing bot returned code", data.intent.code, data);
            console.log(that.chatBot.consts.tag, "ans will be fixed");
          }
        },
        fail: function (res) {
          that.chatBot.ans = that.chatBot.consts.ansWhenRequestFailed;
          that.chatBot.ansType = 1;
          console.warn(that.chatBot.consts.tag, "request failed, res =", res);
          console.log(that.chatBot.consts.tag, "ans will be fixed");
        },
        complete: function (res) {
          if(that.chatBot.ansType >= 0 && that.chatBot.ansType < 10) {
            that.chatBot.chatBubble.setText(that.chatBot.ans);
            that.chatBot.chatBubble.show(true);
          }
          else if (that.chatBot.ansType >= 10) {
            that.chatBot.jumpCard.setTarget(that.chatBot.ans.target);
            that.chatBot.jumpCard.show(true);
          }
          that.xfTts();
        }
      })
    }
  },

  /**
   * 向服务器请求调用讯飞TTS(Text-To-Speech) API
   */
  xfTts: function () {
    let that = this;
    let content = "";
    if(that.chatBot.ansType >= 0 && that.chatBot.ansType < 10)
      content = that.chatBot.ans;
    else if(that.chatBot.ansType >= 10)
      content = that.chatBot.ans.text;
    if(!content) return;
    wx.request({
      url: config.service.ttsUrl,
      method: "POST",
      data: {
        text: content,
      },
      success: function (res) {
        if(res.data.data.code == 0) {
          if(res.data.data.msg != "") {
            that.chatBot.audioUrl = res.data.data.msg;
            console.log(that.chatBot.consts.tag, "audio url:", res.data.data.msg);
            that.playAnsAudio();
          }
          else {
            console.warn(that.chatBot.consts.tag, "tts returned 0 but no audio url");
            wx.showToast({
              title: '语音输出失败',
              icon: 'none',
            });
            that.chatBot.chatButton.setStatus('normal');
            that.chatBot.chatBubble.show(false, 3000); 
          }
        }
        else {
          console.warn(that.chatBot.consts.tag, "tts failed", res.data.data);
          wx.showToast({
            title: '语音输出失败',
            icon: 'none',
          });
          that.chatBot.chatButton.setStatus('normal');
          that.chatBot.chatBubble.show(false, 3000); 
        }
      },
      fail: function (res) {
        console.warn(that.chatBot.consts.tag, "tts request failed:", res);
        wx.showToast({
          title: '语音输出失败',
          icon: 'none',
        });
        that.chatBot.chatButton.setStatus('normal');
        that.chatBot.chatBubble.show(false, 3000); 
      }
    });
  },

  /**
   * 播放语音
   */
  playAnsAudio: function () {
    let that = this;
    wx.playBackgroundAudio({
      dataUrl: that.chatBot.audioUrl,
      title: '趣玩书吧',
      success: (res) => {
        console.log(that.chatBot.consts.tag, "play audio succeeded");
      },
      fail: (res) => {
        console.warn(that.chatBot.consts.tag, "play audio failed, with play path =", play_path);
        wx.showToast({
          title: '语音播放失败',
          icon: 'none',
        });
      },
    })
  },


  initChatBotOnLoad: function () {
    let that = this;

    // 获取组件实例
    that.chatBot.chatBubble = that.selectComponent("#chat-bubble");
    that.chatBot.chatButton = that.selectComponent("#chat-button");
    that.chatBot.jumpCard = that.selectComponent("#jump-card");

    // 显示欢迎语
    that.chatBot.chatBubble.setText(that.chatBot.consts.ansWhenWelcome);
    that.chatBot.chatBubble.show(true);
    that.chatBot.chatBubble.show(false, 2500); 

    console.log(that.chatBot.consts.tag, "onLoad初始化完成");
  },

  /**
   * 初始化，注册一些回调函数
   */
  initChatBotOnShow: function () {
    let that = this;
    let manager = siManager;

    // 设置录音状态
    that.setData({
      recordStatus: 0,
    });
    
    //有新的识别内容返回，则会调用此事件
    siManager.onRecognize = (res) => {
      that.chatBot.ask = res.result;
    }

    // 识别结束事件
    siManager.onStop = (res) => {
      console.log(that.chatBot.consts.tag, "result:", res.result);
      that.chatBot.ask = res.result;
      that.turingBot();
    }

    // 识别错误事件
    siManager.onError = (res) => {
      console.warn(that.chatBot.consts.tag, "errCode:", res.retcode, ", errMsg:", res.msg);
      if(that.data.recordStatus != 0) {
        manager.stop();
      }
      // 再set一下，确保各种乱七八糟的错误情况能结束
      that.setData({
        recordStatus: 0,
      });
      that.chatBot.chatButton.setStatus('normal');
    }

    // 背景播放开始事件
    wx.onBackgroundAudioPlay(function () {
      that.chatBot.chatButton.setStatus('normal');
    });

    // 背景播放结束事件
    wx.onBackgroundAudioStop(function() {
      that.chatBot.chatBubble.show(false);
    });

    // 启用按钮
    that.chatBot.chatButton.setStatus('normal');
    console.log(that.chatBot.consts.tag, "onShow初始化完成");
  },

})