<template>
  <div class="date_picker">
    <div class="year_month">
      <div class="year">
        <span @click="selectYear>currentYear?selectYear--:''"><</span>
        <span>{{selectYear}}年</span>
        <span @click="selectYear>=currentYear?selectYear++:''">></span>
      </div>
      <div class="month">
        <span @click="prevMonth"><</span>
        <span>{{selectMonth+1}}月</span>
        <span @click="nextMonth">></span>
      </div>
    </div>
    <ul class="weeks">
      <li v-for="day in weekList">{{day}}</li>
    </ul>
    <ul class="dates"
        :class="{
        currentMonth:   currentMonth===selectMonth,
        currentYear:    currentYear===selectYear}">
      <li v-for="date in dateList"
          :class="{
          weekend:      date.weekend,
          today:        date.date===currentDate,
          prevMonth:    date.month<currentMonth,
          nextMonth:    date.month>currentMonth,
          selectedDate: date.date===selectDate&&date.month===selectMonth&&!date.weekend,
          before:       ((date.month<currentMonth)||(date.month===currentMonth&&date.date<currentDate))&&selectYear<=currentYear
          }"
          @click="selectedDate(date,$event)"
      >{{date.date}}</li>
    </ul>
    <div class="btn_wrap">
      <button @click="ok">确定</button>
      <button @click="cancel">取消</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'date_selecter',
    props: ['initDate'],
    data () {
      let now = new Date()
      return {
        dayNumArr: [31, 0, 31, 30, 31, 30, 31, 30, 31, 30, 31, 30],
        weekList: ['日', '一', '二', '三', '四', '五', '六'],
        currentYear: now.getFullYear(),
        selectYear: now.getFullYear(),
        currentMonth: now.getMonth(),
        selectMonth: now.getMonth(),
        currentDate: now.getDate(),
        selectDate: now.getDate(),
        currentDay: now.getDay()
      }
    },
    created () {
      // 计算当年是否是闰年,以此修正二月天数
      let dayNum = 28 + this.isLeap(this.selectYear)
      this.dayNumArr[1] = dayNum
      console.log(this.initDate, 'initDate')
    },
    methods: {
      selectedDate (date, ev) {
        let classStr = ev.target.classList.value
        if (/before/.test(classStr) || /weekend/.test(classStr)) {
          return
        }
        if (this.selectMonth > 10) {
          // 点击下一个月的日期时,跳转到下一月
        } else if (date.next) {
          this.selectMonth++
          // 点击上一个月的日期时,跳转到上一个月
        } else if (date.prev) {
          this.selectMonth--
        }
        this.selectDate = date.date
      },
      isLeap (year) {
        return year % 4 === 0 ? (year % 100 !== 0 ? 1 : (year % 400 === 0 ? 1 : 0)) : 0
      },
      prevMonth () {
        if (this.selectMonth > 0) {
          this.selectMonth--
        } else {
          this.prevYear()
        }
      },
      nextMonth () {
        if (this.selectMonth < 11) {
          this.selectMonth++
        } else {
          this.nextYear()
        }
      },
      prevYear () {
        this.selectYear--
        this.selectMonth = 11
      },
      nextYear () {
        this.selectYear++
        this.selectMonth = 0
      },
      ok () {
        this.$emit('done', this.finalDate.join('-'))
      },
      cancel () {
        this.$emit('done', this.initDate)
      }
    },
    computed: {
      // 计算当前选中月的第一天是星期几
      dateWeek () {
        let day = new Date(this.selectYear, this.selectMonth, 1).getDay()
        return day
      },
      dateList () {
        let list = []
        let dateWeek = this.dateWeek
        let len = this.dayNumArr[this.selectMonth]
        let gap = this.dayNumArr[this.selectMonth - 1] - dateWeek
        let totalCell = len + dateWeek
        if (totalCell > 35) {
          totalCell = 42
        } else if (totalCell > 28) {
          totalCell = 35
        }
        for (let i = 0; i < totalCell; i++) {
          list.push({
            month: this.selectMonth,
            date: 0,
            day: i % 7,
            weekend: i % 7 === 0 || i % 7 === 6
          })
          // 日期超过一个月的总天数
          if (i > len + dateWeek - 1) {
            list[i].date = i - len - dateWeek + 1
            list[i].month = this.selectMonth + 1
            list[i].next = true
            // 日期超过当月第一天的星期数(进入正常取值范围)
          } else if (i >= dateWeek) {
            list[i].date = i + 1 - dateWeek
            // 用上个月的日期补足当月前面不足部分
          } else {
            if (gap + i + 1) {
              list[i].date = gap + i + 1
              list[i].month = this.selectMonth - 1
            } else {
              gap = this.dayNumArr[11] - dateWeek
              list[i].date = gap + i + 1
              list[i].month = this.selectMonth - 1
            }
            list[i].prev = true
          }
        }
        return list
      },
      finalDate () {
        let month = this.selectMonth + 1 < 10 ? '0' + (this.selectMonth + 1) : this.selectMonth + 1
        let result = [this.selectYear, month, this.selectDate]
        return result
      }
    }
  }
</script>

<style rel="stylesheet/less" lang="less">
  .date_picker {
    width: 240px;
    margin: 0 auto;
    background-color: #fff;
    .year_month{
      overflow: hidden;
      text-align: center;
      >div{
        width: 50%;
        float: left;
        overflow: hidden;
        text-align: center;
        span{
          width: 30%;
          color: #fff;
          float: left;
          line-height: 30px;
          text-align: center;
          background-color: yellowgreen;
          &:nth-child(2){
            width: 40%;
          }
        }
      }
    }
    > ul {
      margin: 0;
      padding: 0;
      list-style: none;
      overflow: hidden;
      li {
        float: left;
        height: 30px;
        width: 14.28%;
        line-height: 30px;
        text-align: center;
        box-sizing: border-box;
        border: 1px solid #999;
        &.selectedDate{
          color: #fff;
          background-color: #1870E5;
        }
        &.weekend{
          color: #ccc;
        }
      }
      &.currentYear{
        li{
          &.before,
          &.prevMonth,
          &.nextMonth{
            color: #ccc;
          }
        }
        &:not(.currentMonth){
          .nextMonth{
            color: #000;
          }
          .weekend{
            color: #ccc;
          }
        }
      }
    }
    .btn_wrap{
      overflow: hidden;
      font-size: 0;
      button{
        color: #fff;
        margin: 10px;
        border: none;
        outline: none;
        font-size: 16px;
        padding: 5px 20px;
        border-radius: 5px;
        display: inline-block;
        &:first-child{
          background-color: #1c80e6;
        }
        &:last-child{
          background-color: orangered;
        }
      }
    }
  }
</style>
