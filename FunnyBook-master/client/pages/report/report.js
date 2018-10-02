import * as echarts from '../../util/ec-canvas/echarts';

//测试数据:
var kid1 = {
  kidID: 111,
  name: '达达',
  sex: 1,
  picture: '../reportSelect/tmp/dada.jpg',
  age: 5,
  radar: [86, 68, 100, 60, 98, 80],
  pie: [2, 5, 3, 2, 4],
  line: [14, 10, 0, 21, 12],
  time: 105,
  acc: 16,
  points: 12
}
var kid2 = {
  kidID: 112,
  name: '小美',
  sex: 0,
  picture: '../reportSelect/tmp/xiaomei.jpg',
  age: 4,
  radar: [80, 96, 87, 80, 94, 70],
  pie: [4, 3, 3, 2, 6],
  line: [15, 16, 12, 0, 20],
  time: 120,
  acc: 18,
  points: 13
}
var allKids = [kid1, kid2]

Page({
  data: {
    kid: {},
    ecRadar: {},
    ecPie: {},
    ecLine: {},
    ecBar: {}
  },

  onLoad: function(options) {
    for (var i = 0; i < allKids.length; i++) //后续将改为根据kidID从数据库查找孩子信息和报告
    {
      if (allKids[i].kidID == options.id) {
        this.setData({
          kid: allKids[i]
        })
        break
      }
    }

    this.radarComponent = this.selectComponent('#radar')
    this.radarComponent.init((canvas, width, height) => {
      const radarChart = echarts.init(canvas, null, {
        width: width,
        height: height
      })
      var radarOpt = {
        backgroundColor: "#ffffff",
        xAxis: {
          show: false
        },
        yAxis: {
          show: false
        },
        radar: {
          radius: '70%',
          indicator: [{
              name: '能力1',
              max: 100
            },
            {
              name: '能力2',
              max: 100
            },
            {
              name: '能力3',
              max: 100
            },
            {
              name: '能力4',
              max: 100
            },
            {
              name: '能力5',
              max: 100
            },
            {
              name: '能力6',
              max: 100
            }
          ],
          name: {
            color: '#40586d',
            fontSize: 12
          },
          splitNumber: 3,
          splitArea: {
            areaStyle: {
              color: ['rgba(55, 162, 218, 0.15)', 'rgba(55, 162, 218, 0.25)', 'rgba(55, 162, 218, 0.35)']
            }
          },
          axisLine: {
            lineStyle: {
              color: "#fff"
            }
          },
          splitLine: {
            lineStyle: {
              color: "#fff"
            }
          }
        },
        series: [{
          type: 'radar',
          data: [{
            value: this.data.kid.radar
          }]
        }],
        color: ["#37A2DA"]
      }
      radarChart.setOption(radarOpt)
      this.radarChart = radarChart
      return radarChart
    })

    this.pieComponent = this.selectComponent('#pie')
    this.pieComponent.init((canvas, width, height) => {
      const pieChart = echarts.init(canvas, null, {
        width: width,
        height: height
      })
      var pieOpt = {
        backgroundColor: "#ffffff",
        series: [{
          type: 'pie',
          radius: '87%',
          data: [{
            name: '分类1',
            value: this.data.kid.pie[0]
          }, {
            name: '分类2',
            value: this.data.kid.pie[1]
          }, {
            name: '分类3',
            value: this.data.kid.pie[2]
          }, {
            name: '分类4',
            value: this.data.kid.pie[3]
          }, {
            name: '分类5',
            value: this.data.kid.pie[4]
          }],
          color: ["#37A2DA", "#32C5E9", "#67E0E3", "#91F2DE", "#FFDB5C", "#FF9F7F"],
          label: {
            show: true,
            position: 'inside',
            fontSize: 12
          },
          emphasis: {
            label: {
              formatter: "{b}:\n{d}%",
              fontSize: 13
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 5, 0.3)'
            }
          }
        }]
      }
      pieChart.setOption(pieOpt)
      this.pieChart = pieChart
      return pieChart
    })

    this.lineComponent = this.selectComponent('#line')
    this.lineComponent.init((canvas, width, height) => {
      const lineChart = echarts.init(canvas, null, {
        width: width,
        height: height
      })
      var lineOpt = {
        backgroundColor: "#ffffff",
        grid: {
          top: 45,
          left: 25,
          bottom: 20,
          right: 25,
          containLabel: true
        },
        xAxis: {
          type: 'time',
          splitLine: {
            show: false,
            lineStyle: {
              color: "#ccc"
            }
          },
          axisTick: {
            inside: true,
            interval: 0
          }
        },
        yAxis: {
          type: 'value',
          name: '单位:分钟',
          axisTick: {
            inside: true
          }
        },
        series: [{
          type: 'line',
          data: [
            ['2018-07-28', this.data.kid.line[0]],
            ['2018-07-29', this.data.kid.line[1]],
            ['2018-07-30', this.data.kid.line[2]],
            ['2018-07-31', this.data.kid.line[3]],
            ['2018-08-01', this.data.kid.line[4]], //后续将改为实时日期刻度
          ],
          lineStyle: {
            type: 'solid'
          }
        }],
        color: ["#37A2DA"],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            axis: 'x',
            lineStyle: {
              color: "#ccc"
            },
            label: {
              show: true
            }
          }
        }
      }
      lineChart.setOption(lineOpt)
      this.lineChart = lineChart
      return lineChart
    })

    this.barComponent = this.selectComponent('#bar')
    this.barComponent.init((canvas, width, height) => {
      const barChart = echarts.init(canvas, null, {
        width: width,
        height: height
      })
      var barOpt = {
        backgroundColor: "#ffffff",
        grid: {
          top: 45,
          left: 25,
          bottom: 20,
          right: 25,
          containLabel: true
        },
        xAxis: {
          type: 'category',
          splitLine: {
            show: false,
            lineStyle: {
              color: "#ccc"
            }
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          name: '单位:分钟',
          axisTick: {
            inside: true
          }
        },
        series: [{
          type: 'bar',
          data: [
            ['07-28', this.data.kid.line[0]],
            ['07-29', this.data.kid.line[1]],
            ['07-30', this.data.kid.line[2]],
            ['07-31', this.data.kid.line[3]],
            ['08-01', this.data.kid.line[4]], //后续将改为实时日期刻度
          ],

        }],
        color: ["#37A2DA"],
        label: {
          show: true,
          position: 'outside'
        }
      }
      barChart.setOption(barOpt)
      this.barChart = barChart
      return barChart
    })
  }
})