<template>
  <div class="scroller">
    <div class="content">
      <div class="wrapper" id="wrapper" ref="wrap">
        <div class="slider" id="slider">
          <ul class="list" id="list" ref="list">
            <li v-for="index in news">item {{index}}</li>
          </ul>
          <div class="loading" ref="loader">
            加载中...
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  export default {
    name: 'scroller',
    data () {
      return {
        news: 50,
        listH: 0,
        wrapH: 0,
        isLoad: false
      }
    },
    created () {
      this.$nextTick(() => {
        setTimeout(() => {
          console.log('init')
          this._initHtml()
          console.log(this.listH)
          this._initScroller()
        })
      })
    },
    methods: {
      _initScroller () {
        if (!this.scroller) {
          this.scroller = new BScroll(this.$refs.wrap, {
            click: true,
            probeType: 3
          })
          this.scroller.on('scroll', pos => {
            // 接近底部
            if (this.listH - this.wrapH - 50 <= Math.abs(pos.y) && !this.isLoad) {
              this.isLoad = true
              this.$refs.loader.classList.add('show-loader')
              // 异步请求
              setTimeout(() => {
                this.pro = new window.Promise((res, rej) => {
                  if (this.news < 150) {
                    this.news += 10
                    res()
                  } else {
                    rej()
                  }
                })
                this.pro.then(
                    // 数据成功返回
                  res => {
                    this.isLoad = false
                    this.$refs.loader.classList.remove('show-loader')
                  },
                    // 没有更多数据
                  rej => {
                    this.isLoad = true
                    this.$refs.loader.innerHTML = '加载完成!'
                  })
              }, 2000)
            }
          })
        }
      },
      _initHtml () {
        this.listH = this.$refs.list.offsetHeight
        this.wrapH = this.$refs.wrap.offsetHeight
      }
    },
    watch: {
      news () {
        console.log('change')
        this.$nextTick(() => {
          this._initHtml()
          this.scroller.refresh()
        })
      }
    }
  }
</script>

<style rel="stylesheet/less" lang="less">
  @r: 75rem;
  .scroller {
    .content {
      height: 14rem;
      overflow: hidden;
      .wrapper {
        overflow: hidden;
        height: 100%;
      }
    }
    .footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 100/@r;
      background-color: #fff;
      box-shadow: 0 -3px 10px #bbb;
    }
    .loading {
      transform: scale(0);
    }
    .show-loader {
      transition: 1s liear;
      transform: scale(1);
    }
  }
</style>
