<template>
  <div class="wrapper clearfix">
    <div class="calendar_wrapper">
      <div class="toggle_wrapper clearfix">
        <div class="year_wrapper">
          <span class="prev icon-circle-left pointer" @click="reduceYear"></span>
          <span class="year">{{year}}</span>
          <span class="next icon-circle-right pointer" @click="addYear"></span>
          年
        </div>
        <div class="month_wrapper">
          <span class="prev icon-circle-left pointer" @click="reduceMonth"></span>
          <span class="months">
            <span v-for="m in monthsArr" :class="{currentmonth: m == month}" class="month pointer"
                  @click="changeMonth($event, m)">{{m+1}}</span>
          </span>
          <span class="next icon-circle-right pointer" @click="addMonth"></span>
          <span>月</span>
        </div>
        <div class="range_wrapper">
          <span>单日</span>
          |
          <span class="deepcolor">区间</span>
          <span>(范围：{{begin_time | formatTime}}至{{end_time | formatTime}})</span>
        </div>
      </div>
      <div class="date_container clearfix">
        <div v-for="(week, index) in daysArr.slice(0, 5)" class="weeks">
          <ul class="days clearfix">
            <li>一</li>
            <li>二</li>
            <li>三</li>
            <li>四</li>
            <li>五</li>
            <li>六</li>
            <li>日</li>
          </ul>
          <ul class="dates clearfix">
            <li class="pointer"
                :class="{gray:d.day === '', currentday: (d.time - begin_time)>=0&&(end_time - d.time)>=0, dialog: d.time == begin_time}"
                v-for="d in daysArr.slice(index*7, (index+1)*7)" @click="selectTime($event, d)">{{d.date_i}}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import {mapState} from 'vuex'
  export default {
    props: {},
    data () {
      return {
        realMonth: null,
        realDate: null,
        realYear: null,
        date: null,
        month: null,
        year: null,
        daysArr: [],
        monthsArr: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
      }
    },
    created () {
      let nowTime = new Date()
      // 今年
      this.year = nowTime.getFullYear()
      this.realYear = nowTime.getFullYear()
      // 今月 从0开始
      this.realMonth = nowTime.getMonth()
      this.month = nowTime.getMonth()
      // 今日
      this.date = nowTime.getDate()
      this.realDate = nowTime.getDate()
      // 这个月第一天
      let firstDay = new Date(this.year, this.month, 1)
      // 这个月最后一天
      this._getMonthDays(this.year, this.month)
    },
    methods: {
      // 获得当月的最后一天
      _getLastDay (year, month) {
        var new_year = year //取当前的年份
        month++ //取下一个月的第一天，方便计算（最后一天不固定）
        if (month > 12) {
          new_month = 1; //月份减
          new_year++; //年份增
        }
        var new_date = new Date(new_year, month, 1); //取当年下月中的第一天
        return (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)); //获取当月最后一天日期
      },
      // 获取当前月份的所有日期数据
      _getMonthDays (year, month) {
        this.daysArr = []
        let lastDay = this._getLastDay(year, month).getDate() //当月的最后一天
        let lastMothLastDay = this._getLastDay(year, month - 1).getDate() // 获取上一月的最后一天
        for (let i = 1; i < lastDay + 1; i++) {
          let day = new Date(year, month, i).getDay() // 星期数
          let date_i = new Date(year, month, i).getDate() // 日数
          let date_item = {
            day: day,
            date_i: date_i,
            month: month,
            year: year,
            time: (new Date(year, month, date_i)).getTime()
          }
//          console.log(this.begin_time,date_item.time,this.end_time,(date_item.time - this.begin_time)>=0&&(this.end_time - date_item.time)>=0);
          if (i == 1) {
            if (day > 1) { // 2,3,4,5,6
              for (let i = 0; i < day - 1; i++) { // 31   26 27 28 29 30 31  0 day = 0
                this.daysArr.push({
                  day: '',
                  date_i: lastMothLastDay - day + 2 + i,
                  month: month,
                  year: year,
                  time: (new Date(year, month, (lastMothLastDay - day + 2 + i))).getTime()
                })
              }
            } else if (day == 0) { // 0
              for (let i = 0; i < 6; i++) {
                this.daysArr.push({
                  day: '',
                  date_i: lastMothLastDay - 5 + i,
                  month: month,
                  year: year,
                  time: (new Date(year, month, (lastMothLastDay - 5 + i))).getTime()
                })
              }
            }
          }
          this.daysArr.push(date_item)
          if (i == (lastDay)) {
            if (0 < day <= 6) { //1,2,3,4,5,6
              for (let i = 0; i < 7 - day; i++) {
                this.daysArr.push({
                  day: '',
                  date_i: i + 1,
                  month: month,
                  year: year,
                  time: (new Date(year, month, (i + 1))).getTime()
                })
              }
            }
          }
        }
//        console.log(this.daysArr);
      },
      // 使当前月份加
      addMonth () {
        this.month = this.month + 1
        // 当前月份为12月 年加1 月等于0
        if (this.month > 11) {
          this.year = this.year + 1
          this.month = 0
        }
        this._getMonthDays(this.year, this.month)
      },
      // 使当前月份减
      reduceMonth () {
        this.month = this.month - 1
        // 当前月份为1月 年减1 月等于11
        if (this.month < 0) {
          this.year = this.year - 1
          this.month = 11
        }
        this._getMonthDays(this.year, this.month)
      },
      // 点击修改月份
      changeMonth (event, m) {
        this.month = m
        this._getMonthDays(this.year, this.month)
      },
      // 使年份加
      addYear () {
        this.year = this.year + 1
        this._getMonthDays(this.year, this.month)
      },
      // 使年份减
      reduceYear () {
        this.year = this.year - 1
        this._getMonthDays(this.year, this.month)
      },
      // 选择时间
      selectTime (event, i) {
        // 获取当前点击选择的时间的时间戳
        let select_time = (new Date(i.year, i.month, i.date_i)).getTime()
        // 往后点
        if (select_time >= this.begin_time) {
          if (select_time <= this.end_time) {
            // 距离开始位置的长度小于距离结束位置的长度
            if ((select_time - this.begin_time) < this.end_time - select_time) {
              this.$store.commit('changeEnd_time', select_time)
//              console.log('end');
            } else {
              // 距离开始位置的长度大于或等于距离结束位置的长度
              this.$store.commit('changeBegin_time', select_time)
//              console.log('begin');
            }
//            this.$store.commit('changeBegin_time', select_time)
          } else {
            this.$store.commit('changeEnd_time', select_time)
          }
        }
        // 往前点
        if (select_time < this.begin_time) {
          this.$store.commit('changeBegin_time', select_time)
        }
//        console.log(this.begin_time, this.end_time, select_time);
      }
    },
    components: {},
    computed: {
      ...mapState([
        'end_time',
        'begin_time'
      ])
    },
    filters: {
      formatTime (val) {
        return moment(val).format('YYYY-MM-DD')
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  /*日历外部包裹区*/
  ul{
    list-style none
    margin 0
    padding 0
  }
  .wrapper {
    width: 100%;
    min-width: 768px;
    background: #F4F9FD;
    border-top: 10px solid #84C2F1;
    font-size: 0;
    overflow: hidden;
    padding: 0 15px 15px 15px;
    border-top: 10px solid #84c2f1;
  }

  *::selection {
    background: transparent;
  }

  .calendar_wrapper, .export_wrapper {
    /*float: left;*/

  }

  /*左边日历内容区-----------------------------*/

  /*左边日历内容区-----------------------------*/
  .calendar_wrapper {
    width: 100%;
  }

  /*上下结构*/
  /*上方日期切换---------------*/
  .toggle_wrapper {
    overflow: hidden;
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    color: #9A9EA1;
  }

  /*向前向后箭头*/
  .prev, .next {
  }

  .year_wrapper, .month_wrapper {
    float: left;
  }

  /*年份*/
  .year_wrapper {
    margin-right: 50px;
  }

  .year_wrapper .year {
    font-size: 20px;
    color: #6D9EE3;
    margin: 0 6px;
    font-weight: 600;
  }

  /*当前月份样式*/
  .month_wrapper .month {
    padding: 0 3px;
  }

  .month_wrapper .currentmonth {
    color: #6E6F73;
    font-size: 20px;
    font-weight: 600;
  }

  .range_wrapper {
    float: right;
    margin-right: 10px;
  }

  .range_wrapper .deepcolor {
    color: #3A3A3A;
    margin-right: 20px;
  }

  /*下方日期详情-------------------*/
  .date_container {
  }

  .date_container > .weeks {
    float: left;
    background: #FFF;
    width: calc(20% - 10px);
    font-size: 16px;
    box-sizing: border-box;
    border: 1px solid #CEE4EF;
    margin-right: 10px;
    padding: 1px;
  }

  .weeks li {
    text-align: center;
    float: left;
    width: calc(14% - 4px);
    box-sizing: border-box;
    /*border-left: 6px solid #fff;*/
    /*border-right: 6px solid #fff;*/
    margin: 0 2px;
    line-height: 30px;
    height: 30px;
  }

  /*@media */

  .weeks .days {
    color: #4F9DC4;
  }

  .weeks .dates {
    color: #3A3A3A;
  }

  .dates .gray {
    color: #cccccc;
    pointer-events: none;
  }

  /*当前日期样式*/
  .dates .currentday:not(.gray) {
    color: #fff;
    background: #FF9900;
    border-radius: 3px;
    position: relative;
  }

  /*请选择结束时间*/
  .dates .dialog:after {
    content: '请选择时间';
    display: block;
    position: absolute;
    background: rgba(0, 0, 0, .7);
    font-size: 14px;
    border-radius: 4px;
    bottom: 58px;
    left: -10px;
    white-space: nowrap;
    width: 90px;
  }

  .dates .dialog:before {
    content: '';
    width: 0;
    display: block;
    position: absolute;
    top: -28px;
    left: 5px;
    border: 5px solid transparent;
    border-top: 5px solid rgba(0, 0, 0, .7);
  }
</style>
