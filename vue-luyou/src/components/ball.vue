<template>
  <div class="ball">
    <div class="list-wrap" ref="wrap">
      <ul class="goods-list">
        <li class="goods-item" v-for="index in 50">
          <i class="add" @click="drop">+</i>
        </li>
      </ul>

    </div>

    <div class="foot">
      <div class="kuan" ref="kuan">
        <transition-group name="drop"
                          @beforeEnter="beforeDrop"
                          @enter="droping"
                          @afterEnter="afterDrop">
          <div class="ball_wrap" :key="index" v-for="(ball, index) in balls" v-show="ball.show">
            <div class="ball"></div>
          </div>
        </transition-group>
      </div>
      <div class="kuan" ref="fake"
           @animationend="animationend" @animationstart="animationStart">

      </div>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  export default {
    name: 'ball',
    data () {
      return {
        balls: [
          {show: false},
          {show: false},
          {show: false},
          {show: false},
          {show: false}
        ],
        dropBalls: []
      }
    },
    methods: {
      _initScroller () {
        if (!this.scroller) {
          this.scroller = new BScroll(this.$refs.wrap, {
            click: true
          })
          console.log('init')
        } else {
          console.log('refresh')
          this.scroller.refresh()
        }
      },
      drop (ev) {
        let el = ev.target
        for (var i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i]
          if (!ball.show) {
            ball.el = el
            ball.show = true
            this.dropBalls.push(ball)
            return
          }
        }
      },
      beforeDrop (el) {
        let len = this.balls.length
        while (len--) {
          let ball = this.balls[len]
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect()
            let inner = el.children[0]
            let x = rect.left
            let y = rect.top
            let halfT = document.getElementsByClassName('foot')[0].clientHeight / 2
            let top = document.documentElement.clientHeight - y - halfT - 7
            el.style.display = ''
            el.style.transform = `translate3d(0,${-top}px,0)`
            inner.style.transform = `translate3d(${x}px,0,0)`
            el.style.webkitTransform = `translate3d(0,${-top}px,0)`
            inner.style.webkitTransform = `translate3d(${x - 15}px,0,0)`
            break
          }
        }
      },
      droping (el) {
        console.log(el.offsetHeight)
        this.$nextTick(() => {
          let inner = el.children[0]
          el.style.transform = `translate3d(0,0,0)`
          inner.style.transform = `translate3d(0,0,0)`
          el.style.webkitTransform = `translate3d(0,0,0)`
          inner.style.webkitTransform = `translate3d(0,0,0)`
        })
      },
      afterDrop (el) {
        let ball = this.dropBalls.shift()
        this.$refs.fake.classList.remove('shake')
        this.$nextTick(() => {
          setTimeout(() => {
            this.$refs.fake.classList.add('shake')
          }, 0)
        })
        if (ball) {
          ball.show = false
          el.style.display = 'none'
        }
      },
      animationStart () {
        let fake = this.$refs.fake
        fake.style.transform = 'scale(1)'
      },
      animationend () {
        this.$refs.fake.classList.remove('shake')
        this.$refs.fake.style.transform = 'none'
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm._initScroller()
      })
    },
    created () {
      this.$nextTick(() => {
        this._initScroller()
      })
    }
  }
</script>

<style rel="stylesheet/less" lang="less">
  @r: 32.5rem;
  .ball {
    height: 100%;
    background-color: #999;
    .list-wrap{
      height: 100%;
      overflow: hidden;
      .goods-list {
        .goods-item {
          height: 50/@r;
          line-height: 50/@r;
          text-align: right;
          padding-right: 50/@r;
          background-color: yellowgreen;
          border-bottom: 1px solid darkblue;
          .add {
            color: #fff;
            width: 15/@r;
            height: 15/@r;
            font-size: 36px;
            line-height: 15/@r;
            border-radius: 50%;
            font-style: normal;
            font-weight: bold;
            text-align: center;
            display: inline-block;
            vertical-align: middle;
            background-color: orangered;
          }
        }
      }
    }
    .foot {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      height: 30/@r;
      background-color: #f4f4f4;
      .kuan {
        width: 30/@r;
        height: 100%;
        background-color: darkcyan;
        line-height: 50px;
        text-align: center;
        position: absolute;
        .ball_wrap {
          position: absolute;
          display: inline-block;
          vertical-align: middle;
          .ball {
            position: absolute;
            width: 10/@r;
            height: 10/@r;
            border-radius: 50%;
            background-color: orangered;
          }

        }
      }
    }
    .shake {
      animation: shake .6s;
    }
    @keyframes shake {
      20% {
        transform: scale(.8);
      }
      40% {
        transform: scale(1.5);
      }
      60% {
        transform: scale(0.9);
      }
      80% {
        transform: scale(1.3);
      }
      100% {
        transform: scale(1);
      }
    }

    .drop-enter-active {
      transition: all .5s cubic-bezier(0.49, -0.29, 0.75, 0.41);
      .ball {
        transition: all .5s linear;
      }
    }
  }
</style>
