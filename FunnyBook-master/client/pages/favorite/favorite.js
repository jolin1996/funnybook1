var filmNullTip = {
      tipText: '亲，书架上没有书哦',
      actionText: '去逛逛',
      routeUrl: '../../pages/popular/popular'
    }
var personNullTip = {
      tipText: '亲，找不到人物的书籍',
      actionText: '去逛逛',
      routeUrl: '../../pages/popular/popular'
    }
var compare = function (prop) {
  return function (obj1, obj2) {
    var val1 = obj1[prop];
    var val2 = obj2[prop];
    if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
      val1 = Number(val1);
      val2 = Number(val2);
    }
    if (val1 < val2) {
      return -1;
    } else if (val1 > val2) {
      return 1;
    } else {
      return 0;
    }
  }
}
let lastMoveTime=0
Page({
  data:{
    moveItemImagePath: "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2529206747.jpg",
    opaNum: 1,
    showMoveItem: 'no',
    showDelete: 'no',
    leftLooks: '20',
    topLooks: '20',
    film_favorite: [],
    film_favorite2: [],
    person_favorite: [],
    show: 'film_favorite',
    nullTip: filmNullTip,
    longpressed: false,
    myratio: [],
    myrheight: []
  },
  onLoad:function(options){
    var that = this
    console.log("---onload---")
    let tempdata1 ={
      id: "1",
      images: {
        large: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2526429256.jpg"
      },
      title: "肆式青春",
      order: 100
    } ;
    let tempdata2 = {
      id: "2",
      images: {
        large: "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p2529206747.jpg"
      },
      title: "西虹市首富",
      order: 200
    };
    let tempdata3 = {
      id: "3",
      title: "的士速递",
      order: 300,
      images: {
        large: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2529136453.jpg"
      },
      
    };
    let tempdata4 = {
      id: "4",
      images: {
        large: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2528763272.jpg"
      },
      title: "真心话大冒险",
      order: 400
    };
    let tempdata5 = {
      id: "5",
      images: {
        large: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p1910813120.jpg"
      },
      title: "霸王别姬",
      order: 500
    };
    let tempdata6 = {
      id: "6",
      images: {
        large: "https://img1.doubanio.com/view/photo/s_ratio_poster/public/p510876377.jpg"
      },
      title: "阿甘正传",
      order: 600
    };
    let tempdata7 = {
      id: "7",
      images: {
        large: "https://img3.doubanio.com/view/photo/s_ratio_poster/public/p480747492.jpg"
      },
      title: "肖申克的救赎",
      order: 700
    };
    let tempdatax = new Array();
    tempdatax[0]=tempdata1;
    tempdatax[1] = tempdata2;
    tempdatax[2] = tempdata3;
    tempdatax[3] = tempdata4;
    tempdatax[4] = tempdata5;
    tempdatax[5] = tempdata6;
    tempdatax[6] = tempdata7;
    wx.getSystemInfo({
      success: function (res) {
        let tmpratio = 750.0 / res.windowWidth
        let tmprheight = res.windowHeight*tmpratio
        console.log(res.windowHeight)
        that.setData({
          myratio: tmpratio,
          myrheight: tmprheight
        })
      }
    })
    console.log("init ratio")
    console.log(that.data.myratio)
    that.setData({
      film_favorite2: tempdatax
    })
    wx.getStorage({
      key: 'film_favorite',
      success: function(res){
        that.setData({
          film_favorite: res.data
        })
      }
    })
    wx.getStorage({
      key: 'person_favorite',
      success: function(res){
        that.setData({
          person_favorite: res.data
        })
      }
    })
    wx.stopPullDownRefresh()
  },
  viewFilmDetail: function(e) {
		var data = e.currentTarget.dataset
		wx.redirectTo({
			url: "../filmDetail/filmDetail?id=" + data.id
		})
  },
  viewPersonDetail: function(e) {
		var data = e.currentTarget.dataset
		wx.redirectTo({
			url: "../personDetail/personDetail?id=" + data.id
		})
  },
  changeViewType: function(e) {
    var data = e.currentTarget.dataset
    this.setData({
      show: data.type,
      nullTip: data.type == 'film_favorite' ? filmNullTip : personNullTip
    })
  },

  //按下事件开始
  mytouchstart: function (e) {
    let that = this;
    that.setData({
      touch_start: e.timeStamp
    })
    console.log(e.timeStamp + '- touch-start')
  },
  //按下事件结束
  mytouchend: function (e) {
    let that = this;
    console.log(that.data.film_favorite2)
    let tmpvar = that.data.film_favorite2
    //tmpvar[3].order=2
    console.log(e.currentTarget.dataset.id)
    tmpvar.forEach(function (v, i) {//v==value　为arr项，i==index　为arr索引
      console.log(i + '  ',v);
      if (v.id == e.currentTarget.dataset.id){
        console.log("find it！")
        that.setData({
          moveItemImagePath: v.images.large
        })
      }
    })

    that.setData({
      touch_end: e.timeStamp,
      film_favorite2: tmpvar,
      longpressed: true,
      leftLooks: e.touches[0].clientX - 30,
      topLooks: e.touches[0].clientY - 30,
      showMoveItem: 'yes',
      showDelete: 'yes',
      opaNum: 0.5
    })
    console.log(e.timeStamp + '- touch-end')
    
  },

  imagetouchmove: function (e) {
    var self = this;
    console.log("------move------")
    self.setData({
      leftLooks: e.touches[0].clientX - 30,
      topLooks: e.touches[0].clientY - 30,
    })
  },

  itemtouchend: function (e) {
    var self = this;
    console.log("------touchend------")
    console.log(e)
    console.log(e.changedTouches[0])
    
    console.log(self.data.myratio)
    console.log(self.data.myrheight)
    let myrx = e.changedTouches[0].clientX * self.data.myratio
    let myry = e.changedTouches[0].clientY * self.data.myratio
    console.log(myrx)
    console.log(myry)
    console.log(e.currentTarget.offsetLeft * self.data.myratio)
    console.log(e.currentTarget.offsetTop * self.data.myratio)

    let rowNum;
    let colNum;
    let originCol=23;
    let originRow=103;
    let deltaCol=235;
    let deltaRow=349;
    if (myrx > originCol && myrx < originCol+deltaCol){
      colNum=0
    }
    if (myrx > originCol + deltaCol && myrx < originCol + 2*deltaCol) {
      colNum = 1
    }
    if (myrx > originCol + 2*deltaCol && myrx < originCol + 3*deltaCol) {
      colNum = 2
    }
    if (myry > originRow && myry < originRow + deltaRow) {
      rowNum = 0
    }
    if (myry > originRow + deltaRow && myry < originRow + 2*deltaRow) {
      rowNum = 1
    }
    if (myry > originRow + 2*deltaRow && myry < originRow + 3*deltaRow) {
      rowNum = 2
    }
    let destOrderPos=rowNum*3+colNum
    console.log(rowNum)
    console.log(colNum)
    console.log(destOrderPos)
    let tmpvar = self.data.film_favorite2
    if (destOrderPos<tmpvar.length){
      console.log("move")
      console.log(tmpvar.length)

      let tmpvarSorted = tmpvar.sort(compare("order"))
      let src,dst,dst_prev,dst_prev_i;
      if (destOrderPos==0){
        dst_prev_i=-1;

      }
      else{
        dst_prev_i=destOrderPos-1;
      }

      tmpvarSorted.forEach(function (v, i) {//v==value　为arr项，i==index　为arr索引
        //console.log(i + '  ', v);
        if (i == destOrderPos) {
          console.log("find dest id！")
          console.log(i)
          console.log(v)
          dst=v
        }
        if (i == dst_prev_i) {
          console.log("find dest_prev id！")
          console.log(i)
          console.log(v)
          dst_prev = v
        }
      })

      tmpvar.forEach(function (v, i) {//v==value　为arr项，i==index　为arr索引
        //console.log(i + '  ', v);
        if (v.id == e.currentTarget.dataset.id) {
          console.log("find src！")
          console.log(i)
          if(dst_prev_i==-1){
            v.order =parseInt(dst.order/2)
          }
          else{
            v.order = parseInt((dst_prev.order + dst.order) / 2)
            console.log(dst_prev)
            console.log(dst)
            console.log((dst_prev.order + dst.order) / 2)
          }
          self.setData({
            film_favorite2: tmpvar,
          })
        }
      })
    console.log("-------")
    console.log(tmpvar)
    }

    if (myrx >= 750 - 20 - 140 && myrx <= 750 - 20 && myry >= self.data.myrheight-20-140 && myry <= self.data.myrheight-20){
      console.log("delete")

      //tmpvar[3].order=2
      console.log(e.currentTarget.dataset.id)
      tmpvar.forEach(function (v, i) {//v==value　为arr项，i==index　为arr索引
        console.log(i + '  ', v);
        if (v.id == e.currentTarget.dataset.id) {
          console.log("find it！")
          tmpvar.splice(i, 1);
          self.setData({
            film_favorite2: tmpvar,
          })
        }
      })

    }

    self.setData({
      longpressed: false,
      showMoveItem: 'no',
      showDelete: 'no',
      opaNum: 1
    })
  },

  imagetouchmove2: function (e) {
    var self = this;
    
    if (self.data.longpressed==true){
      console.log("------move2------")
      console.log(e)

      if (e.timeStamp-lastMoveTime>70){
        self.setData({
          leftLooks: e.touches[0].clientX - 30,
          topLooks: e.touches[0].clientY - 30
        })
        lastMoveTime = e.timeStamp
      }
      
    }
  },
})