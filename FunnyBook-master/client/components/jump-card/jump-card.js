Component({
  properties: {
    
  },

  data: {
    isShow: false,
    target: {
      name: "",
      image: "",
      text: "",
      link: "",
    },
    topPercent: 50,
  },

  methods: {
    onTapMask: function() {
      this.show(false);
    },

    preventTouchMove: function() {
      ; // 保持为空
    },

    onCancel: function() {
      this.show(false);
    },

    onJump: function() {
      this.show(false);
      wx.navigateTo({
        url: this.data.target.link,
      });
    },

    show: function(b) {
      this.setData({
        isShow: b,
      });
    },

    // 仅演示用
    // 实际应通过数据库查到t对应的图片、介绍等
    setTarget: function(t) {
      if(t.targetType == 'book') {
        this.data.target = {
          name: t.targetName,
          image: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1533641577698&di=e88ffdf215225abdf65a879c14f84297&imgtype=0&src=http%3A%2F%2Fi1.qhimg.com%2Fdr%2F270_500_%2Ft01b9df3be9ecffa952.jpg", // 仅做演示
          text: "《" + t.targetName + "》 某某 著\n某某某出版社",
          link: "../filmDetail/filmDetail",
        }
      }
      else { // t.targetType == 'page'
        this.data.target = {
          name: t.targetName,
          image: "",
          text: "小程序内页面： " + t.targetName,
          link: "../board/board",
        }
      }
      let top = 50;
      if(this.data.target.image) {
        top -= 35;
      }
      if(this.data.target.text) {
        top -= 10;
      }
      this.setData({
        target: this.data.target,
        topPercent: top,
      });
    }
  }
})
