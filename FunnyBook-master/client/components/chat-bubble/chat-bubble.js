Component({
  properties: {
    // ----- 非初始化阶段不应更改details属性 ---
    details: {
      type: Object,
      value: { // 数字单位皆为rpx
        fontSize: 36, // 字体大小（宽度）
        baselineHeight: 48, // 多行文字基线距离，须大于fontSize
        bubbleWidth: 600, // 气泡宽度，不包括圆弧部分
        padX: 26, // 文字左侧离气泡左侧的距离=...右侧...右侧...
        padY: 28, // 文字顶部离气泡顶部的距离=...底部...底部...
        r: 20, // 圆角半径
        triX: 80, // 三角形的直角边宽度
        triY: 50, // 三角形的直角边高度
        triLoc: "left", // 三角形在左侧还是右侧
        shortWidth: 100, // 三角形两侧线段中较短者的长度
        borderColor: 'yellowgreen',
        backgroundColor: 'yellow',
        textColor: 'black',
        lineWidth: 6,
      }
    },
  },

  data: {
    text: "",
    isShow: false,
    canvasHeight: 400,
    canvasWidth: 700,
    // ---
    textLines: [], // 将text分行
    realPadX: 0, // 算下来实际的padX
    realWidth: 0, // 算下来实际的bubbleWidth
    numChar: 0, // 一行能排下的文字字符数（汉字算2个）
    ox: 0, // 矩形左上顶点坐标（即长边和宽边的直角交点的定点）
    oy: 0, 
    upperHeight: 0, // 气泡不包括三角形部分的高度
    factor: 1, // 1rpx = ? px
  },

  methods: {
    // ------ 开放函数 -------------------
    show: function(b, ms) {
      if(!ms) ms = 0;
      var that = this;
      setTimeout(function() {
        if (b) {
          that.parseText();
          that.setSizes();
          that.clear();
          that.draw();
        }
        that.setData({ isShow: b });
      }, ms)
    },

    setText: function(text) {
      this.data.text = text;
    },

    setDetail(item, value) {
      if(item in this.details) {
        this.details[item] = value;
      }
      this.refresh();
    },

    // ----- 私有函数 ---------------------
    // 给文本分行。要求标点符号不能出现在行首。
    parseText: function() {
      // 数字符数，数到第l行倒数第d个字符
      function _count(lines, l, d) { 
        let c = 0;
        for (let i = 0; i <= l; i++) {
          c += lines[l].length;
        }
        return c-d+1;
      }
      // s的第0个字符开始，字符数不超过numChar（汉字算2个）
      function _stopAt(s, startAt, numChar) {
        let c = 0;
        for (let i = startAt; i < s.length; i++) {
          c += (s.charCodeAt(i) > 127 ? 2 : 1);
          if (c > numChar) {
            return i;
          }
        }
        return s.length;
      }
      function _division(s, numChar) {
        let lines = [];
        let start = 0, stop = 0;
        while (stop != s.length) {
          stop = _stopAt(s, start, numChar);
          lines.push(s.slice(start, stop));
          start = stop;
        }
        return lines;
      }
      function _modify(lines, s, pts) {
        // i从1开始，因为第0行不可能以标点开头的
        let i = 1;
        for(; i < lines.length; i++) {
          if (pts.indexOf(lines[i].charAt(0)) >= 0) {
            let back = 1;
            if(pts.indexOf(lines[i - 1].slice(-1)) >= 0) {
              back = 2;
              let maxBack = lines[i - 1].length - 1;
              while(back <= maxBack) {
                if(pts.indexOf(lines[i - 1].slice(-back, -back+1)) < 0)
                  break;
                back++;
              }
            }
            let newString = s.slice(_count(lines, i - 1, back + 1));
            let trueLines = lines.slice(0, i);
            trueLines[trueLines.length-1] = trueLines.slice(-1)[0].slice(0, -back);
            return {
              trueLinesPart: trueLines,
              newString: newString,
            }
          }
        }
        return {
          trueLinesPart: lines,
          newString: "",
        }
      }
      if (this.data.text == "") {
        this.data.textLines = [];
        return;
      }
      var pts = '，。！？…、：“”（）%@【】；—~,.?/;:\'\"\\_-()+=[]';
      var s = this.data.text;
      var trueLines = [];
      do {
        let tempLines = _division(s, this.data.numChar);
        let res = _modify(tempLines, s, pts);
        trueLines = trueLines.concat(res.trueLinesPart);
        s = res.newString;
      } while(s);
      this.data.textLines = trueLines;
    },

    // 基于分行得到的文字行数，计算各项尺寸
    setSizes: function() {
      // 数字符数（汉字算2个）
      function _countChars(s) {
        let c = 0;
        for (let i = 0; i < s.length; i++) {
          c += (s.charCodeAt(i) > 127 ? 2 : 1);
        }
        return c;
      }
      let numLine = this.data.textLines.length;
      let textHeight = this.data.details.baselineHeight * (numLine - 1) + this.data.details.fontSize; // 文字区域总高度
      this.data.upperHeight = textHeight + this.data.details.padY * 2; // 上半部分（不包括三角形）的高度
      this.data.canvasHeight = this.data.upperHeight + this.data.details.triY + 20; // 画布高度
      this.data.realWidth = (numLine == 1 ? Math.max(_countChars(this.data.textLines[0]) * 0.5 * this.data.details.fontSize + this.data.realPadX * 2, this.data.details.triX + this.data.details.shortWidth + this.data.details.r * 2) : this.data.details.bubbleWidth);
      this.data.canvasWidth = this.data.realWidth + 20; // 画布宽度
      this.data.ox = 10;
      this.data.oy = 10;
      this.setData({
        canvasHeight: this.data.canvasHeight,
        canvasWidth: this.data.canvasWidth,
      })
    },

    clear: function() {
      let ctx = wx.createCanvasContext('canvas', this);
      ctx.clearRect(0,0,this.data.canvasWidth, this.data.canvasHeight);
    },

    // 绘制气泡和文字
    draw: function() {
      let ctx = wx.createCanvasContext('canvas', this);
      
      let f = this.data.factor;
      let px = this.data.ox * f;
      let py = this.data.oy * f;
      let w = this.data.realWidth * f;
      let h = this.data.upperHeight * f;
      let r = (this.data.details.r * 2 < this.data.upperHeight ? this.data.details.r * f : h / 2);
      let iw = w - 2 * r; // inner w
      let ih = h - 2 * r; // inner h
      let tx = this.data.details.triX * f;
      let ty = this.data.details.triY * f;
      let sht = this.data.details.shortWidth * f;
      let pi = Math.PI;
      let tl = this.data.textLines;
      let dx = this.data.realPadX * f;
      let dy = this.data.details.padY * f;
      let bh = this.data.details.baselineHeight * f;
      let fts = this.data.details.fontSize * f;

      // 画气泡
      ctx.moveTo(px + r, py);
      ctx.lineTo(px + r + iw, py);
      ctx.arc(px + r + iw, py + r, r, pi * 1.5, 0);
      ctx.lineTo(px + w, py + r + ih);
      ctx.arc(px + r + iw, py + r + ih, r, 0, pi * 0.5);
      if(this.data.details.triLoc == "left") {
        ctx.lineTo(px + sht + tx, py + h);
        ctx.lineTo(px + sht + tx, py + h + ty);
        ctx.lineTo(px + sht, py + h);
      }
      else {
        ctx.lineTo(px + w - sht, py + h);
        ctx.lineTo(px + w - sht - tx, py + h + ty);
        ctx.lineTo(px + w - sht - tx, py + h);
      }
      ctx.lineTo(px + r, py + h);
      ctx.arc(px + r, py + r + ih, r, pi * 0.5, pi);
      ctx.lineTo(px, py + r);
      ctx.arc(px + r, py + r, r, pi, pi * 1.5);

      ctx.setLineWidth(this.data.details.lineWidth * f);
      ctx.setStrokeStyle(this.data.details.borderColor);
      ctx.stroke();
      ctx.setFillStyle(this.data.details.backgroundColor);
      ctx.fill();
      
      // 画文字
      ctx.setFillStyle(this.data.details.textColor);
      ctx.setTextAlign('center');
      ctx.setTextBaseline('bottom');
      ctx.setFontSize(fts);
      for(let i = 0; i < tl.length; i++) {
        // 坐标为文字基线的左端点的坐标
        ctx.fillText(tl[i], px + 0.5 * w, py + dy + fts + i * bh);
      }
      
      ctx.draw();
      
    },

    // 更改details中的参数后，更新相关的参数
    refresh: function() {
      this.data.numChar = Math.round((this.data.details.bubbleWidth - 2 * this.data.details.padX) / this.data.details.fontSize) * 2;
      this.data.realPadX = Math.round((this.data.details.bubbleWidth - this.data.numChar / 2 * this.data.details.fontSize) / 2);
    }
  },

  created: function() {
    this.data.factor = wx.getSystemInfoSync().screenWidth / 750;
    console.log("got screen info: 1 rpx =", this.data.factor, "px");
    this.refresh();
  }
})
